import { codeAPI } from './api';

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  testCases?: {
    passed: number;
    total: number;
    results: Array<{
      input: any;
      expected: any;
      actual: any;
      passed: boolean;
      executionTime: number;
    }>;
  };
  metrics?: {
    executionTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export class CodeExecutionService {
  private static instance: CodeExecutionService;
  private executionQueue: Array<() => Promise<ExecutionResult>> = [];
  private isProcessing = false;

  private constructor() {}

  static getInstance(): CodeExecutionService {
    if (!CodeExecutionService.instance) {
      CodeExecutionService.instance = new CodeExecutionService();
    }
    return CodeExecutionService.instance;
  }

  async runCode(
    problemId: string,
    code: string,
    language: string,
    testCases?: any[]
  ): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
      this.executionQueue.push(async () => {
        try {
          const response = await codeAPI.runCode({
            problemId,
            code,
            language,
            testCases,
          });
          return response.data;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Execution failed');
        }
      });

      this.processQueue();
    });
  }

  async submitSolution(
    problemId: string,
    code: string,
    language: string
  ): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
      this.executionQueue.push(async () => {
        try {
          const response = await codeAPI.submitSolution({
            problemId,
            code,
            language,
          });
          return response.data;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Submission failed');
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.executionQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    while (this.executionQueue.length > 0) {
      const task = this.executionQueue.shift();
      if (task) {
        try {
          const result = await task();
          this.onExecutionComplete(result);
        } catch (error) {
          this.onExecutionError(error);
        }
      }
    }
    this.isProcessing = false;
  }

  private onExecutionComplete(result: ExecutionResult) {
    if (result.testCases) {
      console.log(
        `Execution completed: ${result.testCases.passed}/${result.testCases.total} tests passed`
      );
    }
  }

  private onExecutionError(error: any) {
    console.error('Execution error:', error);
  }
}

export const codeExecutionService = CodeExecutionService.getInstance();