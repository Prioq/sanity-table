import { definePlugin, defineType } from 'sanity';

import {
  createTableComponent,
  TableComponent,
} from './components/TableComponent';
import { TablePreview } from './components/TablePreview';
export type {
  TableProps,
  TableRow,
  TableValue,
} from './components/TableComponent';

export { TableComponent, TablePreview };

export interface TableConfig {
  rowType?: string;
  cellSchema?: {
    name: string;
    type: string;
    of: Array<{
      type: string;
      [key: string]: unknown;
    }>;
  };
}

export const table = definePlugin<TableConfig | void>(config => {
  // Define the default block content schema for cells
  const defaultCellSchema = {
    name: 'tableCell',
    type: 'array',
    of: [
      {
        type: 'block',
        styles: [{ title: 'Normal', value: 'normal' }],
        lists: [],
        marks: {
          decorators: [
            { title: 'Strong', value: 'strong' },
            { title: 'Emphasis', value: 'em' },
          ],
          annotations: [],
        },
      },
    ],
  };

  // Use custom cell schema if provided, otherwise use default
  const cellSchema = config?.cellSchema || defaultCellSchema;

  const tableRowSchema = defineType({
    title: 'Table Row',
    name: config?.rowType || 'tableRow',
    type: 'object',
    fields: [
      {
        name: 'cells',
        type: 'array',
        of: [cellSchema],
      },
    ],
  });

  const tableSchema = defineType({
    title: 'Table',
    name: 'table',
    type: 'object',
    fields: [
      {
        name: 'rows',
        type: 'array',
        of: [
          {
            type: tableRowSchema.name,
          },
        ],
      },
    ],
    components: {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      input: createTableComponent(tableRowSchema.name) as any,
      preview: TablePreview as any,
      /* eslint-enable @typescript-eslint/no-explicit-any */
    },
    preview: {
      select: {
        rows: 'rows',
        title: 'title',
      },
      prepare: ({ title, rows = [] }) => ({
        title,
        rows,
      }),
    },
  });

  return {
    name: 'table',
    schema: {
      types: [tableRowSchema, tableSchema],
    },
  };
});
