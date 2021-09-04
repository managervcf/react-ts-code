import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchPlugin, unpkgPathPlugin } from './plugins';
import CodeEditor from './components/code-editor';

const App = () => {
  const esbuildRef = useRef<esbuild.Service | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Start the esbuild service only once at the first render.
    startService();
  }, []);

  /**
   * Starts the esbuild service and assigns a reference to it.
   */
  const startService = async () => {
    esbuildRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  const onClick = async () => {
    // Wait for the references to be created.
    if (!esbuildRef.current || !iframeRef.current) {
      return;
    }

    // Reset the contents of the iframe.
    iframeRef.current.srcdoc = html;

    // Transpile and bundle user's input code.
    const result = await esbuildRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // Get the bundled and transpiled result code.
    const outputCode = result.outputFiles[0].text;

    // Post a message to the iframe that will execute the received code.
    iframeRef.current.contentWindow?.postMessage(outputCode, '*');
  };

  /**
   * HTML template for the iframe element.
   */
  const html = /*html*/ `
   <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', async event => {
          try {
            await eval(event.data);
          } catch (error) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
            console.log(error);
          }
        }, false);
      </script>
    </body>
   </html>
  `;

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={value => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        title="preview"
        ref={iframeRef}
        srcDoc={html}
        sandbox="allow-scripts"
      ></iframe>
    </div>
  );
};

// Render the App component on the screen.
ReactDOM.render(<App />, document.querySelector('#root'));
