#!/usr/bin/env node
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

console.log('🚀 Iniciando setup do Triângulo Digital Components...')

async function run() {
  try {
    // Instalar a lib no projeto
    console.log('📦 Instalando triangulo-digital-components...')
    execSync('npm install triangulo-digital-components', {
      stdio: 'inherit',
    })

    // Descobrir se estamos rodando em TS (dev) ou JS (build)
    const tsPath = path.resolve(dirname, './check-tailwind.ts')
    const jsPath = path.resolve(dirname, './check-tailwind.js')

    let modulePath: string
    if (fs.existsSync(tsPath)) {
      // estamos no dev
      modulePath = tsPath
    } else {
      // estamos rodando buildado
      modulePath = jsPath
    }

    console.log('⚙️  Executando configuração inicial...')
    await import(pathToFileURL(modulePath).href)

    console.log('✅ Setup concluído com sucesso!')
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('❌ Erro durante o setup:', err.message)
    } else {
      console.error('❌ Erro durante o setup:', err)
    }
    process.exit(1)
  }
}

run()
