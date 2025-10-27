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

// 🧩 Funções utilitárias
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

// 📄 Detecta a extensão ideal (.ts, .mjs, .js)
function getDefaultExtension() {
  let ext = 'js'
  const isTs = isTypeScriptProject()
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
    )
    if (pkg.type === 'module') ext = 'mjs'
    if (isTs) ext = 'ts'
  } catch {
    if (isTs) ext = 'ts'
  }
  return ext
}

// 🧹 Limpezas seguras
function cleanViteConfig() {
  const files = [
    'vite.config.js',
    'vite.config.cjs',
    'vite.config.mjs',
    'vite.config.ts',
  ]
  const hasValid = files.some((f) => existsSync(join(process.cwd(), f)))
  if (!hasValid) {
    files.forEach((file) => cleanFile(join(process.cwd(), file)))
  } else {
    console.log('🧩 Mantendo configuração existente do Vite.')
  }
}

function cleanNextConfig() {
  const files = [
    'postcss.config.js',
    'postcss.config.cjs',
    'postcss.config.mjs',
    'postcss.config.ts',
  ]
  const hasValid = files.some((f) => existsSync(join(process.cwd(), f)))
  if (!hasValid) {
    files.forEach((file) => cleanFile(join(process.cwd(), file)))
  } else {
    console.log('🧩 Mantendo configuração existente do PostCSS.')
  }
}

// ⚙️ Setup Vite
function setupViteConfig() {
  const useSwc = detectSwc()
  const ext = getDefaultExtension()
  const configPath = join(process.cwd(), `vite.config.${ext}`)
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
  let updated = false

  if (!content.includes('@tailwindcss/vite')) {
    content = `import tailwindcss from '@tailwindcss/vite';\n${content}`
    updated = true
  }

  const pluginsMatch = content.match(/plugins:\s*\[([\s\S]*?)\]/)
  if (pluginsMatch && !pluginsMatch[1].includes('tailwindcss()')) {
    const newPlugins = pluginsMatch[1].trim()
    content = content.replace(
      pluginsMatch[0],
      `plugins: [${newPlugins}, tailwindcss()]`,
    )
    updated = true
  } else if (!pluginsMatch) {
    content += `\nexport default defineConfig({ plugins: [tailwindcss()] })\n`
    updated = true
  }

  if (updated) {
    writeFileSync(configPath, content)
    console.log(
      `✅ Plugin TailwindCSS adicionado ou atualizado em ${configPath}`,
    )
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
    const ext = getDefaultExtension()
    postcssPath = join(process.cwd(), `postcss.config.${ext}`)
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

// 🚀 Função principal
async function runSetup() {
  console.log('🚀 Iniciando setup do Triângulo Digital Components...\n')

  console.log('📦 Instalando triangulo-digital-components...')
  execSync('npm install triangulo-digital-components', { stdio: 'inherit' })

  const tsPath = resolve(dirname, './check-tailwind.ts')
  const jsPath = resolve(dirname, './check-tailwind.js')
  const modulePath = existsSync(tsPath) ? tsPath : jsPath
  console.log('⚙️ Executando configuração inicial...')
  await import(pathToFileURL(modulePath).href)

  const pkg = JSON.parse(
    readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
  )
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }

  const framework =
    deps.next || deps.next ? 'Next.js' : deps.vite ? 'Vite' : 'Vite'

  console.log(`📌 Framework detectado: ${framework}`)

  if (framework === 'Vite') cleanViteConfig()
  else cleanNextConfig()

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

  console.log('\n🎉 Setup concluído com sucesso!')
}

runSetup().catch((err) => {
  console.error('❌ Erro no setup:', err)
  process.exit(1)
})
