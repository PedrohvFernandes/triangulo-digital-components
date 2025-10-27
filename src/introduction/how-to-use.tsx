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

    <Typography variant="paragraph">
      Caso queira usar o arquivo com as customizações do tailwind buildado,
      nesse caso não precisa do tailwindcss instalado, pois ele gerou as classes
      para um css nativo ex: bg-primary, mas o intellisense não funciona. Ou
      seja, só é interessante usar esse import, caso vá utilizar algum
      componente dessa lib, pois assim os componentes irão vir com os estilos
      corretos, e além disso sem o intellisense ficará complicado de aplicar os
      estilos como bg-primary nos componentes do seu projeto principal, pela
      falta de intellisense, ele até aplica e funciona, mas fica complicado
      saber quais classes estão disponíveis.
    </Typography>

    <pre className="bg-gray-100 p-3 rounded-md">
      {`@import "triangulo-digital-components/styles.css";`}
    </pre>

    <Typography variant="paragraph">
      Caso queira usar o arquivo raw com as configurações originais do tailwind,
      aqui já precisa do tailwindcss instalado no projeto principal, o
      intellisense funciona, com isso dá para aplicar os estilos dessa lib no
      seus componentes do seu projeto principal
    </Typography>
    <pre className="bg-gray-100 p-3 rounded-md">
      {`@import "triangulo-digital-components/raw.css";`}
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
