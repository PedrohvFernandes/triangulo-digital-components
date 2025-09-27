// .storybook/preview.ts
import type { Preview } from '@storybook/react-vite'
import '../src/index.css'
import '../src/fonts.css'
import { useEffect } from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Tema',
      description: 'Mudar tema da aplicação',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow', // ícone do toolbar
        items: ['light', 'dark'],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as 'light' | 'dark'

      useEffect(() => {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
      }, [theme])

      return <Story />
    },
  ],
}

export default preview
