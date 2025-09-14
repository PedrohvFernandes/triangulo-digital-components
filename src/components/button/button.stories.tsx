// src/components/TrianguloDigitalButton/TrianguloDigitalButton.stories.ts
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrianguloDigitalButton } from './triangulo-digital-button'

const meta = {
  title: 'Components/TrianguloDigitalButton',
  component: TrianguloDigitalButton,
  tags: ['docsPage'],
  argTypes: {
    label: { control: { type: 'text' } },
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'subtle', 'destructive'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof TrianguloDigitalButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    type: 'primary',
    size: 'md',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    type: 'secondary',
    size: 'md',
  },
}

export const Destructive: Story = {
  args: {
    label: 'Destructive Button',
    type: 'destructive',
    size: 'md',
  },
}
