import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';

const CodeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [problem, setProblem] = useState(null);
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState([]);
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`../../Problem/problem1.json`);
        if (!response.ok) throw new Error('Failed to fetch problem data');
        const data = await response.json();
        setProblem(data);
        setDescription(data.description);
        setTestCases(data.Run_testCases);
        const codeResponse = await fetch(`../../C_Solutions/solution1.c`);
        if (!codeResponse.ok) throw new Error('Failed to fetch C solution');
        const codeData = await codeResponse.text();
        setCode(codeData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const runCode = () => {
    setStatus('running');
    setTimeout(() => {
      setOutput('Output: [0, 1]\nAll test cases passed!');
      setStatus('success');
    }, 1000);
  };

  const resetCode = () => {
    setCode('');
    setOutput('');
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
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
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left panel - Problem description */}
        <div className="w-1/3 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="prose max-w-none">
            <h2 className="text-lg font-semibold mb-4">Problem Description</h2>
            <p className="whitespace-pre-line">{description}</p>
            
            <h3 className="text-lg font-semibold mt-6 mb-4">Test Cases</h3>
            <div className="space-y-4">
              {testCases.map((testCase, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Input:</p>
                  <pre className="mt-1 text-sm">{`a: ${testCase.a}, b: ${testCase.b}`}</pre>
                  <p className="text-sm text-gray-600 mt-2">Expected Output:</p>
                  <pre className="mt-1 text-sm">{testCase.expected}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - Editor and output */}
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