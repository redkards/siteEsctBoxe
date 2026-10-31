import { Injectable, signal } from '@angular/core';

/** Directions artistiques disponibles (cf. docs/design/README.md). */
export const THEMES = [
  { id: 'ring', label: 'Fight Night', swatch: ['#0b0b0c', '#d81424'] },
  { id: 'azur', label: 'Azur', swatch: ['#eef4fb', '#1976d2'] },
  { id: 'club', label: 'Éditorial', swatch: ['#111111', '#ffd700'] },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const DEFAULT_THEME: ThemeId = 'ring';
export const THEME_STORAGE_KEY = 'esct_theme';

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && THEMES.some((t) => t.id === value);
}

function readStored(): ThemeId | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeId(v) ? v : null;
  } catch {
    return null;
  }
}

function writeStored(theme: ThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* stockage indisponible (navigation privée, cookies bloqués) : on ignore */
  }
}

function readQuery(): ThemeId | null {
  try {
    const v = new URLSearchParams(window.location.search).get('theme');
    return isThemeId(v) ? v : null;
  } catch {
    return null;
  }
}

/** Ordre de priorité : ?theme= dans l'URL > localStorage > thème par défaut. */
export function resolveInitialTheme(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  return readQuery() ?? readStored() ?? DEFAULT_THEME;
}

function applyToDocument(theme: ThemeId): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const color = THEMES.find((t) => t.id === theme)?.swatch[theme === 'ring' ? 0 : 1];
  if (meta && color) meta.content = color;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<ThemeId>(DEFAULT_THEME);
  readonly theme = this._theme.asReadonly();

  constructor() {
    const initial = resolveInitialTheme();
    this._theme.set(initial);
    applyToDocument(initial);
    // Un ?theme= explicite devient le choix mémorisé (la navigation SPA perd le paramètre)
    if (typeof window !== 'undefined' && readQuery()) writeStored(initial);
  }

  set(theme: ThemeId): void {
    this._theme.set(theme);
    applyToDocument(theme);
    writeStored(theme);
  }
}
