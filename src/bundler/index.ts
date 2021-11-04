import * as esbuild from 'esbuild-wasm';
import { fetchPlugin, unpkgPathPlugin } from './plugins';

// Define a service variable;
let service: esbuild.Service;

/**
 * Starts the esbuild service, bundles and transpiles the `rawCode`.
 */
export const bundle = async (rawCode: string): Promise<string> => {
  // Check if the service has been initialized.
  if (!service) {
    // If not, initialize a new esbuild service.
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }

  // Bundle the code.
  const result = await service.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  });

  // Pull off the bundled code as a string;
  const bundledCode = result.outputFiles[0].text;

  return bundledCode;
};
