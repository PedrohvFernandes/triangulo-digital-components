/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from '.'

const meta: Meta<typeof Typography> = {
  title: 'Componentes Geral/triangulo-digital/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'titleLarge',
        'titleMedium',
        'titleSmall',
        'subtitleLarge',
        'subtitleMedium',
        'subtitleSmall',
        'paragraph',
        'span',
      ],
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Typography>

/**
 * Mostra todas as variantes e pesos disponíveis
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      {[
        'titleLarge',
        'titleMedium',
        'titleSmall',
        'subtitleLarge',
        'subtitleMedium',
        'subtitleSmall',
        'paragraph',
        'span',
      ].map((variant) => (
        <div key={variant} className="space-y-1">
          <Typography variant="span" weight="bold">
            {variant}
          </Typography>
          <div className="flex flex-col gap-1">
            {['light', 'normal', 'medium', 'semibold', 'bold'].map((weight) => (
              <Typography
                key={weight}
                variant={variant as any}
                weight={weight as any}
              >
                {`${variant} – ${weight}`}
              </Typography>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}

/**
 * Variantes individuais
 */
export const TitleLarge: Story = {
  args: {
    children: 'Título Grande',
    variant: 'titleLarge',
    weight: 'bold',
  },
}

export const TitleMedium: Story = {
  args: {
    children: 'Título Médio',
    variant: 'titleMedium',
    weight: 'semibold',
  },
}

export const TitleSmall: Story = {
  args: {
    children: 'Título Pequeno',
    variant: 'titleSmall',
    weight: 'medium',
  },
}

export const SubtitleLarge: Story = {
  args: {
    children: 'Subtítulo Grande',
    variant: 'subtitleLarge',
    weight: 'semibold',
  },
}

export const SubtitleMedium: Story = {
  args: {
    children: 'Subtítulo Médio',
    variant: 'subtitleMedium',
    weight: 'medium',
  },
}

export const SubtitleSmall: Story = {
  args: {
    children: 'Subtítulo Pequeno',
    variant: 'subtitleSmall',
    weight: 'normal',
  },
}

export const Paragraph: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.',
    variant: 'paragraph',
  },
}

export const Span: Story = {
  args: {
    children: 'Texto em span',
    variant: 'span',
    weight: 'semibold',
  },
}
