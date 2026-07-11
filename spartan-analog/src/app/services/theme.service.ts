import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _isDark = signal(false);
  readonly isDark = this._isDark.asReadonly();

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      this._isDark.set(saved ? saved === 'dark' : prefersDark);
    }

    effect(() => {
      if (isPlatformBrowser(this._platformId)) {
        document.documentElement.classList.toggle('dark', this._isDark());
        localStorage.setItem('theme', this._isDark() ? 'dark' : 'light');
      }
    });
  }

  toggle(): void {
    this._isDark.update((v) => !v);
  }
}
