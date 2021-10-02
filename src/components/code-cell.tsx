import { useState } from 'react';
import { CodeEditor } from './code-editor';
import { Preview } from './preview';
import { bundleCode } from '../bundler';

export const CodeCell = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  /**
   * Bundles the `input` state and updates the `code` state.
   */
  const onClick = async () => {
    // Get the bundled and transpiled result code.
    const bundledCode = await bundleCode(input);

    // Update the `code` state.
    setCode(bundledCode);
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={value => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};
