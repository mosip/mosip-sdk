import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const config = {
  input: 'src/JsonFormBuilder.ts',
  output: [
    {
      file: 'dist/JsonFormBuilder.umd.js',
      format: 'umd',
      name: 'JsonFormBuilder',
      sourcemap: true,
      globals: {},
      plugins: [terser()]
    },
    {
      file: 'dist/JsonFormBuilder.esm.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      module: 'esnext'
    }),
    nodeResolve({
      browser: true,
      extensions: ['.ts', '.js']
    }),
    commonjs()
  ],
  external: []
};

export default config;
