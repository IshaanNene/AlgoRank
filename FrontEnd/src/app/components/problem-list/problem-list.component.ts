import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Problem } from '../../models/problem.model';
import { ProblemService } from '../../services/problem.service';

@Component({
  selector: 'app-problem-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1>Problems</h1>
      <div class="problem-list">
        <div class="problem-item header">
          <div>#</div>
          <div>Title</div>
          <div>Acceptance</div>
          <div>Difficulty</div>
        </div>
        <div *ngFor="let problem of problems" class="problem-item" [routerLink]="['/problem', problem.id]">
          <div>{{ problem.id }}</div>
          <div>{{ problem.title }}</div>
          <div>{{ problem.acceptance }}%</div>
          <div [ngClass]="'difficulty-' + problem.difficulty.toLowerCase()">{{ problem.difficulty }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .problem-item.header {
      font-weight: bold;
      background-color: #f5f5f5;
      cursor: default;
    }
    
    .problem-item.header:hover {
      transform: none;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
  `]
})
export class ProblemListComponent implements OnInit {
  problems: Problem[] = [];

  constructor(private problemService: ProblemService) { }

  ngOnInit(): void {
    this.problemService.getProblems().subscribe(problems => {
      this.problems = problems;
    });
  }
}