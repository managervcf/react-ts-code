import { useState } from 'react';
import { CodeEditor } from './code-editor';
import { Preview } from './preview';
import { bundle } from '../bundler';
import { Resizable } from './resizable';

/**
 * Entire code cell containing a code editor and a preview.
 */
export const CodeCell: React.FC = () => {
  // Bundled code.
  const [code, setCode] = useState('');
  // User input in the code editor.
  const [input, setInput] = useState('');

  /**
   * Bundles the `input` state and updates the `code` state.
   */
  const onClick = async () => {
    // Get the bundled and transpiled result code.
    const bundledCode = await bundle(input);
    // Update the `code` state.
    setCode(bundledCode);
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <CodeEditor
          initialValue={`
        import { Component } from 'react';
        import ReactDOM from 'react-dom';
        const App = () => <div>Hi there</div>;
        ReactDOM.render(<App/>, document.querySelector('#root'));`}
          onChange={value => setInput(value)}
        />
        <Preview code={code} />
      </div>
    </Resizable>
  );
};
