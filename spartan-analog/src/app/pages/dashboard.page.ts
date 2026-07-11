import { Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDollarSign,
  lucideUsers,
  lucideShoppingCart,
  lucideTrendingUp,
} from '@ng-icons/lucide';

@Component({
  standalone: true,
  providers: [
    provideIcons({
      lucideDollarSign,
      lucideUsers,
      lucideShoppingCart,
      lucideTrendingUp,
    }),
  ],
  imports: [
    HlmCardImports,
    HlmBadgeImports,
    HlmButtonImports,
    HlmSeparatorImports,
    HlmAvatarImports,
    HlmTableImports,
    HlmTabsImports,
    NgIcon,
  ],
  templateUrl: './dashboard.page.html',
})
export default class DashboardPageComponent {
  stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      description: '+20.1% from last month',
      icon: 'lucideDollarSign',
      iconClass: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Active Users',
      value: '+2,350',
      description: '+20.1% from last month',
      icon: 'lucideUsers',
      iconClass: 'bg-violet-500/10 text-violet-600',
    },
    {
      title: 'Orders',
      value: '+12,234',
      description: '+20.1% from last month',
      icon: 'lucideShoppingCart',
      iconClass: 'bg-orange-500/10 text-orange-600',
    },
    {
      title: 'Growth Rate',
      value: '+12.5%',
      description: '+20.1% from last month',
      icon: 'lucideTrendingUp',
      iconClass: 'bg-emerald-500/10 text-emerald-600',
    },
  ];

  transactions = [
    {
      name: 'Alice Johnson',
      status: 'Completed',
      date: 'Jan 12, 2025',
      amount: '$250.00',
    },
    {
      name: 'Michael Jackson',
      status: 'Pending',
      date: 'Jan 13, 2025',
      amount: '$180.00',
    },
    {
      name: 'Ben Johnson',
      status: 'Failed',
      date: 'Jan 14, 2025',
      amount: '$320.00',
    },
    {
      name: 'Nisa John',
      status: 'Refunded',
      date: 'Jan 15, 2025',
      amount: '$99.00',
    },
  ];

  recentSales = [
    {
      initials: 'AL',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      amount: '+$250.00',
    },
    {
      initials: 'MJ',
      name: 'Michael Jackson',
      email: 'michael@example.com',
      amount: '+$180.00',
    },
    {
      initials: 'BJ',
      name: 'Ben Johnson',
      email: 'ben@example.com',
      amount: '+$320.00',
    },
    {
      initials: 'NJ',
      name: 'Nisa John',
      email: 'nisa@example.com',
      amount: '+$99.00',
    },
  ];

  getBadgeVariant(
    status: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' {
    const map: Record<
      string,
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      Completed: 'default',
      Pending: 'secondary',
      Failed: 'destructive',
      Refunded: 'outline',
    };
    return map[status] ?? 'outline';
  }
}
