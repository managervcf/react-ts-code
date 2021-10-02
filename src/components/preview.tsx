import { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
}

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

export const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (iframeRef?.current) {
      // Reset the contents of the iframe.
      iframeRef.current.srcdoc = html;

      // Post a message to the iframe that will execute the received code.
      iframeRef.current.contentWindow?.postMessage(code, '*');
    }
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      title="preview"
      sandbox="allow-scripts"
    />
  );
};
