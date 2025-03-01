import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Problem } from '../../models/problem.model';
import { ProblemService } from '../../services/problem.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorComponent],
  template: `
    <div class="container" *ngIf="problem">
      <div class="problem-layout">
        <div class="problem-description-panel">
          <div class="problem-description">
            <div class="problem-title">
              <h1>{{ problem.problem_num }}. {{ problem.problem_name }}</h1>
              <span [ngClass]="'difficulty-' + problem.difficulty.toLowerCase()">
                {{ problem.difficulty }}
              </span>
            </div>
            <p>{{ problem.description }}</p>
            
            <div class="constraints">
              <h3>Constraints:</h3>
              <p>Time: {{ problem.Expected_Time_Constraints }}</p>
              <p>Space: {{ problem.Expected_Space_Constraints }}</p>
            </div>

            <div class="test-cases">
              <h3>Example Test Cases:</h3>
              <div class="test-case" *ngFor="let test of problem.Run_testCases">
                <p>Input: {{ test.input | json }}</p>
                <p>Expected Output: {{ test.expected | json }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="code-editor-panel">
          <app-monaco-editor #editor></app-monaco-editor>
          <div class="action-buttons">
            <button (click)="runCode()">Run Code</button>
            <button (click)="submitSolution()">Submit Solution</button>
          </div>
          <div class="results" *ngIf="testResults">
            <h3>Test Results:</h3>
            <pre>{{ testResults | json }}</pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .problem-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }
    
    .problem-description-panel, .code-editor-panel {
      height: calc(100vh - 120px);
      display: flex;
      flex-direction: column;
    }
    
    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .language-selector {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    
    .editor-actions {
      display: flex;
      gap: 10px;
    }
    
    app-monaco-editor {
      flex: 1;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .submission-result {
      margin-top: 16px;
      padding: 16px;
      border-radius: 8px;
      background-color: #f8f8f8;
    }
    
    .result-status {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .result-stats {
      display: flex;
      gap: 16px;
      color: #666;
    }
    
    .success {
      background-color: #e6f7e6;
      border-left: 4px solid #2cbc63;
    }
    
    .error {
      background-color: #ffeaea;
      border-left: 4px solid #ef4743;
    }
    
    @media (max-width: 1024px) {
      .problem-layout {
        grid-template-columns: 1fr;
      }
      
      .problem-description-panel, .code-editor-panel {
        height: auto;
      }
      
      app-monaco-editor {
        height: 400px;
      }
    }
  `]
})
export class ProblemDetailComponent implements OnInit {
  @ViewChild('editor') editor!: MonacoEditorComponent;
  problem?: Problem;
  testResults: any;

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.problemService.getProblem(id).subscribe(problem => {
        this.problem = problem;
      });
    });
  }

  runCode() {
    if (!this.problem) return;
    const code = this.editor.getCode();
    this.problemService.runTestCase(this.problem.problem_num, code, 'javascript')
      .subscribe(results => {
        this.testResults = results;
      });
  }

  submitSolution() {
    if (!this.problem) return;
    const code = this.editor.getCode();
    this.problemService.submitSolution(this.problem.problem_num, code, 'javascript')
      .subscribe(results => {
        this.testResults = results;
      });
  }
}