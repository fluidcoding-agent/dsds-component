// React Component Fast-Refresh 를 위해 문자열 상수 배열 및 파생 타입을 따로 분리합니다.

export const buttonVariantsConfig = {
  size: {
    small: "",
    medium: "",
    large: "",
  },
  variant: {
    primary: "",
    secondary: "",
    warning: "",
    danger: "",
    ghost: "",
    ghostLink: "",
  },
}

export const boxVariantsConfig = {
  variant: {
    default: "",
    ghost: "",
  },
  size: {
    large: "",
    medium: "",
    small: "",
  },
}

export const boxMessageVariantsConfig = {
  messageType: {
    default: "",
    emphasis: "",
    danger: "",
  },
}

export const tabsVariantsConfig = {
  variant: {
    default: "",
    button: "",
  },
  size: {
    small: "",
    medium: "",
  },
}

export const iconOptions = ["before", "after"] as const
export type IconOptionType = (typeof iconOptions)[number]
export type ButtonVariantsConfig = typeof buttonVariantsConfig
export type TextboxVariantsConfig = typeof boxVariantsConfig
export type BasicboxMessageVariantsConfig = typeof boxMessageVariantsConfig
export type TabsVariantsConfig = typeof tabsVariantsConfig

export const showOnlyPlaces = [
  "top",
  "top-start",
  "top-end",
  "right",
  "right-start",
  "right-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "auto-start",
  "auto",
  "auto-end",
] as const

export type TooltipPlace = (typeof showOnlyPlaces)[number]

export const sidePlaces = ["top", "right", "bottom", "left", "auto"] as const
export const alignPlaces = ["start", "center", "end", "auto"] as const

export type TooltipSide = (typeof sidePlaces)[number]
export type TooltipAlign = (typeof alignPlaces)[number]
