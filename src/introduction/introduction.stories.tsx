import type { Meta } from '@storybook/react'

import { Welcome } from './welcome'
import { GetStarted } from './get-started'
import { HowToUse } from './how-to-use'
import { Accessibility } from './accessibility'

const meta: Meta = {
  title: '📝 Introdução',
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
}

export default meta

export const WelcomePage = () => <Welcome />
WelcomePage.storyName = '1. Bem-vindo(a)'

export const GetStartedPage = () => <GetStarted />
GetStartedPage.storyName = '2. Como começar'

export const HowToUsePage = () => <HowToUse />
HowToUsePage.storyName = '3. Como usar'

export const AccessibilityPage = () => <Accessibility />
AccessibilityPage.storyName = '4. Acessibilidade'
