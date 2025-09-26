import 'triangulo-digital-components/fonts.css'
import 'triangulo-digital-components/tailwind-entry.css'
import 'triangulo-digital-components/styles.css'

type PropsProviderTrianguloDigital = {
  children: React.ReactNode
}

export const ProviderTrianguloDigital = ({
  children,
}: PropsProviderTrianguloDigital) => {
  return <>{children}</>
}
