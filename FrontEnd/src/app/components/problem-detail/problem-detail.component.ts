import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Problem, TestCase, Example, Templates } from '../../models/problem.model';
import { ProblemService } from '../../services/problem.service';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { ApiService } from '../../services/api.service';

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
  selectedLanguage = 'python';
  executionResult: ExecutionResult | null = null;
  isExecuting = false;
  code = '';
  testResults: any;
  isLoading = false;
  
  languages = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private problemService: ProblemService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProblem(parseInt(id, 10));
      }
    });
  }

  loadProblem(id: number) {
    this.loading = true;
    this.apiService.getProblem(id).subscribe(
      problem => {
        this.problem = problem;
        this.loading = false;
        
        // Set initial code template when editor is ready
        setTimeout(() => this.setCodeTemplate(), 100);
      },
      error => {
        this.error = 'Failed to load problem';
        this.loading = false;
        console.error('Error loading problem:', error);
      }
    );
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

  async runCode() {
    this.isLoading = true;
    try {
      const submission = {
        code: this.code,
        language: this.selectedLanguage,
        problemId: this.problem?.id || 0
      };

      this.testResults = await this.apiService.runCode(
        this.problem?.id || 0,
        submission
      ).toPromise();
    } catch (error) {
      console.error('Error running code:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async submitCode() {
    this.isLoading = true;
    try {
      const submission = {
        code: this.code,
        language: this.selectedLanguage,
        problemId: this.problem?.id || 0
      };

      this.testResults = await this.apiService.submitCode(
        this.problem?.id || 0,
        submission
      ).toPromise();
    } catch (error) {
      console.error('Error submitting code:', error);
    } finally {
      this.isLoading = false;
    }
  }
}