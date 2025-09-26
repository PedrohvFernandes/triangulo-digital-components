import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

const componentsRoot = path.resolve(dirname, '../src/components')
const srcRoot = path.resolve(dirname, '../src')
const rootIndexPath = path.join(componentsRoot, 'index.ts')
const srcIndexPath = path.join(srcRoot, 'index.ts')

// Lista as pastas principais (shadcn-ui, triangulo-digital, etc.)
const mainFolders = fs
  .readdirSync(componentsRoot)
  .filter((f) => fs.statSync(path.join(componentsRoot, f)).isDirectory())

let rootIndexContent = '// Arquivo gerado automaticamente\n\n'

mainFolders.forEach((mainFolder) => {
  const mainFolderPath = path.join(componentsRoot, mainFolder)
  const mainIndexPath = path.join(mainFolderPath, 'index.ts')

  // Lista subpastas de componentes dentro da pasta principal
  const componentFolders = fs
    .readdirSync(mainFolderPath)
    .filter((f) => fs.statSync(path.join(mainFolderPath, f)).isDirectory())

  let mainIndexContent = '// Arquivo gerado automaticamente\n\n'

  componentFolders.forEach((folder) => {
    const folderPath = path.join(mainFolderPath, folder)

    // Lista arquivos .ts/.tsx (ignora stories e index)
    const componentFiles = fs
      .readdirSync(folderPath)
      .filter(
        (f) =>
          (f.endsWith('.ts') || f.endsWith('.tsx')) &&
          !f.includes('.stories') &&
          !/^index\.(ts|tsx)$/.test(f),
      )

    if (componentFiles.length === 0) return

    // Gera o index.ts dentro da subpasta do componente
    let componentIndexContent = '// Arquivo gerado automaticamente\n\n'
    componentFiles.forEach((file) => {
      const importPath = `./${file.replace(/\.(ts|tsx)$/, '')}`
      componentIndexContent += `export * from '${importPath}'\n`
    })

    fs.writeFileSync(
      path.join(folderPath, 'index.ts'),
      componentIndexContent,
      'utf8',
    )

    // Adiciona exportação no índice da pasta principal
    mainIndexContent += `export * from './${folder}'\n`
  })

  // Cria index.ts na pasta principal (shadcn-ui / triangulo-digital)
  fs.writeFileSync(mainIndexPath, mainIndexContent, 'utf8')

  // Adiciona exportação no index geral (components/index.ts)
  rootIndexContent += `export * from './${mainFolder}'\n`
})

// Cria o index.ts geral em components
fs.writeFileSync(rootIndexPath, rootIndexContent, 'utf8')

// --- Cria o index.ts do SRC com exports gerais ---
const srcIndexContent = `// Arquivo gerado automaticamente

// Exporta todos os componentes
export * from "./components";

// Exporta hooks
export * from "./hooks";

// Exporta libs
export * from "./lib";

// Exporta provider
export { ProviderTrianguloDigital } from "./provider";
`

fs.writeFileSync(srcIndexPath, srcIndexContent, 'utf8')

console.log('✅ Índices gerados com sucesso (componentes + src/index.ts)!')
