import { RemoveIcon } from '@sanity/icons';
import { Box, Button } from '@sanity/ui';
import { FormBuilderInput, useSchema } from 'sanity';

import type { PortableTextBlock, TableRow } from './TableComponent';

interface TableInputProps {
  rows: TableRow[];
  updateCell: (newValue: PortableTextBlock[], rowIndex: number, cellIndex: number) => void;
  removeRow: (index: number) => void;
  removeColumn: (index: number) => void;
}

export const TableInput = (props: TableInputProps): JSX.Element => {
  const { updateCell } = props;
  const schema = useSchema();
  
  // Get the tableCell schema type
  const tableCellType = schema.get('tableCell');

  const renderRowCell = (rowIndex: number) => {
    function RowCell(cell: PortableTextBlock[], cellIndex: number): JSX.Element {
      return (
        <td key={`cell-${rowIndex}-${cellIndex}`} style={{ minWidth: '200px' }}>
          {tableCellType && (
            <FormBuilderInput
              level={0}
              type={tableCellType}
              value={cell}
              onChange={(patchEvent): void => {
                // Extract the value from the patch event
                const value = patchEvent.patches.reduce((acc, patch) => {
                  if (patch.type === 'set' && patch.path.length === 0) {
                    return patch.value;
                  }
                  return acc;
                }, cell);
                
                updateCell(value, rowIndex, cellIndex);
              }}
            />
          )}
        </td>
      );
    }
    return RowCell;
  };

  const renderRow = (row: TableRow, rowIndex: number): JSX.Element => {
    const renderCell = renderRowCell(rowIndex);

    return (
      <tr key={`row-${rowIndex}`}>
        {row.cells.map(renderCell)}
        {
          <td key={rowIndex}>
            <Box marginLeft={1} style={{ textAlign: 'center' }}>
              <Button
                icon={RemoveIcon}
                padding={2}
                onClick={(): void => props.removeRow(rowIndex)}
                mode="bleed"
              />
            </Box>
          </td>
        }
      </tr>
    );
  };

  return (
    <table style={{ width: '100%' }}>
      <tbody>
        {props.rows.map(renderRow)}
        <tr>
          {(props.rows[0]?.cells || []).map((_, i) => (
            <td key={`column-${i}`}>
              <Box marginTop={1} style={{ textAlign: 'center' }}>
                <Button
                  icon={RemoveIcon}
                  padding={2}
                  onClick={(): void => props.removeColumn(i)}
                  mode="bleed"
                />
              </Box>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};
