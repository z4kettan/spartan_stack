import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import {
  lucideLayoutDashboard,
  lucideUsers,
  lucideShoppingCart,
  lucideSettings,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.css'],
  standalone: true,
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideUsers,
      lucideShoppingCart,
      lucideSettings,
    }),
  ],
  imports: [NgIcon, RouterLink, ...HlmSidebarImports],
})
export class AppSidebarComponent {
  navItems = [
    { title: 'Dashboard', url: '/dashboard', icon: 'lucideLayoutDashboard' },
    { title: 'Users', url: '/users', icon: 'lucideUsers' },
    { title: 'Orders', url: '/orders', icon: 'lucideShoppingCart' },
    { title: 'Settings', url: '/settings', icon: 'lucideSettings' },
  ];
}
