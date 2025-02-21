import api from './index';
import { Problem } from '../types/problem';

export const problemsAPI = {
    getProblems: async (): Promise<Problem[]> => {
        const response = await api.get('/problems');
        return response.data;
    },

    getProblem: async (id: number): Promise<Problem> => {
        const response = await api.get(`/problems/${id}`);
        return response.data;
    },

    submitSolution: async (problemId: number, code: string, language: string) => {
        const response = await api.post(`/problems/${problemId}/submit`, {
            code,
            language,
        });
        return response.data;
    },

    createProblem: async (problemData: Partial<Problem>) => {
        const response = await api.post('/problems', problemData);
        return response.data;
    },

    updateProblem: async (id: number, problemData: Partial<Problem>) => {
        const response = await api.put(`/problems/${id}`, problemData);
        return response.data;
    },

    deleteProblem: async (id: number) => {
        await api.delete(`/problems/${id}`);
    }
};

export default problemsAPI; 