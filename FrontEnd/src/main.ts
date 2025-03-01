import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './app/components/header/header.component';
import { ProblemListComponent } from './app/components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './app/components/problem-detail/problem-detail.component';
import { LeaderboardComponent } from './app/components/leaderboard/leaderboard.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: '/problems', pathMatch: 'full' },
  { path: 'problems', component: ProblemListComponent },
  { path: 'problem/:id', component: ProblemDetailComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '**', redirectTo: '/problems' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      padding: 20px 0;
    }
  `]
})
export class App {
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
});