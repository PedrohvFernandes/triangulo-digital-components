/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { peerDependencies } from './package.json'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

const alias = {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    components: path.resolve(__dirname, 'src/components'),
    'components-shadcn-ui': path.resolve(__dirname, 'src/components/shadcn-ui'),
    'components-triangulo-digital': path.resolve(
      __dirname,
      'src/components/triangulo-digital',
    ),
    styles: path.resolve(__dirname, 'src/styles'),
    utils: path.resolve(__dirname, 'src/lib'),
    types: path.resolve(__dirname, 'src/types'),
    hooks: path.resolve(__dirname, 'src/hooks'),
  },
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      exclude: [
        '**/*.stories.ts',
        '**/*.stories.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        'node_modules',
        'dist',
        'storybook-dist',
        'test',
        '**/*.test.*',
        '**/*.spec.*',
        './src/introduction/*',
      ],
    }),
    tailwindcss(),
  ],
  test: {
    projects: [
      // Projeto Storybook (stories viram testes)
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
      // Projeto normal para *.test.tsx
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: [
            'src/**/*.test.{ts,tsx}',
            'src/**/__tests__/*.{ts,tsx}',
            'src/**/*.spec.{ts,tsx}',
          ],
          setupFiles: ['./vitest.setup.ts'],
          alias: alias.alias,
        },
      },
    ],
  },
  server: { port: 3000 },
  preview: { port: 3000 },
  resolve: {
    alias: alias.alias,
  },
  optimizeDeps: {
    // disabled: false,
    exclude: ['**/*.stories.tsx'],
  },
  define: {
    'process.env': process.env,
    global: 'window',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'triangulo-digital-components',
      fileName: (format) => `triangulo-digital-components.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
})
