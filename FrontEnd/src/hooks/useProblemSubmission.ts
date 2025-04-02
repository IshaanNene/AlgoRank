import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { problemsAPI } from '../services/api';
import { useToast } from '@chakra-ui/react';

interface UseProblemSubmissionProps {
  problemId: number;
  onSuccess?: (data: any) => void;
}

export const useProblemSubmission = ({ problemId, onSuccess }: UseProblemSubmissionProps) => {
  const toast = useToast();
  const [executionResults, setExecutionResults] = useState<any>(null);

  const runMutation = useMutation({
    mutationFn: ({ code, language }: { code: string; language: string }) =>
      problemsAPI.runCode(problemId, code, language),
    onSuccess: (data) => {
      setExecutionResults(data.metrics);
      toast({
        title: 'Code executed successfully',
        status: 'success',
        duration: 3000,
      });
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast({
        title: 'Execution failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: ({ code, language }: { code: string; language: string }) =>
      problemsAPI.submitSolution(problemId, code, language),
    onSuccess: (data) => {
      setExecutionResults(data.metrics);
      if (data.metrics.passed_count === data.metrics.total_tests) {
        toast({
          title: 'All tests passed!',
          description: 'Congratulations! Your solution has been submitted.',
          status: 'success',
          duration: 5000,
        });
      } else {
        toast({
          title: 'Some tests failed',
          description: 'Please check the results and try again.',
          status: 'warning',
          duration: 5000,
        });
      }
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast({
        title: 'Submission failed',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    },
  });

  const runCode = (code: string, language: string) => {
    runMutation.mutate({ code, language });
  };

  const submitSolution = (code: string, language: string) => {
    submitMutation.mutate({ code, language });
  };

  return {
    executionResults,
    isRunning: runMutation.isPending,
    isSubmitting: submitMutation.isPending,
    runCode,
    submitSolution,
  };
};

export default useProblemSubmission; 