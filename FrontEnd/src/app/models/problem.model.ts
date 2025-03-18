export interface Templates {
  javascript?: string;
  python?: string;
  java?: string;
  cpp?: string;
  go?: string;
  rust?: string;
  [key: string]: string | undefined;
}

export interface TestCase {
  input: any;
  expected: any;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  testCases: {
    run: TestCase[];
    submit: TestCase[];
  };
  constraints: {
    timeLimit: number;
    memoryLimit: number;
  };
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
}

export interface Submission {
  problemId: number;
  userId: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  runtime: number;
  memory: number;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  solvedProblems: number;
  totalSubmissions: number;
  rank: number;
  streak: number;
}