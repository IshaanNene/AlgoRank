import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Declare Monaco globally to avoid import issues
declare const monaco: any;

@Component({
  selector: 'app-monaco-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #editorContainer class="editor-container"></div>
    <div *ngIf="loadError" class="editor-error">
      Failed to load code editor. Please refresh the page.
    </div>
  `,
  styles: [`
    .editor-container {
      height: 100%;
      width: 100%;
      border: 1px solid #eee;
    }
    .editor-error {
      color: red;
      padding: 10px;
      text-align: center;
      border: 1px solid #eee;
      background-color: #f8f8f8;
    }
  `]
})
export class MonacoEditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @Input() code: string = '';
  @Input() language: string = 'javascript';
  @Input() readOnly: boolean = false;

  private editor: any = null;
  private monacoLoaded = false;
  loadError = false;

  ngOnInit(): void {
    this.loadMonacoEditor();
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  private loadMonacoEditor(): void {
    // If Monaco is already loaded, initialize the editor
    if ((window as any).monaco) {
      this.monacoLoaded = true;
      this.initMonaco();
      return;
    }

    // Set up Monaco environment for web workers
    (window as any).MonacoEnvironment = {
      getWorkerUrl: function(_moduleId: any, label: string) {
        const version = '0.45.0';
        const prefix = `https://cdn.jsdelivr.net/npm/monaco-editor@${version}/min/vs/`;
        
        if (label === 'json') {
          return `${prefix}language/json/json.worker.js`;
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return `${prefix}language/css/css.worker.js`;
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return `${prefix}language/html/html.worker.js`;
        }
        if (label === 'typescript' || label === 'javascript') {
          return `${prefix}language/typescript/ts.worker.js`;
        }
        return `${prefix}editor/editor.worker.js`;
      }
    };

    // Load Monaco script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
    script.onload = () => {
      try {
        const require = (window as any).require;
        
        require.config({
          paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }
        });
        
        require(['vs/editor/editor.main'], () => {
          this.monacoLoaded = true;
          this.initMonaco();
        });
      } catch (error) {
        console.error('Failed to load Monaco Editor:', error);
        this.loadError = true;
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Monaco Editor script');
      this.loadError = true;
    };
    
    document.body.appendChild(script);
  }

  private initMonaco(): void {
    if (!this.editorContainer || !this.monacoLoaded) {
      return;
    }

    try {
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.code,
        language: this.language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        readOnly: this.readOnly,
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3
      });
    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error);
      this.loadError = true;
    }
  }

  getCode(): string {
    return this.editor?.getValue() || '';
  }

  setCode(code: string): void {
    if (this.editor) {
      this.editor.setValue(code);
    } else if (code) {
      // Store the code for when the editor is initialized
      this.code = code;
    }
  }

  setLanguage(language: string): void {
    if (this.editor) {
      monaco.editor.setModelLanguage(this.editor.getModel(), language);
      this.language = language;
    } else {
      // Store the language for when the editor is initialized
      this.language = language;
    }
  }
}