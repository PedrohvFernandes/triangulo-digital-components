'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  themeState: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeState, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    // tenta recuperar tema salvo no localStorage
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setThemeState(stored)
      document.documentElement.classList.add(stored)
    } else {
      document.documentElement.classList.add('light')
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setTheme(themeState === 'light' ? 'dark' : 'light')
  }

  return (
    // Compartilha o estado e funções do tema
    <ThemeContext.Provider value={{ themeState, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook para usar o tema, para modificar ou ler o tema atual
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context)
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  return context
}
