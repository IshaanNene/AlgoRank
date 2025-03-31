export interface Example {
    input: string;
    output: string;
    explanation?: string;
}

export interface TestCase {
    id: number;
    input: string;
    output: string;
    isHidden: boolean;
}

export interface Problem {
    id: number;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    timeLimit: number;
    memoryLimit: number;
    examples: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    testCases: TestCase[];
    createdAt: string;
    updatedAt: string;
} 