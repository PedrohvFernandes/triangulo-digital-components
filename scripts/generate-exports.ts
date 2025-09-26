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

// Gera index.ts nas pastas
mainFolders.forEach((mainFolder) => {
  const mainFolderPath = path.join(componentsRoot, mainFolder)
  const mainIndexPath = path.join(mainFolderPath, 'index.ts')

  let mainIndexContent = '// Arquivo gerado automaticamente\n\n'

  // 1️⃣ Arquivos diretos da pasta principal
  const mainFiles = fs
    .readdirSync(mainFolderPath)
    .filter(
      (f) =>
        (f.endsWith('.ts') || f.endsWith('.tsx')) &&
        !f.includes('.stories') &&
        !/^index\.(ts|tsx)$/.test(f),
    )

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

    const componentFiles = fs
      .readdirSync(folderPath)
      .filter(
        (f) =>
          (f.endsWith('.ts') || f.endsWith('.tsx')) &&
          !f.includes('.stories') &&
          !/^index\.(ts|tsx)$/.test(f),
      )

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

export * from './components'
export * from './hooks'
export * from './lib'
`
fs.writeFileSync(srcIndexPath, srcIndexContent, 'utf8')

// 3️⃣ Atualiza package.json com exports individuais
const pkgPath = path.resolve(dirname, '../package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

type ExportEntry = {
  import?: { types: string; default: string }
  require?: { types: string; default: string }
  default?: string
}

const baseExports: Record<string, ExportEntry> = {
  '.': {
    import: {
      types: './dist/index.d.ts',
      default: './dist/triangulo-digital-components.es.js',
    },
    require: {
      types: './dist/index.d.ts',
      default: './dist/triangulo-digital-components.umd.js',
    },
  },
  './styles.css': { default: './dist/styles.css' },
  './tailwind-entry.css': {
    default: './dist/tailwind-entry.css/tailwind-entry.css',
  },
  './fonts.css': { default: './dist/fonts.css' },
}

// Adiciona exports individuais para cada componente
mainFolders.forEach((mainFolder) => {
  const mainFolderPath = path.join(componentsRoot, mainFolder)

  // Arquivos diretos na pasta principal
  const files = fs
    .readdirSync(mainFolderPath)
    .filter(
      (f) =>
        (f.endsWith('.ts') || f.endsWith('.tsx')) &&
        !f.includes('.stories') &&
        !/^index\.(ts|tsx)$/.test(f),
    )
    .map((f) => f.replace(/\.(ts|tsx)$/, ''))

  files.forEach((file) => {
    const key = `./${file.toLowerCase()}`
    baseExports[key] = {
      import: {
        types: `./dist/components/${mainFolder}/${file}/index.d.ts`,
        default: `./dist/components/${mainFolder}/${file}/index.js`,
      },
      require: {
        types: `./dist/components/${mainFolder}/${file}/index.d.ts`,
        default: `./dist/components/${mainFolder}/${file}/index.js`,
      },
    }
  })

  // Subpastas
  const subFolders = fs
    .readdirSync(mainFolderPath)
    .filter((f) => fs.statSync(path.join(mainFolderPath, f)).isDirectory())

  subFolders.forEach((sub) => {
    const key = `./${sub.toLowerCase()}`
    baseExports[key] = {
      import: {
        types: `./dist/components/${mainFolder}/${sub}/index.d.ts`,
        default: `./dist/components/${mainFolder}/${sub}/index.js`,
      },
      require: {
        types: `./dist/components/${mainFolder}/${sub}/index.d.ts`,
        default: `./dist/components/${mainFolder}/${sub}/index.js`,
      },
    }
  })
})

// Salva package.json atualizado
pkg.exports = baseExports
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8')

console.log(
  '✅ Índices gerados e package.json atualizado com exports individuais!',
)
