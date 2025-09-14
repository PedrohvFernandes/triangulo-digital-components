# Triângulo Digital Components

# Como usar:

### Instalação:

#### Next.js

```bash
npm install triangulo-digital-components tailwindcss @tailwindcss/postcss
```
```bash
yarn add triangulo-digital-components tailwindcss @tailwindcss/postcss
```
```bash
pnpm add triangulo-digital-components tailwindcss @tailwindcss/postcss
```


###### Configuração do Tailwind CSS:

Crie o arquivo `postcss.config.js` / `postcss.config.mjs` na raiz do seu projeto com o seguinte conteúdo:

js:
```javascript
// Formato compatível com Next.js e Vite
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    // adicione aqui outros plugins necessários em formato de objeto
  },
};
```
Mjs:
```javascript
// Formato compatível com Next.js e Vite
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    // adicione aqui outros plugins necessários em formato de objeto
  },
};
```
#### React + Vite

```bash
npm install triangulo-digital-components tailwindcss @tailwindcss/vite
```
```bash
yarn add triangulo-digital-components tailwindcss @tailwindcss/vite
```
```bash
pnpm add triangulo-digital-components tailwindcss @tailwindcss/vite
```

###### Configuração do Tailwind CSS:

Você pode usar a mesma config do next, ou se preferir adicione o plugin do Tailwind CSS no arquivo `vite.config.js` ou `vite.config.ts`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```
ou vite + swc
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Importação de estilos globais/tokens/fontes:
Depois você deve importar os arquivos CSS globalmente em seu projeto, no arquivo `index.css` ou `global.css`:
```css
@import "triangulo-digital-components/styles.css";
@import "triangulo-digital-components/tailwind-entry.css";
```

Você pode importar o arquivo CSS globalmente em seu projeto no seu ponto de entrada, por exemplo, no arquivo `index.js` ou `App.js`, ou se tratando de um projeto next js, no arquivo `_app.js` ou app router no arquivo `layout.js`:
```javascript
import './index.css'; // ou './global.css'
```

Mais detalhes sobre a configuração do Tailwind CSS podem ser encontrados na [documentação oficial do Tailwind CSS](https://tailwindcss.com/docs/installation).

### Importação de componentes, exemplo de uso:
```javascript
import { TrianguloDigitalButton } from 'triangulo-digital-components';
```

### Documentação:
A documentação completa dos componentes e suas variações está disponível no Storybook: [Storybook Triângulo Digital Components](https://triangulo-digital-components.vercel.app/)


### Futuro:
- Adicionar mais componentes conforme a necessidade do design system.
- Adicionar suporte para temas (claro/escuro).
- Adicionar testes unitários e de integração para garantir a qualidade dos componentes Com Vitest.
- Lib de componentes shadcn/ui com providers de tema e personalização.
