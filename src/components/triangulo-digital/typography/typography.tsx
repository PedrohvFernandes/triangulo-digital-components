import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      // títulos
      titleLarge: 'text-4xl font-bold tracking-tight',
      titleMedium: 'text-3xl font-semibold tracking-tight',
      titleSmall: 'text-2xl font-medium tracking-tight',

      // subtítulos
      subtitleLarge: 'text-xl font-semibold text-muted-foreground',
      subtitleMedium: 'text-lg font-medium text-muted-foreground',
      subtitleSmall: 'text-base font-normal text-muted-foreground',

      // parágrafo
      paragraph: 'text-base leading-relaxed',

      // span (inline)
      span: 'text-sm leading-none',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
    weight: 'normal',
    align: 'left',
  },
})

// Tipos de elementos permitidos
type TypographyElement = 'h1' | 'h2' | 'h3' | 'p' | 'span'

// Mapeamento entre variant -> elemento HTML padrão
const variantToElement: Record<
  NonNullable<VariantProps<typeof typographyVariants>['variant']>,
  TypographyElement
> = {
  titleLarge: 'h1',
  titleMedium: 'h2',
  titleSmall: 'h3',

  subtitleLarge: 'h3',
  subtitleMedium: 'h3',
  subtitleSmall: 'h3',

  paragraph: 'p',
  span: 'span',
}

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement // opcional, sobrescreve o mapeamento
}

function Typography({
  className,
  variant,
  weight,
  align,
  as,
  ...props
}: TypographyProps) {
  const Component = as ?? (variant ? variantToElement[variant] : 'p')

  return (
    <Component
      data-slot="typography"
      className={cn(typographyVariants({ variant, weight, align, className }))}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
