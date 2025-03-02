import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Submission {
  id: number;
  problemId: number;
  language: string;
  status: string;
  runtime: number;
  memory: number;
  createdAt: string;
}

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="submissions-container">
      <h1>Your Submissions</h1>
      
      <div class="loading" *ngIf="loading">Loading submissions...</div>
      
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <div class="no-submissions" *ngIf="!loading && !error && submissions.length === 0">
        You haven't made any submissions yet.
        <a routerLink="/problems">Go to problems</a>
      </div>
      
      <table class="submissions-table" *ngIf="!loading && !error && submissions.length > 0">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Language</th>
            <th>Status</th>
            <th>Runtime</th>
            <th>Memory</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let submission of submissions" [routerLink]="['/problems', submission.problemId]">
            <td>Problem {{ submission.problemId }}</td>
            <td>{{ submission.language }}</td>
            <td [ngClass]="'status-' + submission.status.toLowerCase()">
              {{ submission.status }}
            </td>
            <td>{{ submission.runtime | number:'1.2-2' }} ms</td>
            <td>{{ submission.memory / 1024 | number:'1.2-2' }} MB</td>
            <td>{{ submission.createdAt | date:'medium' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .submissions-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    h1 {
      margin-bottom: 1.5rem;
    }
    
    .submissions-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .submissions-table th, .submissions-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    .submissions-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    
    .submissions-table tbody tr {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .submissions-table tbody tr:hover {
      background-color: #f9f9f9;
    }
    
    .status-accepted {
      color: #00b8a3;
    }
    
    .status-failed {
      color: #ff375f;
    }
    
    .status-error {
      color: #ff9500;
    }
    
    .loading, .error, .no-submissions {
      padding: 2rem;
      text-align: center;
    }
    
    .error {
      color: #ff375f;
    }
    
    .no-submissions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #666;
    }
    
    .no-submissions a {
      color: #0070f3;
      text-decoration: none;
    }
    
    .no-submissions a:hover {
      text-decoration: underline;
    }
  `]
})
export class SubmissionsComponent implements OnInit {
  submissions: Submission[] = [];
  loading = true;
  error = '';
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchSubmissions();
  }
  
  fetchSubmissions(): void {
    this.loading = true;
    this.error = '';
    
    this.http.get<Submission[]>('/api/submissions')
      .subscribe({
        next: (data) => {
          this.submissions = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load submissions. You may need to log in.';
          this.loading = false;
          console.error(err);
        }
      });
  }
} 