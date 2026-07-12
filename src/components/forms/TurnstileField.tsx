import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Locale } from '../../i18n/locales';

const TURNSTILE_SCRIPT_ID = 'turnstile-script';
const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
  size: TurnstileSize;
  theme: 'light' | 'dark' | 'auto';
  language: Locale;
}

type TurnstileSize = 'normal' | 'flexible' | 'compact';

const NORMAL_TURNSTILE_WIDTH = 300;

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileFieldProps {
  onTokenChange: (token: string | null) => void;
  error?: string | undefined;
  resetKey: number;
  locale: Locale;
  messages?: {
    missingConfig: string;
    expired: string;
    verificationError: string;
  };
}

const defaultMessages = {
  missingConfig: 'Protection anti-spam indisponible (configuration manquante).',
  expired: 'La vérification anti-spam a expiré. Merci de réessayer.',
  verificationError: 'Erreur de vérification anti-spam. Merci de réessayer.',
};

export default function TurnstileField({
  onTokenChange,
  error,
  resetKey,
  locale,
  messages = defaultMessages,
}: TurnstileFieldProps) {
  const siteKey = import.meta.env?.VITE_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [widgetSize, setWidgetSize] = useState<TurnstileSize>('normal');

  useLayoutEffect(() => {
    const updateWidgetSize = () => {
      const containerWidth = containerRef.current?.getBoundingClientRect().width ?? 0;
      setWidgetSize(
        containerWidth > 0 && containerWidth < NORMAL_TURNSTILE_WIDTH ? 'compact' : 'normal'
      );
    };

    updateWidgetSize();

    if (!containerRef.current || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidgetSize);
      return () => window.removeEventListener('resize', updateWidgetSize);
    }

    const observer = new ResizeObserver(updateWidgetSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!siteKey) {
      setLocalError(messages.missingConfig);
      onTokenChange(null);
      return;
    }

    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          if (!isMounted) return;
          setLocalError(null);
          onTokenChange(token);
        },
        'expired-callback': () => {
          if (!isMounted) return;
          onTokenChange(null);
          setLocalError(messages.expired);
        },
        'error-callback': () => {
          if (!isMounted) return;
          onTokenChange(null);
          setLocalError(messages.verificationError);
        },
        size: widgetSize,
        theme: 'light',
        language: locale,
      });
    };

    let script: HTMLScriptElement | null = null;

    if (window.turnstile) {
      renderWidget();
    } else {
      script = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener('load', renderWidget);
    }

    return () => {
      isMounted = false;
      script?.removeEventListener('load', renderWidget);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onTokenChange, messages, widgetSize, locale]);

  useEffect(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onTokenChange(null);
    }
  }, [resetKey, onTokenChange]);

  return (
    <div className="w-full">
      <div ref={containerRef} />
      {(error || localError) && (
        <p className="mt-2 text-sm text-alert-400">{error || localError}</p>
      )}
    </div>
  );
}
