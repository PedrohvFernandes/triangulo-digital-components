#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import path, { join, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

// Helpers
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

function cleanFile(filePath: string) {
  if (existsSync(filePath)) {
    try {
      unlinkSync(filePath)
      console.log(`🗑️ Arquivo ${filePath} removido.`)
    } catch (err) {
      console.error(`❌ Erro ao remover ${filePath}:`, err)
    }
  }
}

function cleanViteConfig() {
  cleanFile(join(process.cwd(), 'vite.config.ts'))
  cleanFile(join(process.cwd(), 'vite.config.js'))
}

function cleanNextConfig() {
  const possibleFiles = [
    'postcss.config.js',
    'postcss.config.cjs',
    'postcss.config.mjs',
    'postcss.config.ts',
  ]
  possibleFiles.forEach((file) => cleanFile(join(process.cwd(), file)))
}

function detectSwc() {
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
    )
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    return !!deps['@vitejs/plugin-react-swc']
  } catch {
    return false
  }
}

function isTypeScriptProject() {
  return existsSync(join(process.cwd(), 'tsconfig.json'))
}

function isPackageInstalled(pkgName: string) {
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
    )
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    if (deps[pkgName]) return true
    return existsSync(join(process.cwd(), 'node_modules', pkgName))
  } catch {
    return false
  }
}

// ⚙️ Setup Vite
function setupViteConfig() {
  const useSwc = detectSwc()
  const isTs = isTypeScriptProject()
  const configPath = isTs
    ? join(process.cwd(), 'vite.config.ts')
    : join(process.cwd(), 'vite.config.js')

  const reactPluginImport = useSwc ? 'plugin-react-swc' : 'plugin-react'

  if (!existsSync(configPath)) {
    const content = `
import { defineConfig } from 'vite'
import react from '@vitejs/${reactPluginImport}'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
`
    writeFileSync(configPath, content)
    console.log(`✅ Arquivo ${configPath} criado com plugin TailwindCSS!`)
    return
  }

  let content = readFileSync(configPath, 'utf-8')
  if (!content.includes('@tailwindcss/vite')) {
    content = `import tailwindcss from '@tailwindcss/vite';\n${content}`
  }

  const pluginsMatch = content.match(/plugins:\s*\[([\s\S]*?)\]/)
  if (pluginsMatch && !pluginsMatch[1].includes('tailwindcss()')) {
    const newPlugins = pluginsMatch[1].trim()
    content = content.replace(
      pluginsMatch[0],
      `plugins: [${newPlugins}, tailwindcss()]`,
    )
    writeFileSync(configPath, content)
    console.log(`✅ Plugin TailwindCSS adicionado em ${configPath}`)
  } else if (!pluginsMatch) {
    content += '\nplugins: [tailwindcss()],\n'
    writeFileSync(configPath, content)
    console.log(`✅ Plugin TailwindCSS adicionado em ${configPath}`)
  } else {
    console.log('⚠️ Plugin TailwindCSS já existe no vite.config')
  }
}

// ⚙️ Setup PostCSS (Next.js)
function createOrUpdatePostcss() {
  const extensions = ['js', 'cjs', 'mjs', 'ts']
  let postcssPath: string | undefined

  for (const ext of extensions) {
    const file = join(process.cwd(), `postcss.config.${ext}`)
    if (existsSync(file)) {
      postcssPath = file
      break
    }
  }

  if (!postcssPath) {
    postcssPath = join(process.cwd(), 'postcss.config.js')
    const postcssContent = `
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    // outros plugins...
  },
}
`
    writeFileSync(postcssPath, postcssContent)
    console.log(`✅ Arquivo ${postcssPath} criado com plugin TailwindCSS!`)
    return
  }

  let postcssContent = readFileSync(postcssPath, 'utf-8')
  if (!postcssContent.includes('@tailwindcss/postcss')) {
    postcssContent = postcssContent.replace(
      /(plugins:\s*{)/,
      "$1\n    '@tailwindcss/postcss': {},",
    )
    writeFileSync(postcssPath, postcssContent)
    console.log(`✅ Plugin TailwindCSS adicionado em ${postcssPath}`)
  } else {
    console.log('⚠️ Plugin TailwindCSS já existe no postcss.config')
  }
}

// 🚀 Função principal automática
async function runSetup() {
  console.log('🚀 Iniciando setup do Triângulo Digital Components...\n')

  // Instalar a lib principal
  console.log('📦 Instalando triangulo-digital-components...')
  execSync('npm install triangulo-digital-components', { stdio: 'inherit' })

  // Executar verificação inicial
  const tsPath = resolve(dirname, './check-tailwind.ts')
  const jsPath = resolve(dirname, './check-tailwind.js')
  const modulePath = existsSync(tsPath) ? tsPath : jsPath
  console.log('⚙️ Executando configuração inicial...')
  await import(pathToFileURL(modulePath).href)

  // Detectar framework confiável
  let framework: 'Vite' | 'Next.js' = 'Next.js' // padrão

  const viteConfigExists =
    existsSync(join(process.cwd(), 'vite.config.js')) ||
    existsSync(join(process.cwd(), 'vite.config.ts'))

  const nextConfigExists =
    existsSync(join(process.cwd(), 'next.config.js')) ||
    existsSync(join(process.cwd(), 'next.config.mjs'))

  if (viteConfigExists) {
    framework = 'Vite'
  } else if (nextConfigExists) {
    framework = 'Next.js'
  }

  console.log(`📌 Framework detectado: ${framework}`)

  // Limpeza
  if (framework === 'Vite') cleanViteConfig()
  else cleanNextConfig()

  // Instalar dependências e configurar
  if (framework === 'Vite') {
    const viteDeps = []
    if (!isPackageInstalled('@tailwindcss/vite'))
      viteDeps.push('@tailwindcss/vite')
    if (detectSwc() && !isPackageInstalled('@vitejs/plugin-react-swc'))
      viteDeps.push('@vitejs/plugin-react-swc')
    else if (!detectSwc() && !isPackageInstalled('@vitejs/plugin-react'))
      viteDeps.push('@vitejs/plugin-react')

    if (viteDeps.length > 0) {
      console.log(`📦 Instalando: ${viteDeps.join(', ')}`)
      execSync(`npm install -D ${viteDeps.join(' ')}`, { stdio: 'inherit' })
    }

    setupViteConfig()
  } else {
    if (!isPackageInstalled('@tailwindcss/postcss')) {
      execSync('npm install -D @tailwindcss/postcss', { stdio: 'inherit' })
    }
    createOrUpdatePostcss()
  }

  console.log('\n🎉 Setup concluído!')
}

runSetup().catch((err) => {
  console.error('❌ Erro no setup:', err)
  process.exit(1)
})
