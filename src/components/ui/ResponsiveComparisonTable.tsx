import { ReactNode } from 'react';

export interface ResponsiveComparisonColumn {
  key: string;
  label: ReactNode;
  mobileLabel?: ReactNode;
  widthClassName?: string;
  align?: 'left' | 'center' | 'right';
  headerClassName?: string;
  cellClassName?: string;
}

export interface ResponsiveComparisonRow {
  key: string;
  cells: Record<string, ReactNode>;
  rowClassName?: string;
  mobileCardClassName?: string;
}

interface ResponsiveComparisonTableProps {
  columns: ResponsiveComparisonColumn[];
  rows: ResponsiveComparisonRow[];
  primaryColumnKey?: string;
  showPrimaryColumnInMobileDetails?: boolean;
  className?: string;
  caption?: ReactNode;
  tableClassName?: string;
  desktopWrapperClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyClassName?: string;
  cellClassName?: string;
  mobileContainerClassName?: string;
  mobileCardClassName?: string;
  mobileTitleClassName?: string;
  mobileLabelClassName?: string;
  mobileValueClassName?: string;
}

const ALIGNMENT_CLASSES = {
  left: {
    header: 'text-left',
    cell: 'text-left',
    mobileValue: 'text-left',
  },
  center: {
    header: 'text-center',
    cell: 'text-center',
    mobileValue: 'text-center',
  },
  right: {
    header: 'text-right',
    cell: 'text-right',
    mobileValue: 'text-right',
  },
} as const;

export default function ResponsiveComparisonTable({
  columns,
  rows,
  primaryColumnKey,
  showPrimaryColumnInMobileDetails = false,
  className = '',
  caption,
  tableClassName = 'w-full text-sm border-collapse rounded-card overflow-hidden shadow-sm',
  desktopWrapperClassName = 'hidden md:block overflow-x-auto',
  headerRowClassName = 'bg-primary-300 text-white',
  headerCellClassName = 'p-3 font-semibold',
  bodyClassName = '',
  cellClassName = 'p-3',
  mobileContainerClassName = 'md:hidden space-y-3',
  mobileCardClassName = 'rounded-card border border-gray-200 bg-white p-4 shadow-sm',
  mobileTitleClassName = 'text-sm font-semibold text-gray-900 mb-3',
  mobileLabelClassName = 'text-xs font-medium text-gray-600',
  mobileValueClassName = 'text-sm text-gray-900 text-right',
}: ResponsiveComparisonTableProps) {
  if (columns.length === 0) {
    return null;
  }

  const mobileDetailColumns = columns.filter(
    (column) => showPrimaryColumnInMobileDetails || column.key !== primaryColumnKey
  );

  return (
    <div className={className}>
      <div className={mobileContainerClassName}>
        {rows.map((row) => {
          const primaryContent = primaryColumnKey ? row.cells[primaryColumnKey] : null;
          return (
            <article
              key={row.key}
              className={`${mobileCardClassName} ${row.mobileCardClassName ?? ''}`}
            >
              {primaryContent && <h3 className={mobileTitleClassName}>{primaryContent}</h3>}
              <dl className="space-y-2">
                {mobileDetailColumns.map((column) => {
                  const value = row.cells[column.key];
                  if (value === null || value === undefined || value === '') {
                    return null;
                  }

                  const alignment = ALIGNMENT_CLASSES[column.align ?? 'left'];
                  return (
                    <div
                      key={`${row.key}-${column.key}`}
                      className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-start gap-3"
                    >
                      <dt className={`min-w-0 break-words ${mobileLabelClassName}`}>
                        {column.mobileLabel ?? column.label}
                      </dt>
                      <dd
                        className={`min-w-0 break-words ${mobileValueClassName} ${alignment.mobileValue}`}
                      >
                        {value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </article>
          );
        })}
      </div>

      <div className={desktopWrapperClassName}>
        <table className={tableClassName}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} className={column.widthClassName} />
            ))}
          </colgroup>
          <thead>
            <tr className={headerRowClassName}>
              {columns.map((column) => {
                const alignment = ALIGNMENT_CLASSES[column.align ?? 'left'];
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={`${headerCellClassName} ${alignment.header} ${column.headerClassName ?? ''}`}
                  >
                    {column.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={bodyClassName}>
            {rows.map((row) => (
              <tr key={row.key} className={row.rowClassName}>
                {columns.map((column) => {
                  const alignment = ALIGNMENT_CLASSES[column.align ?? 'left'];
                  const className = `${cellClassName} ${alignment.cell} ${column.cellClassName ?? ''}`;
                  const cellContent = row.cells[column.key];

                  if (column.key === primaryColumnKey) {
                    return (
                      <th key={`${row.key}-${column.key}`} scope="row" className={className}>
                        {cellContent}
                      </th>
                    );
                  }

                  return (
                    <td key={`${row.key}-${column.key}`} className={className}>
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
