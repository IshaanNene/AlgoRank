import { Box, useColorModeValue } from '@chakra-ui/react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
}

const CodeEditor = ({ code, language, onChange, readOnly = false }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure editor
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
      lineHeight: 21,
      readOnly,
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 5,
      automaticLayout: true,
    });

    // Set theme
    monaco.editor.defineTheme('algorank-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
      },
    });

    monaco.editor.defineTheme('algorank-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a202c',
      },
    });

    // Set the theme based on color mode
    const isDark = document.documentElement.classList.contains('chakra-ui-dark');
    monaco.editor.setTheme(isDark ? 'algorank-dark' : 'algorank-light');
  };

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box
      h="600px"
      w="full"
      position="relative"
      borderWidth={1}
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
    >
      <Editor
        height="100%"
        defaultLanguage={language.toLowerCase()}
        defaultValue={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
        }}
      />
    </Box>
  );
};

export default CodeEditor; 