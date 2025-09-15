#!/usr/bin/env node
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

async function run() {
  console.log('🚀 Bem-vindo ao setup do Triângulo Digital Components!\n')

  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Qual framework você está usando?',
      choices: ['Vite', 'Next.js'],
    },
  ])

  if (framework === 'Vite') {
    // Detecta TS ou JS
    const vitePathTs = join(process.cwd(), 'vite.config.ts')
    const vitePathJs = join(process.cwd(), 'vite.config.js')
    const isTs = existsSync(vitePathTs) || vitePathTs.endsWith('.ts')
    const configPath = isTs ? vitePathTs : vitePathJs

    // Detecta se o projeto já tem React SWC (checa package.json)
    let useSwc = false
    try {
      const pkg = JSON.parse(
        readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
      )
      const deps = { ...pkg.dependencies, ...pkg.devDependencies }
      if (deps['@vitejs/plugin-react-swc']) useSwc = true
    } catch {
      // fallback: assume react normal
    }

    // Instala dependências Vite + Tailwind
    console.log('📦 Instalando dependências para Vite + TailwindCSS...')
    const viteDeps = ['@tailwindcss/vite']
    if (useSwc) viteDeps.push('@vitejs/plugin-react-swc')
    else viteDeps.push('@vitejs/plugin-react')

    try {
      execSync(`npm install -D ${viteDeps.join(' ')}`, { stdio: 'inherit' })
    } catch (err) {
      console.error('❌ Erro ao instalar dependências do Vite:', err)
    }

    // Criar ou atualizar vite.config
    let configContent = ''
    if (!existsSync(configPath)) {
      // criar novo arquivo
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
      // atualizar arquivo existente
      configContent = readFileSync(configPath, 'utf-8')

      // adiciona import do tailwindcss se não existir
      if (!configContent.includes('@tailwindcss/vite')) {
        configContent =
          `import tailwindcss from '@tailwindcss/vite';\n` + configContent
      }

      // adiciona tailwindcss() ao array de plugins se não existir
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
        // fallback simples
        configContent += '\nplugins: [tailwindcss()],\n'
        writeFileSync(configPath, configContent)
        console.log(`✅ Plugin TailwindCSS adicionado em ${configPath}`)
      } else {
        console.log('⚠️ Plugin TailwindCSS já existe no vite.config')
      }
    }
  } else if (framework === 'Next.js') {
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
}

run().catch((err) => {
  console.error('❌ Erro no setup:', err)
  process.exit(1)
})
