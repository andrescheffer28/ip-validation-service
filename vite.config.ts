import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['**/node_modules/**', '**/*.e2e-spec.ts', '**/*.e2e.spec.ts', '**/dist/**', '**/dist-test/**'],
  },
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.base.json'] }),
    swc.vite({
      module: { type: 'es6' },
      // Adicione este bloco 'jsc' para o SWC entender os decorators do NestJS
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
});
