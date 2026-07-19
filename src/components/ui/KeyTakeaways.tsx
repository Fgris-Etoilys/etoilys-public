import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import ResponsiveComparisonTable, {
  type ResponsiveComparisonColumn,
  type ResponsiveComparisonRow,
} from './ResponsiveComparisonTable';

const MAX_ITEM_COUNT = 5;

interface BaseKeyTakeawaysProps {
  className?: string;
}

export interface KeyTakeawaysTextItem {
  id: string;
  content: ReactNode;
}

export interface KeyTakeawaysMetricItem {
  id: string;
  value: ReactNode;
  label: ReactNode;
  detail?: ReactNode;
}

interface KeyTakeawaysBulletsProps extends BaseKeyTakeawaysProps {
  variant: 'bullets';
  items: readonly KeyTakeawaysTextItem[];
}

interface KeyTakeawaysMetricsProps extends BaseKeyTakeawaysProps {
  variant: 'metrics';
  items: readonly KeyTakeawaysMetricItem[];
}

interface KeyTakeawaysComparisonProps extends BaseKeyTakeawaysProps {
  variant: 'comparison';
  columns: readonly ResponsiveComparisonColumn[];
  rows: readonly ResponsiveComparisonRow[];
  items?: readonly KeyTakeawaysTextItem[];
  caption: ReactNode;
}

interface KeyTakeawaysWarningProps extends BaseKeyTakeawaysProps {
  variant: 'warning';
  message: ReactNode;
  items?: readonly KeyTakeawaysTextItem[];
}

export type KeyTakeawaysProps =
  | KeyTakeawaysBulletsProps
  | KeyTakeawaysMetricsProps
  | KeyTakeawaysComparisonProps
  | KeyTakeawaysWarningProps;

function isDevelopmentRuntime() {
  return typeof import.meta.env !== 'undefined' && import.meta.env.DEV;
}

function validateMaxItems(items: readonly unknown[] | undefined, label: string) {
  if (isDevelopmentRuntime() && items && items.length > MAX_ITEM_COUNT) {
    throw new Error(`${label} accepts at most ${MAX_ITEM_COUNT} items, received ${items.length}`);
  }
}

function validateComparisonRows(rows: readonly unknown[]) {
  if (isDevelopmentRuntime() && (rows.length < 2 || rows.length > 3)) {
    throw new Error(`KeyTakeaways comparison expects 2 or 3 rows, received ${rows.length}`);
  }
}

function BulletList({ items }: { items: readonly KeyTakeawaysTextItem[] }) {
  return (
    <ul className="space-y-3 text-gray-700">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <span className="mt-0.5 shrink-0 font-bold text-primary-400" aria-hidden="true">
            •
          </span>
          <span>{item.content}</span>
        </li>
      ))}
    </ul>
  );
}

export default function KeyTakeaways(props: KeyTakeawaysProps) {
  const headingId = 'article-key-takeaways';
  const className = props.className ?? '';

  if (props.variant === 'comparison') {
    validateComparisonRows(props.rows);
    validateMaxItems(props.items, 'KeyTakeaways comparison');

    return (
      <section
        aria-labelledby={headingId}
        className={`mb-12 rounded-card border-l-4 border-primary-300 bg-primary-100 p-6 ${className}`}
      >
        <h2 id={headingId} className="mb-4 text-h4">
          À retenir
        </h2>
        <ResponsiveComparisonTable
          className={props.items && props.items.length > 0 ? 'mb-6' : ''}
          {...(props.columns[0] ? { primaryColumnKey: props.columns[0].key } : {})}
          columns={[...props.columns]}
          rows={[...props.rows]}
          caption={props.caption}
          tableClassName="w-full border-collapse text-sm"
          desktopWrapperClassName="hidden overflow-x-auto md:block"
          headerRowClassName="bg-primary-300 text-white"
          headerCellClassName="p-3 font-semibold"
          cellClassName="p-3"
          mobileContainerClassName="space-y-3 md:hidden"
          mobileCardClassName="rounded-card border border-primary-200 bg-white p-4 shadow-sm"
          mobileTitleClassName="mb-3 text-sm font-semibold text-gray-900"
          mobileLabelClassName="text-xs font-medium text-gray-600"
          mobileValueClassName="text-sm text-gray-900 text-right"
        />
        {props.items && props.items.length > 0 && <BulletList items={props.items} />}
      </section>
    );
  }

  if (props.variant === 'metrics') {
    validateMaxItems(props.items, 'KeyTakeaways metrics');

    return (
      <section
        aria-labelledby={headingId}
        className={`mb-12 rounded-card border-l-4 border-primary-300 bg-primary-100 p-6 ${className}`}
      >
        <h2 id={headingId} className="mb-4 text-h4">
          À retenir
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {props.items.map((item) => (
            <div key={item.id} className="rounded-card border border-primary-200 bg-white p-4">
              <dt className="text-sm font-medium text-gray-600">{item.label}</dt>
              <dd className="mt-2">
                <div className="text-2xl font-semibold text-themePrimary-1">{item.value}</div>
                {item.detail && <div className="mt-2 text-sm text-gray-700">{item.detail}</div>}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  if (props.variant === 'warning') {
    validateMaxItems(props.items, 'KeyTakeaways warning');

    return (
      <aside
        aria-labelledby={headingId}
        className={`mb-12 rounded-card border-l-4 border-warning-400 bg-warning-100 p-6 ${className}`}
      >
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500" aria-hidden="true" />
          <h2 id={headingId} className="text-h4">
            À retenir
          </h2>
        </div>
        <p className="mb-4 font-medium leading-comfortable text-gray-900">{props.message}</p>
        {props.items && props.items.length > 0 && <BulletList items={props.items} />}
      </aside>
    );
  }

  validateMaxItems(props.items, 'KeyTakeaways bullets');

  return (
    <section
      aria-labelledby={headingId}
      className={`mb-12 rounded-card border-l-4 border-primary-300 bg-primary-100 p-6 ${className}`}
    >
      <h2 id={headingId} className="mb-4 text-h4">
        À retenir
      </h2>
      <BulletList items={props.items} />
    </section>
  );
}
