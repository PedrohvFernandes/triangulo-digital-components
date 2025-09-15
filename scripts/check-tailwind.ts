import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const MIN_VERSION = '4.1.13'

// Nao era necessário rodar esse script, pois na versão 7 do npm foi adicionado o conceito de peer dependencies automaticamente, que ele ja instala as dependencias peer automaticamente. Mas por segurança, deixei o script aqui.

/**
 * Verifica se o TailwindCSS está instalado e se a versão é igual ou superior à mínima requerida.
 * Se não estiver instalado ou a versão for inferior, instala a versão mínima requerida.
 */

/**
 * Obtém a versão do TailwindCSS:
 * - Primeiro tenta pelo node_modules
 * - Depois pelo package.json do projeto
 * - Depois pelo package-lock.json
 */
function getTailwindVersion(): string | null {
  try {
    // tenta pelo node_modules
    const pkgPath = require.resolve('tailwindcss/package.json', {
      paths: [process.cwd()],
    })
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    return pkg.version
  } catch {
    // tenta pelo package.json do projeto
    const projectPkgPath = join(process.cwd(), 'package.json')
    if (existsSync(projectPkgPath)) {
      const projectPkg = JSON.parse(readFileSync(projectPkgPath, 'utf-8'))
      const version =
        projectPkg.dependencies?.tailwindcss ||
        projectPkg.devDependencies?.tailwindcss
      if (version) {
        return version.replace(/^[^\d]*/, '')
      }
    }

    // tenta pelo package-lock.json
    const lockPath = join(process.cwd(), 'package-lock.json')
    if (existsSync(lockPath)) {
      try {
        const lockFile = JSON.parse(readFileSync(lockPath, 'utf-8'))
        const tailwindEntry =
          lockFile.dependencies?.tailwindcss ??
          lockFile.packages?.['node_modules/tailwindcss']
        if (tailwindEntry?.version) {
          return tailwindEntry.version.replace(/^[^\d]*/, '')
        }
      } catch {
        return null
      }
    }

    return null
  }
}

/**
 * Verifica se a versão instalada atende à mínima
 */
function isVersionSatisfied(
  installed: string | null,
  minimum: string,
): boolean {
  if (!installed) return false
  const [iMajor, iMinor, iPatch] = installed.split('.').map(Number)
  const [mMajor, mMinor, mPatch] = minimum.split('.').map(Number)
  if (iMajor > mMajor) return true
  if (iMajor < mMajor) return false
  if (iMinor > mMinor) return true
  if (iMinor < mMinor) return false
  return iPatch >= mPatch
}

const installedVersion = getTailwindVersion()

if (!isVersionSatisfied(installedVersion, MIN_VERSION)) {
  console.log(
    '\n🚨 [triangulo-digital-components] TailwindCSS não encontrado ou versão desatualizada!',
  )
  console.log(`👉 Instalando automaticamente TailwindCSS v${MIN_VERSION}...\n`)

  try {
    execSync(`npm install tailwindcss@^${MIN_VERSION}`, { stdio: 'inherit' })
    console.log(`\n✅ TailwindCSS v${MIN_VERSION} instalado com sucesso!\n`)
  } catch (error) {
    console.error('\n❌ Erro ao instalar TailwindCSS:', error)
    console.log('👉 Instale manualmente com:')
    console.log(`   npm install tailwindcss@^${MIN_VERSION}\n`)
  }
} else {
  console.log(
    `\n✅ TailwindCSS já está instalado na versão ${installedVersion}.\n`,
  )
}

console.log(
  `👉 Certifique-se de que está usando a versão v${MIN_VERSION} ou superior.\n`,
)
