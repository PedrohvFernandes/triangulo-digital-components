import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider, useTheme } from '.'
import { Typography } from '../typography'

const meta: Meta<typeof ThemeProvider> = {
  title: 'Componentes Geral/triangulo-digital/ProviderTheme',
  component: ThemeProvider,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ThemeProvider>

/**
 * Mostra o uso completo do ThemeProvider, incluindo toggle de tema.
 */
export const Default: Story = {
  render: () => {
    const ThemeDemo = () => {
      const { themeState, toggleTheme } = useTheme()

      return (
        <div className="p-6 space-y-4">
          <Typography variant="paragraph" weight="medium">
            Tema atual: <span className="font-bold">{themeState}</span>
          </Typography>

          <button
            onClick={toggleTheme}
            className="rounded-lg border px-4 py-2 transition-colors
                   bg-gray-200 dark:bg-gray-800
                   text-gray-800 dark:text-gray-200"
          >
            Trocar tema
          </button>

          <div
            className="p-4 rounded-lg border
                       bg-white text-black
                       dark:bg-black dark:text-white"
          >
            <Typography variant="paragraph" weight="medium">
              Esse bloco muda com o tema.
            </Typography>
          </div>
        </div>
      )
    }

    return (
      <ThemeProvider>
        <ThemeDemo />
      </ThemeProvider>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `
<ThemeProvider>
  <ThemeDemo />
</ThemeProvider>

function ThemeDemo() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className="p-6 space-y-4">
      <Typography variant="paragraph" weight="medium">
        Tema atual: <span className="font-bold">{theme}</span>
      </Typography>

      <Button variant="secondary" size="sm" onClick={toggleTheme}>
        Trocar tema
      </Button>

      <div
        className="p-4 rounded-lg border
                   bg-white text-black
                   dark:bg-black dark:text-white"
      >
        <Typography variant="paragraph" weight="medium">
          Esse bloco muda com o tema.
        </Typography>
      </div>
    </div>
  )
}
        `,
      },
    },
  },
}
