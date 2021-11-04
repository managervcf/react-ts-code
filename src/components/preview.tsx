import './preview.css';
import { useEffect, useRef } from 'react';
import { iframeHtml } from '../templates';

interface PreviewProps {
  code: string;
}

export const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (iframeRef?.current) {
      // Reset the contents of the iframe.
      iframeRef.current.srcdoc = iframeHtml;
      // Post a message to the iframe that will execute the received code.
      iframeRef.current.contentWindow?.postMessage(code, '*');
    }
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={iframeHtml}
      title="preview"
      sandbox="allow-scripts"
    />
  );
};
