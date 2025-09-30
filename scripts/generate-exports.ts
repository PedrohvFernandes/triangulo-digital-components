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

// 🔎 Função util para filtrar só os arquivos válidos
const isValidFile = (f: string) =>
  (f.endsWith('.ts') || f.endsWith('.tsx')) &&
  !f.includes('.stories') &&
  !f.includes('.spec') &&
  !f.includes('.test') &&
  !/^index\.(ts|tsx)$/.test(f)

mainFolders.forEach((mainFolder) => {
  const mainFolderPath = path.join(componentsRoot, mainFolder)
  const mainIndexPath = path.join(mainFolderPath, 'index.ts')

  let mainIndexContent = '// Arquivo gerado automaticamente\n\n'

  // 1️⃣ Arquivos diretos da pasta principal
  const mainFiles = fs.readdirSync(mainFolderPath).filter(isValidFile)

  mainFiles.forEach((file) => {
    const importPath = `./${file.replace(/\.(ts|tsx)$/, '')}`
    mainIndexContent += `export * from '${importPath}'\n`
  })

  // 2️⃣ Subpastas de componentes
  const componentFolders = fs
    .readdirSync(mainFolderPath)
    .filter((f) => fs.statSync(path.join(mainFolderPath, f)).isDirectory())

  componentFolders.forEach((folder) => {
    const folderPath = path.join(mainFolderPath, folder)

    // Lista arquivos .ts/.tsx dentro da subpasta
    const componentFiles = fs.readdirSync(folderPath).filter(isValidFile)

    if (componentFiles.length === 0) return

    // Gera index.ts na subpasta
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

    // Adiciona exportação no index da pasta principal
    mainIndexContent += `export * from './${folder}'\n`
  })

  // Cria index.ts na pasta principal
  fs.writeFileSync(mainIndexPath, mainIndexContent, 'utf8')

  // Adiciona exportação no index geral (components/index.ts)
  rootIndexContent += `export * from './${mainFolder}'\n`
})

// Cria index.ts geral em components
fs.writeFileSync(rootIndexPath, rootIndexContent, 'utf8')

// Cria src/index.ts com exports gerais
const srcIndexContent = `// Arquivo gerado automaticamente

// Exporta todos os componentes (incluindo provider dentro de triangulo-digital)
export * from './components'

// Exporta hooks
export * from './hooks'

// Exporta libs
export * from './lib'
`

fs.writeFileSync(srcIndexPath, srcIndexContent, 'utf8')

console.log('✅ Índices gerados com sucesso (componentes + src/index.ts)!')
