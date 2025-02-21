import React from 'react';
import { Link } from 'react-router-dom';
import { useProblems } from '../context/ProblemsContext';

export const ProblemList: React.FC = () => {
    const { problems, loading, error } = useProblems();

    if (loading) return <div>Loading problems...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Problems</h1>
            <div className="grid gap-4">
                {problems.map((problem) => (
                    <Link
                        key={problem.id}
                        to={`/problems/${problem.id}`}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {problem.id}. {problem.title}
                                </h2>
                                <span className={`text-sm ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

function getDifficultyColor(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'text-green-600';
        case 'medium':
            return 'text-yellow-600';
        case 'hard':
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
} 