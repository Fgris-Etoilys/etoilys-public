import { render, screen, within } from '@testing-library/react';
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
});
