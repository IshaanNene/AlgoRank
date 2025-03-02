/**
 * Monaco Editor Worker Loader
 * This script helps load Monaco Editor web workers correctly
 */

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return './assets/monaco/vs/language/json/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './assets/monaco/vs/language/css/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './assets/monaco/vs/language/html/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './assets/monaco/vs/language/typescript/ts.worker.js';
    }
    return './assets/monaco/vs/editor/editor.worker.js';
  }
}; 