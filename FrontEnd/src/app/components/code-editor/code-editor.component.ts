import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MonacoEditorComponent } from 'ngx-monaco-editor';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-code-editor',
  template: `
    <div class="editor-container">
      <div class="problem-description">
        <h2>{{problem?.title}}</h2>
        <div [innerHTML]="problem?.description"></div>
      </div>
      <div class="editor-panel">
        <div class="language-selector">
          <mat-select [(ngModel)]="selectedLanguage">
            <mat-option *ngFor="let lang of languages" [value]="lang.value">
              {{lang.label}}
            </mat-option>
          </mat-select>
        </div>
        <ngx-monaco-editor
          [options]="editorOptions"
          [(ngModel)]="code"
          (onInit)="onEditorInit($event)">
        </ngx-monaco-editor>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="runCode()">Run</button>
          <button mat-raised-button color="accent" (click)="submitCode()">Submit</button>
        </div>
        <div class="results" *ngIf="testResults">
          <h3>Results</h3>
          <div [ngClass]="{'success': testResults.success, 'error': !testResults.success}">
            <p>Status: {{testResults.success ? 'Passed' : 'Failed'}}</p>
            <p>Runtime: {{testResults.runtime}}ms</p>
            <p>Memory: {{testResults.memory}}MB</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .editor-container {
      display: flex;
      height: calc(100vh - 64px);
    }
    .problem-description {
      width: 40%;
      padding: 20px;
      overflow-y: auto;
    }
    .editor-panel {
      width: 60%;
      display: flex;
      flex-direction: column;
    }
    .actions {
      padding: 10px;
      gap: 10px;
      display: flex;
    }
    .results {
      padding: 10px;
    }
    .success { color: green; }
    .error { color: red; }
  `]
})
export class CodeEditorComponent implements OnInit {
  @ViewChild(MonacoEditorComponent) editor: MonacoEditorComponent;

  problem: any;
  code = '';
  selectedLanguage = 'python';
  testResults: any;

  languages = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' }
  ];

  editorOptions = {
    theme: 'vs-dark',
    language: 'python',
    fontSize: 14,
    automaticLayout: true
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const problemId = params['id'];
      this.loadProblem(problemId);
    });
  }

  loadProblem(id: number) {
    this.apiService.getProblem(id).subscribe(
      problem => this.problem = problem,
      error => console.error('Error loading problem:', error)
    );
  }

  onEditorInit(editor: any) {
    editor.updateOptions({ tabSize: 4 });
  }

  runCode() {
    const submission = {
      code: this.code,
      language: this.selectedLanguage,
      problemId: this.problem.id
    };

    this.apiService.runCode(this.problem.id, submission).subscribe(
      results => this.testResults = results,
      error => console.error('Error running code:', error)
    );
  }

  submitCode() {
    const submission = {
      code: this.code,
      language: this.selectedLanguage,
      problemId: this.problem.id
    };

    this.apiService.submitSolution(this.problem.id, submission).subscribe(
      results => this.testResults = results,
      error => console.error('Error submitting code:', error)
    );
  }
} 