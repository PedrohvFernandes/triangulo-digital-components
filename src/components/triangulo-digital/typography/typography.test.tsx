import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/react'
import * as stories from './typography.stories' // importa todas as stories do Typography
import { describe, expect, it } from 'vitest'

// Compondo todas as stories para poder renderizá-las nos testes
const {
  AllVariants,
  TitleLarge,
  TitleMedium,
  TitleSmall,
  SubtitleLarge,
  SubtitleMedium,
  SubtitleSmall,
  Paragraph,
  Span,
} = composeStories(stories)

describe('Typography component (stories)', () => {
  it('renderiza a story AllVariants sem crash', () => {
    const { container } = render(<AllVariants />)
    expect(container).toBeInTheDocument()
  })

  it('renderiza TitleLarge corretamente', () => {
    render(<TitleLarge />)
    expect(screen.getByText('Título Grande')).toBeInTheDocument()
  })

  it('renderiza TitleMedium corretamente', () => {
    render(<TitleMedium />)
    expect(screen.getByText('Título Médio')).toBeInTheDocument()
  })

  it('renderiza TitleSmall corretamente', () => {
    render(<TitleSmall />)
    expect(screen.getByText('Título Pequeno')).toBeInTheDocument()
  })

  it('renderiza SubtitleLarge corretamente', () => {
    render(<SubtitleLarge />)
    expect(screen.getByText('Subtítulo Grande')).toBeInTheDocument()
  })

  it('renderiza SubtitleMedium corretamente', () => {
    render(<SubtitleMedium />)
    expect(screen.getByText('Subtítulo Médio')).toBeInTheDocument()
  })

  it('renderiza SubtitleSmall corretamente', () => {
    render(<SubtitleSmall />)
    expect(screen.getByText('Subtítulo Pequeno')).toBeInTheDocument()
  })

  it('renderiza Paragraph corretamente', () => {
    render(<Paragraph />)
    expect(screen.getByText(/Lorem ipsum dolor sit amet/i)).toBeInTheDocument()
  })

  it('renderiza Span corretamente', () => {
    render(<Span />)
    expect(screen.getByText('Texto em span')).toBeInTheDocument()
  })
})
