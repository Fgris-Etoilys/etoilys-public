export const COOKIE_PREFERENCES_EVENT_NAME = 'etoilys:open-cookie-preferences';

export function openCookiePreferencesModal(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT_NAME));
}
