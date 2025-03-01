import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container header-content">
        <div class="logo" routerLink="/">CodeChallenger</div>
        <nav class="nav-links">
          <a routerLink="/problems" routerLinkActive="active" class="nav-link">Problems</a>
          <a routerLink="/leaderboard" routerLinkActive="active" class="nav-link">Leaderboard</a>
        </nav>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
}