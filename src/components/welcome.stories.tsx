import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from '@/components/triangulo-digital' // exemplo

const meta: Meta = {
  title: '📝 Introdução / Bem-vindo',
}

export default meta

type Story = StoryObj

export const Welcome: Story = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <img
          src="/logo-triangulo-digital.svg"
          alt="Logo Triângulo Digital"
          className="size-16"
        />
        <Typography variant="titleLarge" weight="bold">
          Triângulo Digital Components
        </Typography>
      </div>
      <Typography variant="paragraph">
        Esta é a biblioteca de componentes usada no design system da Triângulo
        Digital. Ela é construída em <strong>React</strong> e estilizada com{' '}
        <strong>TailwindCSS</strong>.
      </Typography>

      <Typography variant="subtitleLarge">Recursos:</Typography>
      <ul className="space-y-1">
        <li>
          <a
            href="https://www.npmjs.com/package/triangulo-digital-components"
            target="_blank"
            rel="noreferrer"
          >
            NPM da nossa lib
          </a>
        </li>
        <li>
          <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
            TailwindCSS
          </a>
        </li>
        <li>
          <a href="https://ui.shadcn.com/" target="_blank" rel="noreferrer">
            Shadcn UI
          </a>
        </li>
      </ul>

      <Typography variant="paragraph">
        Use esta biblioteca para construir interfaces consistentes, seguindo o
        design system da empresa.
      </Typography>
    </div>
  ),
}
