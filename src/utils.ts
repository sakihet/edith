import { generateTextCustom } from "./editor/editor"
import { Language } from "./types/language"
import { Note } from "./types/note"
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

export const generateNoteContent = (str: string) => {
  return {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": str
          }
        ]
      },
    ]
  }
}

export const transformForSearch = (notes: Note[]) => {
  return notes.map(({ id, content }) => ({
    id: id,
    content: generateTextCustom(content),
  }))
}

export const getFirstItems = <T>(arr: Array<T>, max: number): Array<T> => {
  return arr.slice(0, max)
}

export const initialContent = {
  "type": "doc",
  "content": [
    {
      "type": "paragraph"
    }
  ]
}

export const formatRelativeTime = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return rtf.format(-seconds, 'second');
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return rtf.format(-minutes, 'minute');
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return rtf.format(-hours, 'hour');
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return rtf.format(-days, 'day');
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return rtf.format(-weeks, 'week');
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return rtf.format(-months, 'month');
  }

  const years = Math.floor(days / 365);
  return rtf.format(-years, 'year');
};
