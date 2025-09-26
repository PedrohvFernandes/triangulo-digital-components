import '../../fonts.css'
import '../../tailwind-entry.css/tailwind-entry.css'
import '../../styles.css'

type PropsProviderTrianguloDigital = {
  children: React.ReactNode
}

export const ProviderTrianguloDigital = ({
  children,
}: PropsProviderTrianguloDigital) => {
  return <>{children}</>
}
