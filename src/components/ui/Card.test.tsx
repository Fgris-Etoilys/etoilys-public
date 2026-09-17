import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('forwards refs to the default div element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Card ref={ref}>Carte</Card>);

    expect(ref.current).toBe(screen.getByText('Carte'));
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('forwards refs to the article element', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Card as="article" ref={ref}>
        Article carte
      </Card>
    );

    expect(ref.current).toBe(screen.getByRole('article'));
    expect(ref.current?.tagName).toBe('ARTICLE');
  });
});
