import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebarComponent } from "./components/app-sidebar/app-sidebar.component";
import { AppTopbarComponent } from "./components/app-topbar/app-topbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSidebarComponent, AppTopbarComponent],
  template: `  <app-sidebar>
      <div class="flex flex-1 flex-col">
        <app-topbar />
        <main class="flex-1 overflow-auto p-4">
          <router-outlet />
        </main>
      </div>
    </app-sidebar> `,
})
export class AppComponent {}
