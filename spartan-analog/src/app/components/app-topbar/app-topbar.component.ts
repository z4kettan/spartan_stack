import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideSun, lucideMoon } from '@ng-icons/lucide';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app-topbar.component.html',
  styleUrls: ['./app-topbar.component.css'],
  standalone: true,
  providers: [
    provideIcons({
      lucideBell,
      lucideSun,
      lucideMoon,
    }),
  ],
  imports: [HlmSidebarTrigger, NgIcon],
})
export class AppTopbarComponent {
  private router = inject(Router);
  protected theme = inject(ThemeService);

  get pageTitle(): string {
    const segment =
      this.router.url.split('/').filter(Boolean)[0] || 'dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}
