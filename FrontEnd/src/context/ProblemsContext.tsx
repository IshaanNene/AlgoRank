import React, { createContext, useContext, useState, useEffect } from 'react';
import { Problem } from '../types/problem';
import { problemsAPI } from '../api/problems';

interface ProblemsContextType {
    problems: Problem[];
    loading: boolean;
    error: string | null;
    refreshProblems: () => Promise<void>;
    currentProblem: Problem | null;
    setCurrentProblem: (problem: Problem | null) => void;
}

const ProblemsContext = createContext<ProblemsContextType | undefined>(undefined);

export const ProblemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshProblems = async () => {
        try {
            setLoading(true);
            const data = await problemsAPI.getProblems();
            setProblems(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch problems');
            console.error('Error fetching problems:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProblems();
    }, []);

    return (
        <ProblemsContext.Provider 
            value={{ 
                problems, 
                loading, 
                error, 
                refreshProblems, 
                currentProblem, 
                setCurrentProblem 
            }}
        >
            {children}
        </ProblemsContext.Provider>
    );
};

export const useProblems = () => {
    const context = useContext(ProblemsContext);
    if (!context) {
        throw new Error('useProblems must be used within a ProblemsProvider');
    }
    return context;
}; 