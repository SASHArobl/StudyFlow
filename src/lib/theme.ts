export const themeStorageKey = 'studyflow.theme';
export type ThemePreference = 'system' | 'light' | 'dark';

// Self-contained so the same function can run before paint and on preference changes.
export function initializeTheme(storageKey: string, preference?: string): void {
  let value = preference;
  if (!value) {
    try {
      value = localStorage.getItem(storageKey) ?? 'system';
    } catch {
      value = 'system';
    }
  }
  if (value !== 'light' && value !== 'dark') value = 'system';
  const dark =
    value === 'dark' ||
    (value === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const root = document.documentElement;
  // Hover transitions must not briefly mix light surfaces with dark foregrounds.
  root.classList.add('theme-updating');
  root.classList.toggle('dark', dark);
  root.dataset.theme = value;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.classList.remove('theme-updating')),
  );
}

export const themeInitializationScript = `(${initializeTheme.toString()})(${JSON.stringify(themeStorageKey)})`;

export function getThemePreference(): ThemePreference {
  const value = document.documentElement.dataset.theme;
  return value === 'light' || value === 'dark' ? value : 'system';
}

export function subscribeTheme(onChange: () => void): () => void {
  const media = matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = () => {
    initializeTheme(themeStorageKey, getThemePreference());
    onChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === themeStorageKey || event.key === null) {
      initializeTheme(themeStorageKey);
      onChange();
    }
  };
  window.addEventListener('studyflow:theme', onChange);
  window.addEventListener('storage', onStorage);
  media.addEventListener('change', onSystemChange);
  return () => {
    window.removeEventListener('studyflow:theme', onChange);
    window.removeEventListener('storage', onStorage);
    media.removeEventListener('change', onSystemChange);
  };
}

export function setThemePreference(value: ThemePreference): boolean {
  initializeTheme(themeStorageKey, value);
  let saved = true;
  try {
    localStorage.setItem(themeStorageKey, value);
  } catch {
    saved = false;
  }
  window.dispatchEvent(new Event('studyflow:theme'));
  return saved;
}
