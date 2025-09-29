import { Typography } from '@/components/triangulo-digital'

export const HowToUse = () => (
  <div className="space-y-4 max-w-3xl">
    <Typography variant="subtitleLarge" weight="bold">
      📖 Como usar
    </Typography>
    <Typography variant="paragraph">
      Depois de instalar, importe o componente desejado:
    </Typography>
    <pre className="bg-gray-100 p-3 rounded-md">
      {`import { Button } from 'triangulo-digital-components'`}
    </pre>
  </div>
)
