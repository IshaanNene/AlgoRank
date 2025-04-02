import { useState, useCallback } from 'react';

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

export type Language = keyof typeof LANGUAGE_TEMPLATES;

interface UseCodeEditorProps {
  initialLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
}

export const useCodeEditor = ({
  initialLanguage = 'cpp',
  onLanguageChange,
}: UseCodeEditorProps = {}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [code, setCode] = useState(LANGUAGE_TEMPLATES[language]);

  const handleLanguageChange = useCallback(
    (newLanguage: Language) => {
      setLanguage(newLanguage);
      setCode(LANGUAGE_TEMPLATES[newLanguage]);
      onLanguageChange?.(newLanguage);
    },
    [onLanguageChange]
  );

  const handleCodeChange = useCallback((newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
    }
  }, []);

  const resetCode = useCallback(() => {
    setCode(LANGUAGE_TEMPLATES[language]);
  }, [language]);

  return {
    language,
    code,
    setLanguage: handleLanguageChange,
    setCode: handleCodeChange,
    resetCode,
    supportedLanguages: Object.keys(LANGUAGE_TEMPLATES) as Language[],
  };
};

export default useCodeEditor; 