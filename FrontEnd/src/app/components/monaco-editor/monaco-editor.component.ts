import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-monaco-editor',
  standalone: true,
  imports: [CommonModule],
  template: `<div #editorContainer class="editor-container"></div>`,
  styles: [`
    .editor-container {
      height: 100%;
      width: 100%;
      border: 1px solid #eee;
    }
  `]
})
export class MonacoEditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @Input() code: string = '';
  @Input() language: string = 'javascript';
  @Input() readOnly: boolean = false;

  private editor: monaco.editor.IStandaloneCodeEditor | null = null;

  ngOnInit(): void {
    this.initMonaco();
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  private initMonaco(): void {
    if (!this.editorContainer) {
      return;
    }

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
  }

  getCode(): string {
    return this.editor?.getValue() || '';
  }

  setCode(code: string): void {
    if (this.editor) {
      this.editor.setValue(code);
    }
  }
}