import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/JsonFormBuilder.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'JsonFormBuilder',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    }),
    terser()
  ]
};
