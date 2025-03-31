import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play, Save, RotateCcw, Settings, Share2 } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: string;
  onSubmit?: (code: string) => void;
  onSave?: (code: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'python',
  theme = 'vs-dark',
  onSubmit,
  onSave,
  readOnly = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [settings, setSettings] = useState({
    fontSize: 14,
    tabSize: 4,
    minimap: true,
    wordWrap: 'on',
  });

  const handleEditorChange = (value: string = '') => {
    setCode(value);
  };

  const handleRun = async () => {
    if (!code.trim() || isRunning) return;

    setIsRunning(true);
    setOutput('Running...');

    try {
      // Here you would typically make an API call to run the code
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput('Code executed successfully!');
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    onSave?.(code);
  };

  const handleSubmit = () => {
    onSubmit?.(code);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg overflow-hidden shadow-lg bg-gray-800"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => {/* Handle language change */}}
            className="bg-gray-700 text-white rounded px-3 py-1"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={() => {/* Toggle settings */}}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCode('')}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <RotateCcw className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <Save className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            disabled={isRunning}
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        </div>
      </div>

      <div className="h-[500px]">
        <Editor
          height="100%"
          defaultLanguage={language}
          defaultValue={initialCode}
          theme={theme}
          onChange={handleEditorChange}
          options={{
            ...settings,
            readOnly,
            minimap: { enabled: settings.minimap },
            scrollBeyondLastLine: false,
            fontSize: settings.fontSize,
            tabSize: settings.tabSize,
            wordWrap: settings.wordWrap,
          }}
        />
      </div>

      {output && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="border-t border-gray-700"
        >
          <div className="p-4 font-mono text-sm text-white">
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 