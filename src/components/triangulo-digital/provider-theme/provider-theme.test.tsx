import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { composeStories } from '@storybook/react'
import * as stories from './provider-theme.stories'
import { afterEach, describe, expect, it } from 'vitest'

const { Default } = composeStories(stories)

describe('ThemeProvider component (stories)', () => {
  afterEach(() => {
    // Limpa o localStorage após cada teste para evitar interferência entre testes
    localStorage.clear()
    cleanup()
  })

  it('renderiza o tema inicial', () => {
    render(<Default />)
    expect(screen.getByText(/Tema atual:/i)).toBeInTheDocument()
    expect(screen.getByText(/light|dark/i)).toBeInTheDocument() // verifica se mostra o estado inicial do tema
    expect(screen.getByText(/Esse bloco muda com o tema/i)).toBeInTheDocument()
  })

  it('alterna o tema ao clicar no botão', () => {
    render(<Default />)
    const button = screen.getByRole('button', { name: /Trocar tema/i })
    const themeText = screen.getByText(/Tema atual:/i).querySelector('span')

    expect(themeText?.textContent).toMatch(/light|dark/i)
    const initialTheme = themeText?.textContent

    fireEvent.click(button)

    expect(themeText?.textContent).not.toBe(initialTheme)
  })

  it('mantém o bloco de conteúdo visível após alternar tema', () => {
    render(<Default />)
    const button = screen.getByRole('button', { name: /Trocar tema/i })
    fireEvent.click(button)
    expect(screen.getByText(/Esse bloco muda com o tema/i)).toBeInTheDocument()
  })
})
