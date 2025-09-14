import { execSync } from 'child_process'

function checkPackage(pkg: string): boolean {
  try {
    require.resolve(pkg)
    return true
  } catch {
    return false
  }
}

const requiredPackages = ['tailwindcss']
const missing: string[] = []

for (const pkg of requiredPackages) {
  if (!checkPackage(pkg)) {
    missing.push(pkg)
  }
}

if (missing.length > 0) {
  console.log('\n🚨 [sua-lib] Faltam dependências do TailwindCSS!')
  console.log('👉 Instalando automaticamente...\n')

  try {
    execSync(`npm install -D ${missing.join(' ')}`, { stdio: 'inherit' })
    console.log('\n✅ TailwindCSS configurado com sucesso!\n')
  } catch (error) {
    console.error('\n❌ Erro ao instalar dependências:', error)
    console.log('👉 Instale manualmente com:')
    console.log(`   npm install -D ${missing.join(' ')}\n`)
  }
}
