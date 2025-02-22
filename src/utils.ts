import { Language } from "./types/language"
import { Theme } from "./types/theme"

export const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.firstElementChild?.classList.add('dark')
  } else {
    document.firstElementChild?.classList.remove('dark')
  }
}

export const getTheme = (): Theme => {
  const key = 'theme'
  const item = localStorage.getItem(key)
  if (item) {
    return item as Theme || 'light'
  } else {
    return window.matchMedia('(preferes-color-scheme: dark)').matches ? 'dark' : 'light'
  }
}

export const setTheme = (theme: Theme) => {
  localStorage.setItem('theme', theme)
}

interface Navigator {
  userAgent: string,
  userAgentData: any
}

declare var navigator: Navigator

export const getPlatform = (): string => {
  if (navigator.userAgentData) {
    return navigator.userAgentData.platform
  } else {
    const ua = navigator.userAgent
    if (ua.includes('Macintosh')) {
      return 'macOS'
    } else {
      return 'theOtherOS'
    }
  }
}

type Brand = {
  'brand': string
  'version': string
}

export const getBrowser = (): string => {
  if (navigator.userAgentData) {
    const brands: Brand[] = navigator.userAgentData.brands
    if (brands.find((b: Brand) => b.brand.includes('Chrome'))) {
      return 'Chrome'
    } else {
      return 'theOtherBrowser'
    }
  } else {
    const ua = navigator.userAgent
    if (ua.includes('Chrome')) {
      return 'Chrome'
    } else if (ua.includes('Safari')) {
      return 'Safari'
    } else if (ua.includes('Firefox')) {
      return 'Firefox'
    } else {
      return 'theOtherBrowser'
    }
  }
}

export const detectLanguage = (text: string): Language => {
  if (/^[A-Za-z\s\d.,!?'"()-]+$/.test(text)) {
    return Language.English
  } else if (/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(text)) {
    if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text)) {
      return Language.Japanese
    } else {
      return Language.Chinese
    }
  } else {
    return Language.Unknown
  }
}
