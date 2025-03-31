import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { Play, Save, RotateCcw, ChevronLeft, Settings, Share } from 'lucide-react';
import { problemsAPI } from '../api/problems';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Dropdown from '../components/Dropdown';

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
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [activeTestCase, setActiveTestCase] = useState<string>('1');
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [showConstraints, setShowConstraints] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const languageOptions = [
    { label: 'Python', value: 'python' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' }
  ];

  if (!id) {
    console.error('Problem ID is undefined');
    return <div>Error: Problem ID is required.</div>;
  }

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await problemsAPI.getProblem(Number(id));
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
      const response = await problemsAPI.submitSolution(Number(id), code, selectedLanguage);
      setOutput(response.output || 'Success!');
      setStatus('success');
      setAlert({ type: 'success', message: 'Code executed successfully!' });
    } catch (error) {
      setStatus('error');
      setAlert({ type: 'error', message: 'Error executing code. Please try again.' });
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setStatus('running');
    try {
      const response = await problemsAPI.submitSolution(Number(id), code, selectedLanguage);
      setOutput(response.output || 'Success!');
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 min-h-screen"
    >
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          icon={<ChevronLeft />}
        >
          Back
        </Button>
        <div className="flex gap-2">
          <Dropdown
            options={languageOptions}
            value={selectedLanguage}
            onChange={(value) => setSelectedLanguage(value as string)}
            className="w-40"
          />
          <Button
            variant="outline"
            icon={<Settings />}
            onClick={() => {/* Add settings modal */}}
          />
          <Button
            variant="outline"
            icon={<Share />}
            onClick={() => {/* Add share functionality */}}
          />
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          autoClose
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="h-[calc(100vh-200px)]">
          <Editor
            height="100%"
            defaultLanguage={selectedLanguage}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </Card>

        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Output</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                icon={<RotateCcw />}
                onClick={() => setOutput('')}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                icon={<Play />}
                onClick={handleRunCode}
                isLoading={status === 'running'}
              >
                Run
              </Button>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto">
            {output || 'Output will appear here...'}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default CodeEditor;