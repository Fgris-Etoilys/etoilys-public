import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import TurnstileField from './TurnstileField';
import { formContent } from '../../i18n/formContent';

type Options = Parameters<NonNullable<Window['turnstile']>['render']>[1];
let options: Options;
const onTokenChange = vi.fn();
const reset = vi.fn();
const remove = vi.fn();

beforeEach(() => {
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-key');
  window.turnstile = {
    render: vi.fn((_container, renderedOptions) => {
      options = renderedOptions;
      return 'test-widget';
    }),
    reset,
    remove,
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  delete window.turnstile;
});

describe('Turnstile lifecycle', () => {
  it.each(['fr', 'en', 'nl'] as const)(
    'localizes errors and clears expired tokens in %s',
    (locale) => {
      const messages = formContent[locale].turnstile;
      const props = { locale, messages, resetKey: 0, onTokenChange };
      const { rerender, unmount } = render(<TurnstileField {...props} />);
      expect(options.language).toBe(locale);

      act(() => options.callback('verified'));
      expect(onTokenChange).toHaveBeenLastCalledWith('verified');
      act(() => options['expired-callback']());
      expect(onTokenChange).toHaveBeenLastCalledWith(null);
      expect(screen.getByRole('alert')).toHaveTextContent(messages.expired);

      act(() => options.callback('renewed'));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      act(() => options['error-callback']());
      expect(onTokenChange).toHaveBeenLastCalledWith(null);
      expect(screen.getByRole('alert')).toHaveTextContent(messages.verificationError);

      act(() => options.callback('retry'));
      reset.mockClear();
      rerender(<TurnstileField {...props} resetKey={1} />);
      expect(reset).toHaveBeenCalledWith('test-widget');
      expect(onTokenChange).toHaveBeenLastCalledWith(null);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      unmount();
      expect(remove).toHaveBeenCalledWith('test-widget');
    }
  );

  it('blocks verification when the site key is missing', () => {
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', '');
    render(<TurnstileField locale="fr" resetKey={0} onTokenChange={onTokenChange} />);
    expect(window.turnstile?.render).not.toHaveBeenCalled();
    expect(onTokenChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('alert')).toHaveTextContent(formContent.fr.turnstile.missingConfig);
  });

  it('uses a compact widget when the available width is below 300px', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 260,
      height: 65,
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 260,
      bottom: 65,
      toJSON: () => ({}),
    });
    render(<TurnstileField locale="fr" resetKey={0} onTokenChange={onTokenChange} />);
    expect(options.size).toBe('compact');
  });
});
