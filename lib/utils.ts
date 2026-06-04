import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const TAG_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
] as const

export function getTagColorClasses(tag: string): string {
  return TAG_COLORS[hashString(tag) % TAG_COLORS.length]
}
