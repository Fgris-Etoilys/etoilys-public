import { useEffect, useRef, useState } from 'react';

const TURNSTILE_SCRIPT_ID = 'turnstile-script';
const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
  theme: 'light' | 'dark' | 'auto';
}

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
  error?: string;
  resetKey: number;
}

export default function TurnstileField({ onTokenChange, error, resetKey }: TurnstileFieldProps) {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      setLocalError('Protection anti-spam indisponible (configuration manquante).');
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
          setLocalError('La verification anti-spam a expire. Merci de reessayer.');
        },
        'error-callback': () => {
          if (!isMounted) return;
          onTokenChange(null);
          setLocalError('Erreur de verification anti-spam. Merci de reessayer.');
        },
        theme: 'light',
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
  }, [siteKey, onTokenChange]);

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
