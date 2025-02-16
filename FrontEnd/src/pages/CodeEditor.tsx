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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900">
      {/* Header Section */}
      <div className="border-b border-gray-800 bg-black/30 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/problems')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">{problem?.problem_name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${problem?.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      problem?.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'}`}>
                    {problem?.difficulty}
                  </span>
                  <span className="text-gray-400 text-sm">Acceptance: {problem?.acceptance_rate}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ThumbsUp className="w-5 h-5" />
                <span>{problem?.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ThumbsDown className="w-5 h-5" />
                <span>{problem?.dislikes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{problem?.discussion_count}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-5rem)]">
        {/* Problem Description Panel */}
        <div className="w-2/5 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>

            {showConstraints && (
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <h3 className="text-lg font-semibold text-white">Constraints</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {problem?.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}

            {showHints && (
              <div className="bg-indigo-900/30 rounded-lg p-4 space-y-2">
                <h3 className="text-lg font-semibold text-white">Hints</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {problem?.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor and Output Panel */}
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <Editor
                height="100%"
                defaultLanguage="c"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 10 },
                  lineNumbers: 'on',
                  roundedSelection: false,
                  automaticLayout: true
                }}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-gray-800/70 backdrop-blur-sm border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={runCode}
                  disabled={status === 'running'}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                >
                  {status === 'running' ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span>Run Code</span>
                </button>
                <button
                  onClick={resetCode}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="python3">Python 3</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
          </div>

          {/* Output Panel */}
          <div className="h-48 bg-gray-800/70 backdrop-blur-sm border-t border-gray-700">
            <div className="p-4">
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
              <pre className="text-gray-300 font-mono text-sm overflow-y-auto max-h-[120px]">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;