#!/usr/bin/env node

import inquirer from 'inquirer'
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import path, { join, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

// Helpers
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// 🧹 Funções de limpeza
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
  cleanFile(join(process.cwd(), 'postcss.config.js'))
}

// 📦 Detectores
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

// ⚙️ Funções de setup
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

  // Atualizar config existente
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

function createOrUpdatePostcss() {
  const postcssPath = join(process.cwd(), 'postcss.config.js')

  if (!existsSync(postcssPath)) {
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
    console.log('⚠️ Plugin TailwindCSS já existe no postcss.config.js')
  }
}

// 🚀 Função principal
async function runSetup() {
  console.log('🚀 Bem-vindo ao setup do Triângulo Digital Components!\n')

  // Salvar se o inquirer já existia
  const hadInquirerBefore = isPackageInstalled('inquirer')

  // Instalar a lib principal
  console.log('📦 Instalando triangulo-digital-components...')
  execSync('npm install triangulo-digital-components', { stdio: 'inherit' })

  // Executar verificação inicial
  const tsPath = resolve(dirname, './check-tailwind.ts')
  const jsPath = resolve(dirname, './check-tailwind.js')
  const modulePath = existsSync(tsPath) ? tsPath : jsPath
  console.log('⚙️ Executando configuração inicial...')
  await import(pathToFileURL(modulePath).href)

  // Perguntas
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Qual framework você está usando?',
      choices: ['Vite', 'Next.js'],
    },
    {
      type: 'confirm',
      name: 'reset',
      message: (answers) =>
        answers.framework === 'Vite'
          ? 'Deseja limpar configurações antigas do Vite antes de criar novas?'
          : 'Deseja limpar configurações antigas do Next antes de criar novas?',
      default: true,
    },
  ])

  // Limpeza
  if (answers.reset) {
    if (answers.framework === 'Vite') cleanViteConfig()
    else cleanNextConfig()
  }

  // Configuração por framework
  if (answers.framework === 'Vite') {
    console.log('📦 Verificando dependências para Vite + TailwindCSS...')

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
    } else {
      console.log('✅ Todas as dependências já estão instaladas!')
    }

    if (!answers.reset) {
      const { addTailwind } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addTailwind',
          message:
            'Deseja apenas adicionar o plugin TailwindCSS no vite.config existente?',
          default: true,
        },
      ])
      if (addTailwind) setupViteConfig()
    } else {
      setupViteConfig()
    }
  } else {
    console.log('📦 Verificando dependências para Next.js + TailwindCSS...')
    if (!isPackageInstalled('@tailwindcss/postcss')) {
      execSync('npm install -D @tailwindcss/postcss', { stdio: 'inherit' })
    } else {
      console.log('✅ @tailwindcss/postcss já está instalado!')
    }

    if (answers.reset) {
      cleanNextConfig()
      createOrUpdatePostcss()
    } else if (existsSync(join(process.cwd(), 'postcss.config.js'))) {
      const { addTailwind } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addTailwind',
          message:
            'Deseja apenas adicionar o plugin TailwindCSS ao postcss.config existente?',
          default: true,
        },
      ])
      if (addTailwind) createOrUpdatePostcss()
    } else {
      console.log(
        '⚠️ Nenhum postcss.config.js encontrado. Nenhuma modificação feita.',
      )
    }
  }

  console.log('\n🎉 Setup concluído!')

  // 🧹 Remover inquirer se foi instalado apenas pelo setup
  try {
    const stillHasInquirer = isPackageInstalled('inquirer')
    if (stillHasInquirer && !hadInquirerBefore) {
      execSync('npm uninstall inquirer', { stdio: 'inherit' })
      console.log('🗑️ inquirer removido após o setup!')
    } else if (hadInquirerBefore) {
      console.log('ℹ️ inquirer já existia no projeto, então não será removido.')
    }
  } catch (err) {
    console.error('❌ Erro ao verificar/remover inquirer:', err)
  }
}

// 🏁 Executa
runSetup().catch((err) => {
  console.error('❌ Erro no setup:', err)
  process.exit(1)
})
