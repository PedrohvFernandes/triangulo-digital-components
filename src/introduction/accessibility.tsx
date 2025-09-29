import { Typography } from '@/components/triangulo-digital'

export const Accessibility = () => (
  <div className="space-y-4 max-w-3xl">
    <Typography variant="subtitleLarge" weight="bold">
      ♿ Acessibilidade
    </Typography>
    <Typography variant="paragraph">
      Todos os componentes foram desenvolvidos com foco em acessibilidade (ARIA
      roles, navegação por teclado e compatibilidade com leitores de tela).
    </Typography>
  </div>
)
