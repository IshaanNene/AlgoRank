import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-problem-list',
  template: `
    <div class="problem-list">
      <h2>Problems</h2>
      <div class="filters">
        <mat-button-toggle-group [(ngModel)]="difficulty">
          <mat-button-toggle value="all">All</mat-button-toggle>
          <mat-button-toggle value="easy">Easy</mat-button-toggle>
          <mat-button-toggle value="medium">Medium</mat-button-toggle>
          <mat-button-toggle value="hard">Hard</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
      <table mat-table [dataSource]="problems">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef> # </th>
          <td mat-cell *matCellDef="let problem"> {{problem.id}} </td>
        </ng-container>
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef> Title </th>
          <td mat-cell *matCellDef="let problem">
            <a [routerLink]="['/problem', problem.id]">{{problem.title}}</a>
          </td>
        </ng-container>
        <ng-container matColumnDef="difficulty">
          <th mat-header-cell *matHeaderCellDef> Difficulty </th>
          <td mat-cell *matCellDef="let problem" [class]="problem.difficulty.toLowerCase()">
            {{problem.difficulty}}
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .problem-list {
      padding: 20px;
    }
    .filters {
      margin-bottom: 20px;
    }
    .easy { color: green; }
    .medium { color: orange; }
    .hard { color: red; }
  `]
})
export class ProblemListComponent implements OnInit {
  problems: any[] = [];
  difficulty = 'all';
  displayedColumns = ['id', 'title', 'difficulty'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProblems();
  }

  loadProblems() {
    this.apiService.getProblems().subscribe(
      (data: any) => {
        this.problems = data;
      },
      error => console.error('Error loading problems:', error)
    );
  }
}