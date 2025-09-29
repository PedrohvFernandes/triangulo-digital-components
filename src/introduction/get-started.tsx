import { Typography } from '@/components/triangulo-digital'

export const GetStarted = () => (
  <div className="space-y-4 max-w-3xl">
    <Typography variant="subtitleLarge" weight="bold">
      🚀 Como começar
    </Typography>
    <Typography variant="paragraph">Instale a lib com:</Typography>
    <pre className="bg-gray-100 p-3 rounded-md">
      npm install triangulo-digital-components
    </pre>

    <Typography variant="paragraph">
      ou você pode usar o npx para criar um projeto com vite(Ou se for next com
      preprocess(postcss)) + tailwindCSS já com a biblioteca instalada. Basta
      rodar:
    </Typography>

    <pre className="bg-gray-100 p-3 rounded-md">
      npx triangulo-digital-components
    </pre>
  </div>
)
