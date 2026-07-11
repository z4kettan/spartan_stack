import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'spartan-analog-home',
  
  imports: [AnalogWelcomeComponent],
  template: `
     <spartan-analog-analog-welcome/>
  `,
})
export default class HomeComponent {
}
