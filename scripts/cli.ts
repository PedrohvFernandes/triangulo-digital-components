#!/usr/bin/env node
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import path, { join } from 'path'
import { pathToFileURL } from 'url'

let installedInquirerTemp = false

// --------------------
// Função para garantir inquirer
// --------------------
function ensureInquirer() {
  try {
    require.resolve('inquirer')
  } catch {
    console.log('📦 Instalando inquirer temporariamente...')
    execSync('npm install -D inquirer', { stdio: 'inherit' })
    installedInquirerTemp = true
  }
}
ensureInquirer()

const inquirer = (await import('inquirer')).default

// --------------------
// Helpers para limpar arquivos
// --------------------
function cleanFile(filePath: string) {
  if (existsSync(filePath)) {
    try {
      unlinkSync(filePath)
      console.log(`🗑️  Arquivo ${filePath} removido.`)
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

// --------------------
// Detecta Vite config
// --------------------
function detectViteConfig() {
  const viteTs = join(process.cwd(), 'vite.config.ts')
  const viteJs = join(process.cwd(), 'vite.config.js')
  const isTs = existsSync(viteTs) || viteTs.endsWith('.ts')
  return { configPath: isTs ? viteTs : viteJs }
}

// --------------------
// Detecta se usa SWC no Vite
// --------------------
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

// --------------------
// Executa check-tailwind.ts ou .js
// --------------------
async function runCheckTailwind() {
  const dirname = path.resolve()
  const tsPath = path.resolve(dirname, './scripts/check-tailwind.ts')
  const jsPath = path.resolve(dirname, './dist/scripts/check-tailwind.js')

  let modulePath: string
  if (existsSync(tsPath)) modulePath = tsPath
  else if (existsSync(jsPath)) modulePath = jsPath
  else
    throw new Error('❌ check-tailwind.ts ou check-tailwind.js não encontrado!')

  console.log('⚙️  Executando check-tailwind...')
  await import(pathToFileURL(modulePath).href)
}

// --------------------
// Função principal do setup
// --------------------
async function runSetup() {
  console.log('🚀 Bem-vindo ao setup do Triângulo Digital Components!\n')

  // 1️⃣ Instalar a lib no projeto
  try {
    console.log('📦 Instalando triangulo-digital-components...')
    execSync('npm install triangulo-digital-components', { stdio: 'inherit' })
  } catch (err) {
    console.error('❌ Erro ao instalar triangulo-digital-components:', err)
    process.exit(1)
  }

  // 2️⃣ Rodar check-tailwind
  try {
    await runCheckTailwind()
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error('❌ Erro no setup do Tailwind:', err.message)
    else console.error('❌ Erro no setup do Tailwind:', err)
    process.exit(1)
  }

  // 3️⃣ Menu de framework
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Qual framework você está usando?',
      choices: ['Vite', 'Next.js'],
    },
  ])

  // 4️⃣ Perguntar se quer limpar configuração antiga
  let reset = false
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
    reset = resetVite
    if (reset) cleanViteConfig()
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
    reset = resetNext
    if (reset) cleanNextConfig()
  }

  // 5️⃣ Setup específico
  if (framework === 'Vite') {
    const { configPath } = detectViteConfig()
    const useSwc = detectSwc()

    console.log('📦 Instalando dependências para Vite + TailwindCSS...')
    const viteDeps = ['@tailwindcss/vite']
    viteDeps.push(useSwc ? '@vitejs/plugin-react-swc' : '@vitejs/plugin-react')
    try {
      execSync(`npm install -D ${viteDeps.join(' ')}`, { stdio: 'inherit' })
    } catch (err) {
      console.error('❌ Erro ao instalar dependências do Vite:', err)
    }

    // Criar ou atualizar vite.config
    let configContent = ''
    if (!existsSync(configPath)) {
      const reactPluginImport = useSwc ? 'plugin-react-swc' : 'plugin-react'
      configContent = `import { defineConfig } from 'vite';
import react from '@vitejs/${reactPluginImport}';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`
      writeFileSync(configPath, configContent)
      console.log(`✅ Arquivo ${configPath} criado com plugin TailwindCSS!`)
    } else {
      configContent = readFileSync(configPath, 'utf-8')
      if (!configContent.includes('@tailwindcss/vite')) {
        configContent =
          `import tailwindcss from '@tailwindcss/vite';\n` + configContent
      }

      const pluginsMatch = configContent.match(/plugins:\s*\[([\s\S]*?)\]/)
      if (pluginsMatch && !pluginsMatch[1].includes('tailwindcss()')) {
        const newPlugins = pluginsMatch[1].trim()
        configContent = configContent.replace(
          pluginsMatch[0],
          `plugins: [${newPlugins}, tailwindcss()]`,
        )
        writeFileSync(configPath, configContent)
        console.log(`✅ Plugin TailwindCSS adicionado em ${configPath}`)
      } else if (!pluginsMatch) {
        configContent += '\nplugins: [tailwindcss()],\n'
        writeFileSync(configPath, configContent)
        console.log(`✅ Plugin TailwindCSS adicionado em ${configPath}`)
      } else {
        console.log('⚠️ Plugin TailwindCSS já existe no vite.config')
      }
    }
  } else {
    // Next.js
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

  // 6️⃣ Remover inquirer temporário
  if (installedInquirerTemp) {
    console.log('🗑️ Removendo inquirer temporário...')
    try {
      execSync('npm uninstall inquirer', { stdio: 'inherit' })
      console.log('✅ inquirer removido com sucesso!')
    } catch (err) {
      console.error('❌ Erro ao remover inquirer:', err)
    }
  }
}

// --------------------
// Executa
// --------------------
runSetup().catch((err) => {
  console.error('❌ Erro no setup:', err)
  process.exit(1)
})
