import { render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import ResponsiveComparisonTable from './ResponsiveComparisonTable';

describe('ResponsiveComparisonTable', () => {
  it('keeps mobile label and value columns bounded for long text', () => {
    render(
      <ResponsiveComparisonTable
        primaryColumnKey="criterion"
        columns={[
          {
            key: 'criterion',
            label: 'Criterion',
          },
          {
            key: 'information',
            label: 'Information concerned',
          },
        ]}
        rows={[
          {
            key: '105',
            cells: {
              criterion: '105',
              information:
                'Bed linen offered systematically by the renter with enough text to wrap on narrow screens',
            },
          },
        ]}
      />
    );

    const card = screen.getByRole('article');
    const detailRow = within(card).getByText('Information concerned').parentElement;

    expect(detailRow).toHaveClass('grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)]');
    expect(within(card).getByText('Information concerned')).toHaveClass('min-w-0', 'break-words');
    expect(
      within(card).getByText(
        'Bed linen offered systematically by the renter with enough text to wrap on narrow screens'
      )
    ).toHaveClass('min-w-0', 'break-words');
  });

  it('renders semantic table headers, row headers and caption', () => {
    render(
      <ResponsiveComparisonTable
        caption="Comparison table caption"
        primaryColumnKey="situation"
        columns={[
          { key: 'situation', label: 'Situation' },
          { key: 'result', label: 'Result' },
        ]}
        rows={[
          {
            key: 'first',
            cells: {
              situation: 'First situation',
              result: 'First result',
            },
          },
        ]}
      />
    );

    const table = screen.getByRole('table', { name: 'Comparison table caption' });
    expect(table).toHaveClass('table-fixed');
    expect(within(table).getByRole('columnheader', { name: 'Situation' })).toHaveAttribute(
      'scope',
      'col'
    );
    expect(within(table).getByRole('rowheader', { name: 'First situation' })).toHaveAttribute(
      'scope',
      'row'
    );
  });

  it('keeps responsive variants marked for browser-level breakpoint checks', () => {
    const { container } = render(
      <ResponsiveComparisonTable
        caption="Responsive comparison"
        primaryColumnKey="criterion"
        columns={[
          { key: 'criterion', label: 'Criterion' },
          { key: 'value', label: 'Value' },
        ]}
        rows={[
          {
            key: 'first',
            cells: {
              criterion: 'Criterion 1',
              value: 'Value 1',
            },
          },
        ]}
      />
    );

    expect(container.querySelector('[data-responsive-comparison-variant="mobile"]')).toHaveClass(
      'md:hidden'
    );
    expect(container.querySelector('[data-responsive-comparison-variant="desktop"]')).toHaveClass(
      'hidden',
      'md:block'
    );
  });

  it('keeps simulator integrations captioned and using bounded text classes', () => {
    ['src/pages/SimulateurTaxeSejour.tsx', 'src/pages/SimulateurFiscalClassement.tsx'].forEach(
      (relativePath) => {
        const source = readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');

        expect(source).toContain('<ResponsiveComparisonTable');
        expect(source).toContain('caption=');
        expect(source).toContain('table-fixed');
        expect(source).toContain('break-words');
      }
    );
  });
});
