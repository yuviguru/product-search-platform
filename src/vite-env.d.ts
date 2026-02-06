/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OLLAMA_URL?: string
  readonly VITE_GROQ_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
