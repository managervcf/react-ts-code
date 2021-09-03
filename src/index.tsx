import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchPlugin, unpkgPathPlugin } from './plugins';

const App = () => {
  const ref = useRef<esbuild.Service | null>(null);
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    startService();
  }, []);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    const outputCode = result.outputFiles[0].text;

    // setCode(outputCode);
    // Post an indirect message to the iframe that executes the received code
    iframe.current?.contentWindow?.postMessage(outputCode, '*');
  };

  const html = `
   <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', event => {
          eval(event.data);
        }, false);
      </script>
    </body>
   </html>
  `;

  return (
    <div>
      <textarea
        style={{ width: '80vw', height: '30vh' }}
        value={input}
        onChange={e => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <code>{code}</code>
      <iframe ref={iframe} srcDoc={html} sandbox="allow-scripts"></iframe>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
