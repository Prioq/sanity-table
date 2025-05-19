import { PortableText } from '@portabletext/react';
import { Box, Card, Grid, Inline, Label, Text } from '@sanity/ui';
import type { PreviewProps } from 'sanity';

import type { TableRow } from './TableComponent';
import { TableIcon } from './TableIcon';

interface ValueProps {
  rows?: TableRow[];
  title?: string;
}

// Simple component to render Portable Text content in preview
const PortableTextPreview = ({ value }: { value: unknown }): JSX.Element => {
  // If it's not an array or is empty, just return an empty string
  if (!Array.isArray(value) || value.length === 0) {
    return <Text>-</Text>;
  }

  // Use PortableText component to render the content
  return <PortableText value={value} />;
};

const Table = ({ rows }: { rows: TableRow[] }): JSX.Element => {
  const numCols = rows.length === 0 ? 0 : rows[0].cells.length;

  return (
    <Grid columns={numCols} padding={2}>
      {rows.map(row =>
        row.cells.map((cell, i) => (
          <Card
            key={`${row._key}-cell-${i}`}
            padding={2}
            style={{ outline: '1px solid #DFE2E9' }}
          >
            <PortableTextPreview value={cell} />
          </Card>
        ))
      )}
    </Grid>
  );
};

export const TablePreview = (props: ValueProps & PreviewProps): JSX.Element => {
  const { schemaType, rows = [], title = 'Title missing' } = props;

  return (
    <>
      <Box padding={3}>
        <Inline space={3}>
          <Card>
            <Label size={4}>
              <TableIcon />
            </Label>
          </Card>
          <Card>
            <Text>{schemaType?.title ?? title}</Text>
          </Card>
        </Inline>
      </Box>
      <Box padding={2}>
        {rows.length === 0 ? (
          <Label muted>Empty Table</Label>
        ) : (
          <Table rows={rows} />
        )}
      </Box>
    </>
  );
};
