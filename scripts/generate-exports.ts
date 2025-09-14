import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

const componentsDir = path.resolve(dirname, '../src/components')
const indexPath = path.resolve(dirname, '../src/index.ts')

// Lista todas as pastas de componentes
const componentFolders = fs
  .readdirSync(componentsDir)
  .filter((f) => fs.statSync(path.join(componentsDir, f)).isDirectory())

let rootIndexContent = '// Este arquivo é gerado automaticamente\n\n'

componentFolders.forEach((folder) => {
  const folderPath = path.join(componentsDir, folder)

  // Pega todos os arquivos TS/TSX que não sejam stories ou index
  const componentFiles = fs.readdirSync(folderPath).filter(
    (f) =>
      (f.endsWith('.ts') || f.endsWith('.tsx')) &&
      !f.includes('.stories') &&
      !/^index\.(ts|tsx)$/.test(f), // ignora index.ts / index.tsx
  )

  if (componentFiles.length === 0) return

  // Cria o index.ts dentro da pasta do componente
  let componentIndexContent = ''
  componentFiles.forEach((file) => {
    const importPath = `./${file.replace(/\.(ts|tsx)$/, '')}`
    componentIndexContent += `export * from '${importPath}'\n`
  })
  fs.writeFileSync(
    path.join(folderPath, 'index.ts'),
    componentIndexContent,
    'utf8',
  )

  // Adiciona exportação no índice raiz
  rootIndexContent += `export * from '@/components/${folder}'\n`
})

// Escreve o índice raiz
fs.writeFileSync(indexPath, rootIndexContent, 'utf8')

console.log('✅ Índices gerados automaticamente (raiz + componentes)')
