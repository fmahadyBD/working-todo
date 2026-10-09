import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a> |
      <a routerLink="/today" routerLinkActive="active">Today</a> |
      <a routerLink="/tomorrow" routerLinkActive="active">Tomorrow</a> |
      <a routerLink="/weekly" routerLinkActive="active">Weekly</a> |
      <a routerLink="/monthly" routerLinkActive="active">Monthly</a> |
      <a routerLink="/notifications" routerLinkActive="active">Notifications</a>
    </nav>
    <hr />
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav { padding: 10px; }
    nav a { text-decoration: none; color: #333; }
    nav a.active { font-weight: bold; color: #0066cc; }
  `]
})
export class AppComponent {}
