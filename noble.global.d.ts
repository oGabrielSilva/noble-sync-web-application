import type { ptBR } from '@Noble/resources/i18n/pt-br'
import type { dark } from '@Noble/resources/theme/dark'

export declare global {
  interface OnlyChildren {
    children: React.ReactElement
  }

  type Colors = typeof dark

  type I18N = typeof ptBR

  interface KeyStringValueString {
    [key: string]: [value: string]
  }
}
