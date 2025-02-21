export const Language = {
  Unknown: 0,
  English: 1,
  Japanese: 2,
  Chinese: 3,
} as const

export type Language = (typeof Language)[keyof typeof Language]
