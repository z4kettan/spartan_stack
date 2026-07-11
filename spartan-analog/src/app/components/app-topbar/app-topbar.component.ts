import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HlmSidebarTrigger } from '@spartan-ng/helm/sidebar';
import { HlmAvatar, HlmAvatarFallback } from '@spartan-ng/helm/avatar';

@Component({
  selector: 'app-topbar',
  templateUrl: './app-topbar.component.html',
  styleUrls: ['./app-topbar.component.css'],
  standalone: true,
  imports: [HlmSidebarTrigger, HlmAvatar, HlmAvatarFallback],
})
export class AppTopbarComponent {
  private router = inject(Router);

  get pageTitle(): string {
    const segment =
      this.router.url.split('/').filter(Boolean)[0] || 'dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}
