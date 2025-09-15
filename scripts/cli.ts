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
// Helpers para limpeza
function cleanFile(path: string) {
  if (existsSync(path)) {
    try {
      unlinkSync(path)
      console.log(`🗑️  Arquivo ${path} removido.`)
    } catch (err) {
      console.error(`❌ Erro ao remover ${path}:`, err)
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
// Detecta se o projeto usa React SWC
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
// Detecta se é projeto TypeScript
function isTypeScriptProject() {
  return existsSync(join(process.cwd(), 'tsconfig.json'))
}

// Função para criar/atualizar vite.config
function setupViteConfig() {
  const useSwc = detectSwc()
  const isTs = isTypeScriptProject()
  const configPath = isTs
    ? join(process.cwd(), 'vite.config.ts')
    : join(process.cwd(), 'vite.config.js')

  const reactPluginImport = useSwc ? 'plugin-react-swc' : 'plugin-react'

  if (!existsSync(configPath)) {
    const content = `import { defineConfig } from 'vite';
import react from '@vitejs/${reactPluginImport}';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`
    writeFileSync(configPath, content)
    console.log(`✅ Arquivo ${configPath} criado com plugin TailwindCSS!`)
    return
  }

  // Atualizar config existente
  let content = readFileSync(configPath, 'utf-8')
  if (!content.includes('@tailwindcss/vite')) {
    content = `import tailwindcss from '@tailwindcss/vite';\n` + content
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

// Função principal do setup
async function runSetup() {
  console.log('🚀 Bem-vindo ao setup do Triângulo Digital Components!\n')

  // Instalar a lib no projeto
  console.log('📦 Instalando triangulo-digital-components...')
  execSync('npm install triangulo-digital-components', { stdio: 'inherit' })

  // Descobrir se estamos rodando em TS (dev) ou JS (build) para check-tailwind
  const tsPath = resolve(dirname, './check-tailwind.ts')
  const jsPath = resolve(dirname, './check-tailwind.js')
  const modulePath = existsSync(tsPath) ? tsPath : jsPath

  console.log('⚙️ Executando configuração inicial...')
  await import(pathToFileURL(modulePath).href)

  // Perguntar framework
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Qual framework você está usando?',
      choices: ['Vite', 'Next.js'],
    },
  ])

  // Perguntar se quer limpar setup antigo
  if (framework === 'Vite') {
    const { resetVite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'resetVite',
        message:
          'Deseja limpar configurações antigas do Vite antes de criar novas?',
        default: true,
      },
    ])
    if (resetVite) cleanViteConfig()
  } else {
    const { resetNext } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'resetNext',
        message:
          'Deseja limpar configurações antigas do Next antes de criar novas?',
        default: true,
      },
    ])
    if (resetNext) cleanNextConfig()
  }

  // Setup específico
  if (framework === 'Vite') {
    console.log('📦 Instalando dependências para Vite + TailwindCSS...')
    const viteDeps = ['@tailwindcss/vite']
    viteDeps.push(
      detectSwc() ? '@vitejs/plugin-react-swc' : '@vitejs/plugin-react',
    )
    try {
      execSync(`npm install -D ${viteDeps.join(' ')}`, { stdio: 'inherit' })
    } catch (err) {
      console.error('❌ Erro ao instalar dependências do Vite:', err)
    }
    setupViteConfig()
  } else {
    console.log('📦 Instalando dependências para Next.js + TailwindCSS...')
    try {
      execSync('npm install -D @tailwindcss/postcss', { stdio: 'inherit' })
    } catch (err) {
      console.error('❌ Erro ao instalar dependências do Next.js:', err)
    }

    const postcssPath = join(process.cwd(), 'postcss.config.js')
    if (!existsSync(postcssPath)) {
      const postcssContent = `module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
      // adicione aqui outros plugins necessários em formato de objeto
  },
};
`
      writeFileSync(postcssPath, postcssContent)
      console.log(`✅ Arquivo ${postcssPath} criado com plugin TailwindCSS!`)
    } else {
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
  }

  console.log('\n🎉 Setup concluído!')

  // Desinstala inquirer ao final
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
    )
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    if (!deps.inquirer) {
      execSync('npm uninstall inquirer', { stdio: 'inherit' })
      console.log('🗑️ inquirer removido após o setup!')
    } else {
      console.log('ℹ️ inquirer detectado no projeto. Não será removido.')
    }
  } catch (err) {
    console.error('❌ Erro ao verificar/remover inquirer:', err)
  }
}

// Executa
runSetup().catch((err) => {
  console.error('❌ Erro no setup:', err)
  process.exit(1)
})
