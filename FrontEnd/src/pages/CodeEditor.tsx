import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, ChevronLeft, CheckCircle2, XCircle, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';

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

const CodeEditor = () => {
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

  if (!id) {
    console.error('Problem ID is undefined');
    return <div>Error: Problem ID is required.</div>;
  }

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`../../../Problem/problem${id}.json`);
        if (!response.ok) {
          console.error('Failed to fetch problem data:', response.statusText);
          throw new Error('Failed to fetch problem data');
        }
        const data: Problem = await response.json();
        setProblem(data);
        setDescription(data.description);
        setTestCases(data.Run_testCases);
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

  const runCode = async () => {
    setStatus('running');
    try {
      const response = await axios.post('http://localhost:8080/run', { code });
      setOutput(response.data.output);
      setStatus('success');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error running code');
      setStatus('error');
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/problems')}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back to Problems</span>
              </button>
              <div className="ml-6">
                <h1 className="text-xl font-bold text-gray-900">{problem?.problem_name || 'Loading...'}</h1>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  problem?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  problem?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {problem?.difficulty || 'Loading...'}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetCode}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </button>
              <button
                onClick={runCode}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Run
              </button>
              <button
                onClick={submitCode}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Submit
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="python3">Python3</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <button
                onClick={() => setIsAutoSave(!isAutoSave)}
                className={`px-3 py-1 rounded ${
                  isAutoSave ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                }`}
              >
                Auto-save: {isAutoSave ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Problem Description Panel */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{problem?.problem_name}</h1>
            
            {/* Problem Metrics */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>{problem?.likes}</span>
              </div>
              <div className="flex items-center">
                <ThumbsDown className="w-4 h-4 mr-1" />
                <span>{problem?.dislikes}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{problem?.discussion_count}</span>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">Problem Description</h2>
            <p className="whitespace-pre-line">{description}</p>
            
            <h3 className="text-lg font-semibold mt-6 mb-4">Test Cases</h3>
            <div className="space-y-4">
              {testCases.map((testCase, index) => (
                <div key={testCase.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Input:</p>
                  <pre className="mt-1 text-sm">{`a: ${testCase.input.a}, b: ${testCase.input.b}`}</pre>
                  <p className="text-sm text-gray-600 mt-2">Expected Output:</p>
                  <pre className="mt-1 text-sm">{testCase.expected}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Editor and Test Panels */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="c"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>
          
          {/* Test Cases Panel */}
          <div className="h-1/3 border-t border-gray-200">
            <div className="flex border-b">
              {testCases.map((testCase, index) => (
                <button
                  key={testCase.id}
                  onClick={() => setActiveTestCase(testCase.id)}
                  className={`px-4 py-2 ${
                    activeTestCase === testCase.id
                      ? 'border-b-2 border-blue-500'
                      : ''
                  }`}
                >
                  Case {index + 1}
                </button>
              ))}
              <button
                onClick={handleAddCustomTestCase}
                className="px-4 py-2 text-blue-500"
              >
                + Custom
              </button>
            </div>
            
            {/* ... test case content and results ... */}
          </div>
          
          {/* Output panel */}
          <div className="h-48 bg-gray-900 text-white p-4 font-mono text-sm overflow-y-auto">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-gray-400">Output:</span>
              {status === 'running' && (
                <span className="text-yellow-400">Running...</span>
              )}
              {status === 'success' && (
                <span className="flex items-center text-green-400">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Success
                </span>
              )}
              {status === 'error' && (
                <span className="flex items-center text-red-400">
                  <XCircle className="h-4 w-4 mr-1" />
                  Error
                </span>
              )}
            </div>
            <pre className="text-gray-300">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;