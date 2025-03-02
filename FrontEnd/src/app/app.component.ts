import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo">
          <a routerLink="/">AlgoRank</a>
        </div>
        <nav>
          <a routerLink="/problems" routerLinkActive="active">Problems</a>
          <a routerLink="/submissions" routerLinkActive="active">Submissions</a>
        </nav>
      </header>
      
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <p>&copy; 2024 AlgoRank - A platform for practicing algorithmic problems</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #1e1e1e;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .logo a {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }
    
    nav {
      display: flex;
      gap: 1.5rem;
    }
    
    nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 0;
      transition: color 0.2s;
    }
    
    nav a:hover, nav a.active {
      color: #61dafb;
    }
    
    .app-content {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }
    
    .app-footer {
      padding: 1rem 2rem;
      background-color: #f5f5f5;
      text-align: center;
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class AppComponent {
  title = 'AlgoRank';
} 