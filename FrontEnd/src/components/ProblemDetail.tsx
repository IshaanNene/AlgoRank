import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CodeEditor } from './CodeEditor';
import { problemsAPI } from '../api/problems';
import { Problem } from '../types/problem';

export const ProblemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const data = await problemsAPI.getProblem(Number(id));
                setProblem(data);
            } catch (err) {
                setError('Failed to fetch problem details');
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id]);

    if (loading) return <div>Loading problem...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!problem) return <div>Problem not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="problem-description">
                    <h1 className="text-3xl font-bold mb-4">
                        {problem.id}. {problem.title}
                    </h1>
                    <div className="mb-4">
                        <span className={`inline-block px-2 py-1 rounded ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                        </span>
                    </div>
                    <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                    </div>
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-2">Examples:</h3>
                        {problem.examples.map((example, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                                <div><strong>Input:</strong> {example.input}</div>
                                <div><strong>Output:</strong> {example.output}</div>
                                {example.explanation && (
                                    <div><strong>Explanation:</strong> {example.explanation}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="code-editor">
                    <CodeEditor problemId={problem.id} />
                </div>
            </div>
        </div>
    );
};

function getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'bg-green-100 text-green-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'hard':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
} 