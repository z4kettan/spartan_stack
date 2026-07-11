import { Directive } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSidebarSeparator],hlm-sidebar-separator',
	host: {
		'data-slot': 'sidebar-separator',
		'data-sidebar': 'separator',
	},
})
export class HlmSidebarSeparator extends HlmSeparator {
	constructor() {
		super();
		classes(() => 'bg-sidebar-border mx-2 w-auto');
	}
}
