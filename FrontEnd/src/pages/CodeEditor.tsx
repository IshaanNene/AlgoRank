import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, ChevronLeft, CheckCircle2, XCircle, MessageCircle, ThumbsUp, ThumbsDown, Maximize2, Minimize2, Save } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';

// Define the Problem interface
interface Problem {
  id: string;
  problem_name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  hints: string[];
  acceptance_rate: number;
  submissions_count: number;
  likes: number;
  dislikes: number;
  discussion_count: number;
  seen_in_interviews: number;
  tags: string[];
  Run_testCases: Array<TestCase>;
}

// Define the TestCase interface
interface TestCase {
  id: string;
  input: {
    a: number;
    b: number;
  };
  expected: any;
  is_custom?: boolean;
}

const CodeEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('python3');
  const [activeTestCase, setActiveTestCase] = useState<string>('1');
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [showConstraints, setShowConstraints] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  if (!id) {
    console.error('Problem ID is undefined');
    return <div>Error: Problem ID is required.</div>;
  }

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/problems/${id}`);
        setProblem(response.data);
        setDescription(response.data.description);
        setTestCases(response.data.Run_testCases);
        const codeResponse = await fetch(`../../../C_Solutions/solution${id}.c`);
        if (!codeResponse.ok) throw new Error('Failed to fetch C solution');
        const codeData = await codeResponse.text();
        setCode(codeData);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem && !code) {
      setCode(`# Start coding: ${problem.problem_name}\n`);
    }
  }, [problem]);

  // Auto-save functionality
  useEffect(() => {
    if (isAutoSave && code) {
      const saveTimer = setTimeout(() => {
        saveCode();
      }, 1000);
      return () => clearTimeout(saveTimer);
    }
  }, [code, isAutoSave]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setStatus('running');
    try {
      const response = await axios.post('http://localhost:8080/run', { code, language: selectedLanguage });
      setOutput(response.data.output);
      setStatus('success');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error running code');
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setStatus('running');
    try {
      const response = await axios.post('http://localhost:8080/submit', { code });
      setOutput(response.data.output);
      setStatus('success');
    } catch (error) {
      console.error('Error submitting code:', error);
      setOutput('Error submitting code');
      setStatus('error');
    }
  };

  const resetCode = () => {
    setCode('');
    setOutput('');
    setStatus('idle');
  };

  const handleAddCustomTestCase = () => {
    // Implementation of adding a custom test case
  };

  return (
    <div className="p-4">
      <Button variant="outline" onClick={() => navigate(-1)} icon={<ChevronLeft className="w-4 h-4" />}>
        Back
      </Button>
      <Card className="mt-4 h-[calc(100vh-160px)]">
        <div className="prose prose-invert max-w-none p-4">
          <h1 className="text-2xl font-bold text-white mb-4">{problem?.problem_name}</h1>
          <div className="flex space-x-2 mb-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                problem?.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                problem?.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'}`}>
              {problem?.difficulty}
            </span>
            <span className="text-gray-400 text-sm">Acceptance: {problem?.acceptance_rate}%</span>
          </div>
          <p>{description}</p>
          {showConstraints && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Constraints:</h3>
              <ul>
                {problem?.constraints.map((constraint, idx) => (
                  <li key={idx}>{constraint}</li>
                ))}
              </ul>
            </div>
          )}
          {showHints && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Hints:</h3>
              <ul>
                {problem?.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={selectedLanguage}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
            />
          </div>
          <div className="mt-4">
            <Button variant="primary" onClick={handleRunCode} isLoading={isRunning} icon={<Play className="w-4 h-4" />}>
              Run
            </Button>
          </div>
          <div className="mt-4 bg-black/50 rounded-lg p-4 font-mono text-sm text-gray-300 h-32 overflow-auto">
            {output || 'Output will appear here...'}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CodeEditor;