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
  is_hidden?: boolean;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: number;
  problem_num: number;
  problem_name: string;
  title: string;
  description: string;
  difficulty: string;
  acceptance: number;
  acceptanceRate?: number;
  Expected_Time_Constraints: string;
  Expected_Space_Constraints: string;
  templates: Templates;
  examples: Example[];
  Run_testCases: TestCase[];
  Submit_testCases: TestCase[];
  submissions?: number;
  accepted?: number;
  tags?: string[];
  constraints?: string[];
  createdAt: string;
  updatedAt: string;
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