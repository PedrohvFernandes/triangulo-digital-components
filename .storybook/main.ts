import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/components/welcome.stories.@(ts|tsx)',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
    '../src/introduction/introduction.stories.@(ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  managerHead: (head) =>
    `${head}
      <link rel="shortcut icon" href="/logo-triangulo-digital.svg" type="image/ico">`,
}
export default config
