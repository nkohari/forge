#!/usr/bin/env node

const { build, buildSync } = require('esbuild');
const commandLineArgs = require('command-line-args');

const args = commandLineArgs([{ name: 'watch', alias: 'w', type: Boolean }]);

const options = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  external: [],
  format: 'esm',
  outdir: 'dist',
  platform: 'node',
  sourcemap: 'external',
};

if (args.watch) {
  build({
    ...options,
    format: 'cjs',
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error('esbuild error: %s', error);
        } else {
          console.log('esbuild ran successfully');
        }
      },
    },
  }).then(() => {
    console.log('esbuild complete, watching for changes');
  });
} else {
  buildSync({ ...options, format: 'cjs' });
  buildSync({ ...options, outExtension: { '.js': '.mjs' } });
}
