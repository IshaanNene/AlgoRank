export interface Problem {
  problem_num: number;
  problem_name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  Expected_Time_Constraints: string;
  Expected_Space_Constraints: string;
  Run_testCases: TestCase[];
  Submit_testCases: TestCase[];
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: any;
  expected: any;
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