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
          <div>Languages</div>
          <div>Acceptance</div>
          <div>Difficulty</div>
        </div>
        <div *ngFor="let problem of problems" class="problem-item" [routerLink]="['/problem', problem.id]">
          <div>{{ problem.problem_num }}</div>
          <div>{{ problem.problem_name }}</div>
          <div class="language-icons">
            <span *ngIf="problem.templates?.javascript" title="JavaScript">JS</span>
            <span *ngIf="problem.templates?.python" title="Python">PY</span>
            <span *ngIf="problem.templates?.java" title="Java">JV</span>
            <span *ngIf="problem.templates?.cpp" title="C++">C++</span>
            <span *ngIf="problem.templates?.go" title="Go">GO</span>
            <span *ngIf="problem.templates?.rust" title="Rust">RS</span>
          </div>
          <div>{{ problem.acceptance }}%</div>
          <div [ngClass]="'difficulty-' + problem.difficulty.toLowerCase()">{{ problem.difficulty }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .problem-item {
      display: grid;
      grid-template-columns: 50px 1fr 150px 100px 100px;
      padding: 12px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: all 0.2s;
    }

    .problem-item:hover {
      background-color: #f8f9fa;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .problem-item.header {
      font-weight: bold;
      background-color: #f5f5f5;
      cursor: default;
    }
    
    .problem-item.header:hover {
      transform: none;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    .language-icons {
      display: flex;
      gap: 8px;
    }

    .language-icons span {
      padding: 2px 4px;
      border-radius: 4px;
      background-color: #e9ecef;
      font-size: 12px;
    }

    .difficulty-easy {
      color: #00b8a3;
    }

    .difficulty-medium {
      color: #ffa116;
    }

    .difficulty-hard {
      color: #ff375f;
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