import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/dist-test/**'],
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
})
