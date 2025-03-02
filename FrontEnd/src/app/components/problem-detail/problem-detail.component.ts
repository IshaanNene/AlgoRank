import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Problem, TestCase, Example, Templates } from '../../models/problem.model';
import { ProblemService } from '../../services/problem.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';

interface TestResult {
  input: any;
  expected: any;
  output: any;
  passed: boolean;
  timeMs: number;
  memoryKb: number;
  isHidden?: boolean;
  error?: string;
}

interface ExecutionResult {
  status: string;
  runtime: number;
  memory: number;
  testResults: TestResult[];
  error?: string;
}

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorComponent],
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  @ViewChild(MonacoEditorComponent) editor!: MonacoEditorComponent;
  
  problem: Problem | null = null;
  loading = true;
  error = '';
  selectedLanguage = 'javascript';
  executionResult: ExecutionResult | null = null;
  isExecuting = false;
  
  languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private problemService: ProblemService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProblem(parseInt(id, 10));
      }
    });
  }

  fetchProblem(id: number) {
    this.loading = true;
    this.problemService.getProblem(id).subscribe({
      next: (data) => {
        this.problem = data;
        this.loading = false;
        
        // Set initial code template when editor is ready
        setTimeout(() => this.setCodeTemplate(), 100);
      },
      error: (err) => {
        this.error = 'Failed to load problem';
        this.loading = false;
        console.error(err);
      }
    });
  }

  setCodeTemplate() {
    if (!this.problem || !this.editor) return;
    
    const lang = this.selectedLanguage as keyof Templates;
    const template = this.problem.templates[lang] || '';
    if (template) {
      this.editor.setCode(template);
      this.editor.setLanguage(this.selectedLanguage);
    }
  }

  onLanguageChange() {
    this.setCodeTemplate();
  }

  runCode() {
    if (!this.problem || !this.editor) return;
    
    const code = this.editor.getCode();
    if (!code) {
      this.error = 'Please write some code first';
      return;
    }
    
    this.isExecuting = true;
    this.executionResult = null;
    this.error = '';
    
    this.http.post<ExecutionResult>('/api/code/run', {
      problemId: this.problem.problem_num,
      code: code,
      language: this.selectedLanguage,
      mode: 'Run'
    }).subscribe({
      next: (result) => {
        this.executionResult = result;
        this.isExecuting = false;
      },
      error: (err) => {
        this.error = 'Failed to execute code';
        this.isExecuting = false;
        console.error(err);
      }
    });
  }

  submitCode() {
    if (!this.problem || !this.editor) return;
    
    const code = this.editor.getCode();
    if (!code) {
      this.error = 'Please write some code first';
      return;
    }
    
    this.isExecuting = true;
    this.executionResult = null;
    this.error = '';
    
    this.http.post<ExecutionResult>('/api/code/submit', {
      problemId: this.problem.problem_num,
      code: code,
      language: this.selectedLanguage,
      mode: 'Submit'
    }).subscribe({
      next: (result) => {
        this.executionResult = result;
        this.isExecuting = false;
      },
      error: (err) => {
        this.error = 'Failed to submit code';
        this.isExecuting = false;
        console.error(err);
      }
    });
  }
}