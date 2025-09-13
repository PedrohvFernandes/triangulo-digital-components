/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

import { peerDependencies } from './package.json'

// https://vite.dev/config/
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.stories.ts', '**/*.test.ts'],
    }),
    tailwindcss(),
  ],
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
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
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      styles: path.resolve(__dirname, 'src/styles'),
      utils: path.resolve(__dirname, 'src/utils'),
      types: path.resolve(__dirname, 'src/types'),
      hooks: path.resolve(__dirname, 'src/hooks'),
    },
  },
  optimizeDeps: {
    disabled: false,
  },
  define: {
    'process.env': process.env,
    global: 'window',
  },
  build: {
    lib: {
      // O entry é o ponto de entrada da sua biblioteca
      entry: path.resolve(__dirname, 'src/index.ts'),
      // O nome da sua biblioteca
      name: 'triangulo-digital-components',
      // O nome dos arquivos de saída, ex: triangulo-digital-components.umd.js. Arquivos de saída são nada mais que os arquivos gerados no build
      fileName: (format) => `triangulo-digital-components.${format}.js`,
      // Os formatos de saída da sua biblioteca. Es --> ecma Script, Cjs --> CommonJS, Umd --> Universal Module Definition
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      // As dependências que você não quer que sejam empacotadas na sua biblioteca
      external: Object.keys(peerDependencies),
      output: {
        // As globals são necessárias para o formato UMD, onde você precisa informar o nome global da dependência externa
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
