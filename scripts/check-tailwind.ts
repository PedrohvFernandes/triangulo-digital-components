import { execSync } from 'child_process'

function checkTailwind(): boolean {
  try {
    require.resolve('tailwindcss')
    return true
  } catch {
    return false
  }
}

if (!checkTailwind()) {
  console.log('\n🚨 [triangulo-digital-components] TailwindCSS não encontrado!')
  console.log('👉 Instalando automaticamente TailwindCSS v4.1.13...\n')

  try {
    execSync(`npm install -D tailwindcss@^4.1.13`, { stdio: 'inherit' })
    console.log('\n✅ TailwindCSS v4.1.13 instalado com sucesso!\n')
  } catch (error) {
    console.error('\n❌ Erro ao instalar TailwindCSS:', error)
    console.log('👉 Instale manualmente com:')
    console.log('   npm install -D tailwindcss@^4.1.13\n')
  }
} else {
  console.log('\n✅ TailwindCSS já está instalado.')
}
console.log(
  '👉 Certifique-se de que está usando a versão v4.1.13 ou superior.\n',
)
