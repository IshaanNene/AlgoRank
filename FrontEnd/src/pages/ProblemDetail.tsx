import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  GridItem,
  Button,
  Select,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { problemsAPI } from '../services/api';
import ProblemDetails from '../components/ProblemDetails';
import CodeEditor from '../components/CodeEditor';
import ExecutionResults from '../components/ExecutionResults';
import Loading from '../components/Loading';
import useCodeEditor from '../hooks/useCodeEditor';
import useProblemSubmission from '../hooks/useProblemSubmission';

const SUPPORTED_LANGUAGES = [
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const LANGUAGE_TEMPLATES = {
  c: `#include <stdio.h>

int solution() {
    // Your code here
    return 0;
}

int main() {
    int result = solution();
    printf("%d\\n", result);
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

class Solution {
public:
    int solve() {
        // Your code here
        return 0;
    }
};

int main() {
    Solution solution;
    cout << solution.solve() << endl;
    return 0;
}`,
  java: `public class Solution {
    public int solve() {
        // Your code here
        return 0;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.solve());
    }
}`,
  go: `package main

import "fmt"

func solution() int {
    // Your code here
    return 0
}

func main() {
    fmt.Println(solution())
}`,
  rust: `fn solution() -> i32 {
    // Your code here
    0
}

fn main() {
    println!("{}", solution());
}`,
};

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const problemId = Number(id);

  const { data: problem, isLoading } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => problemsAPI.getProblem(problemId),
  });

  const {
    language,
    code,
    setLanguage,
    setCode,
    resetCode,
    supportedLanguages,
  } = useCodeEditor();

  const {
    executionResults,
    isRunning,
    isSubmitting,
    runCode,
    submitSolution,
  } = useProblemSubmission({
    problemId,
  });

  if (isLoading || !problem) {
    return <Loading />;
  }

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: '5fr 7fr' }}
      gap={6}
      maxH="calc(100vh - 100px)"
      overflow="hidden"
    >
      <GridItem overflowY="auto" p={4}>
        <ProblemDetails
          title={problem.title}
          difficulty={problem.difficulty}
          description={problem.description}
          timeComplexity={problem.time_complexity}
          spaceComplexity={problem.space_complexity}
          examples={problem.examples}
        />
      </GridItem>

      <GridItem p={4}>
        <VStack spacing={4} align="stretch" h="full">
          <HStack spacing={4}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              maxW="200px"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </Select>
            <Button
              colorScheme="blue"
              onClick={() => runCode(code, language)}
              isLoading={isRunning}
            >
              Run Code
            </Button>
            <Button
              colorScheme="green"
              onClick={() => submitSolution(code, language)}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
            <Button
              variant="ghost"
              onClick={resetCode}
            >
              Reset
            </Button>
          </HStack>

          <Box flex="1" overflow="hidden">
            <CodeEditor
              code={code}
              language={language}
              onChange={setCode}
            />
          </Box>

          {executionResults && (
            <Box overflowY="auto" maxH="300px">
              <ExecutionResults metrics={executionResults} />
            </Box>
          )}
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default ProblemDetail; 