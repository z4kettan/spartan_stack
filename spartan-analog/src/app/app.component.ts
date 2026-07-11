import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebarComponent } from './components/app-sidebar/app-sidebar.component';
import { AppTopbarComponent } from './components/app-topbar/app-topbar.component';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSidebarComponent, AppTopbarComponent, HlmToaster],
  template: `
    <app-sidebar>
      <div class="flex flex-1 flex-col">
        <app-topbar />
        <main class="flex-1 overflow-auto p-4">
          <router-outlet />
        </main>
      </div>
    </app-sidebar>
    <hlm-toaster [theme]="theme()" richColors closeButton />
  `,
})
export class AppComponent {
  private themeService = inject(ThemeService);
  protected theme = computed(() =>
    this.themeService.isDark() ? 'dark' : 'light',
  );
}
