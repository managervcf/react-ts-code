import './code-editor.css';
import './syntax.css';
import { useRef } from 'react';
import Editor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, editor) => {
    // Set the reference to the monaco editor.
    editorRef.current = editor;

    // Add an event listener that updates the code state on change.
    editor.onDidChangeModelContent(() => {
      // Update the code state.
      onChange(getValue());
    });

    // Change the tab size from 4 to 2.
    editor.getModel()?.updateOptions({ tabSize: 2 });

    // Create a new instance of the highlighter.
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      editor
    );

    // If code changes inside the code editor, apply highlighting.
    // Add weird options to prevent console.logging a syntax error
    // with every keypress.
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  // Formats the code inside the code editor.
  const onFormatClick = () => {
    // Get the current value from the editor.
    const unformattedCode = editorRef.current.getModel()?.getValue();

    // Format that value with configuration options for prettier.
    const formattedCode = prettier
      .format(unformattedCode, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      // Remove the last newline character from the formatted code.
      .replace(/\n$/, '');

    // Set the formatted value vack in the editor.
    editorRef.current.setValue(formattedCode);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small is-rounded"
        onClick={onFormatClick}
      >
        Format
      </button>
      <Editor
        value={initialValue}
        editorDidMount={onEditorDidMount}
        height="500px"
        language="javascript"
        theme="dark"
        options={{
          wordWrap: 'on',
          minimap: {
            enabled: false,
          },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
