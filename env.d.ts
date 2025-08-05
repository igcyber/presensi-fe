/// <reference types="vite/client" />

declare global {
  interface ImportMeta {
    env: Record<string, any>
    glob: (pattern: string, options?: { eager?: boolean }) => Record<string, any>
    url: string
    [key: string]: any
  }
}

export {}
