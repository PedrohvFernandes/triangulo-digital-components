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
    <Typography variant="paragraph">
      Depois você deve importar o(S) arquivo(s) CSS globalmente em seu projeto,
      no arquivo `index.css` ou `global.css`:
    </Typography>
    <pre className="bg-gray-100 p-3 rounded-md">
      {`@import "triangulo-digital-components/styles.css";`}
      {`@import "triangulo-digital-components/raw.css"; /* Caso queira usar o arquivo raw com as configurações originais do tailwind */`}
    </pre>
    <Typography variant="paragraph">
      Você pode importar o arquivo CSS globalmente em seu projeto no seu ponto
      de entrada, por exemplo, no arquivo `index.js` ou `App.js`, ou se tratando
      de um projeto next js, no arquivo `_app.js` ou app router no arquivo
      `layout.js`:
    </Typography>
    <pre className="bg-gray-100 p-3 rounded-md">
      {`import 'triangulo-digital-components/styles.css';`}
    </pre>
  </div>
)
