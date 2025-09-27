import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/react'
import * as stories from './button.stories'
import { describe, it, expect } from 'vitest'

const { Default, Destructive, Outline, Ghost, Icon } = composeStories(stories)

describe('Button component (stories)', () => {
  it('renderiza o botão default', () => {
    render(<Default />)
    expect(
      screen.getByRole('button', { name: /default button/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o botão destructive', () => {
    render(<Destructive />)
    expect(screen.getByRole('button', { name: /delete/i })).toHaveClass(
      'bg-destructive',
    )
  })

  it('renderiza o botão outline', () => {
    render(<Outline />)
    expect(
      screen.getByRole('button', { name: /outline button/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o botão ghost', () => {
    render(<Ghost />)
    expect(
      screen.getByRole('button', { name: /ghost button/i }),
    ).toBeInTheDocument()
  })

  it('renderiza o botão ícone', () => {
    render(<Icon />)
    expect(screen.getByRole('button', { name: '🔍' })).toBeInTheDocument()
  })
})
