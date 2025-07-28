import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toKebabCase(str: string) {
  return str
    .replace(/\(([^)]+)\)/g, "-$1") // (1st) -> -1st
    .replace(/,/g, "-") // commas to dash
    .replace(/[\s_]+/g, "-") // spaces/underscores to dash
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // camelCase to kebab
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-|-$/g, "") // trim leading/trailing dash
    .toLowerCase()
}
