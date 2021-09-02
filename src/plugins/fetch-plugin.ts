import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      /**
       * Handles the caching logic, retrieves a cached object.
       */
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // Check to see if we have already fetched this file
        // and if it is in the cache.
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // If it is, return immediately.
        if (cachedResult) {
          return cachedResult;
        }
      });

      /**
       * Handles `index.js` file file.
       */
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      /*
       * Handles `.css` files.
       */
      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        // If not, fetch the file from unpkg.
        const { data, request } = await axios.get(args.path);

        // Find any conflicting characters inside the css file and escape them,
        // to avoid early termination of the string.
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '||"')
          .replace(/'/g, "\\'");

        // Clever way to inject css styles inside our js file.
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store response in cache.
        await fileCache.setItem(args.path, result);

        // Return the OnLoadResult object.
        return result;
      });

      /*
       * Handles other files.
       */
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        // If not, fetch the file from unpkg.
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // Store response in cache.
        await fileCache.setItem(args.path, result);

        // Return the OnLoadResult object.
        return result;
      });
    },
  };
};
