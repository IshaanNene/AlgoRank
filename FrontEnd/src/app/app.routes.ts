import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/problems',
    pathMatch: 'full'
  },
  {
    path: 'problems',
    loadComponent: () => import('./components/problem-list/problem-list.component').then(m => m.ProblemListComponent)
  },
  {
    path: 'problems/:id',
    loadComponent: () => import('./components/problem-detail/problem-detail.component').then(m => m.ProblemDetailComponent)
  },
  {
    path: 'submissions',
    loadComponent: () => import('./components/submissions/submissions.component').then(m => m.SubmissionsComponent)
  },
  {
    path: '**',
    redirectTo: '/problems'
  }
]; 