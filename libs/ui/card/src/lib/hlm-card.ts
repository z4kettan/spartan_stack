import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { HlmCardConfig, injectHlmCardConfig } from './hlm-card.token';

@Directive({
  selector: '[hlmCard],hlm-card',
  host: {
    'data-slot': 'card',
    '[attr.data-size]': 'size()',
  },
})
export class HlmCard {
  private readonly _defaultConfig = injectHlmCardConfig();
  public readonly size = input<HlmCardConfig['size']>(this._defaultConfig.size);

  constructor() {
    classes(
      () =>
        `relative bg-white/5 backdrop-blur-lg border border-white/40 shadow-[0_8px_32px_rgba(109,40,217,0.15)] text-card-foreground gap-(--card-spacing) overflow-hidden rounded-xl py-(--card-spacing) text-xs/relaxed [--card-spacing:--spacing(4)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg group/card flex flex-col before:absolute before:content-[""] before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent`,
    );
  }
}
