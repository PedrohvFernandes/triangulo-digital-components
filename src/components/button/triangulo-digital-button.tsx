import React from 'react'

type ButtonType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'subtle'
  | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

interface TrianguloDigitalButtonProps {
  label: string
  type?: ButtonType
  size?: ButtonSize
  onClick?: () => void
}

export const TrianguloDigitalButton: React.FC<TrianguloDigitalButtonProps> = ({
  label,
  type = 'primary',
  size = 'lg',
  onClick,
}) => {
  const typeClasses: Record<ButtonType, string> = {
    primary:
      'triangulodigital:bg-green-500 triangulodigital:text-white triangulodigital:hover:bg-green-600',
    secondary:
      'triangulodigital:bg-gray-200 triangulodigital:text-gray-800 triangulodigital:hover:bg-gray-300',
    tertiary:
      'triangulodigital:bg-white triangulodigital:border triangulodigital:border-gray-300 triangulodigital:text-gray-900 triangulodigital:hover:bg-gray-100',
    subtle:
      'triangulodigital:bg-transparent triangulodigital:text-gray-800 triangulodigital:hover:bg-gray-100',
    destructive:
      'triangulodigital:bg-red-500 triangulodigital:text-white triangulodigital:hover:bg-red-600',
  }

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'triangulodigital:px-4 triangulodigital:py-1 triangulodigital:text-sm triangulodigital:rounded-md',
    md: 'triangulodigital:px-6 triangulodigital:py-2 triangulodigital:text-base triangulodigital:rounded-lg',
    lg: 'triangulodigital:px-8 triangulodigital:py-3 triangulodigital:text-lg triangulodigital:rounded-xl',
  }

  return (
    <button
      className={`${typeClasses[type]} ${sizeClasses[size]} transition duration-300`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
