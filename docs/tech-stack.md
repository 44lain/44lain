# tech-stack.md — Stack Tecnológica

## Visão Geral

| Categoria | Tecnologia | Versão alvo |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Linguagem | TypeScript | 5.x (strict) |
| Estilização | Tailwind CSS | 3.x |
| Estado global | Zustand | 4.x |
| Animações | CSS nativo + Framer Motion (opcional) | — |
| Wallpapers | Unicorn.studio | embed |
| Componentes UI | 21.st.dev | — |
| Player | Spotify Embed API | — |
| Deploy | Vercel | — |

---

## Core Framework: Next.js 14 (App Router)

**Justificativa:**
- App Router permite `generateStaticParams` e SSG nativo para conteúdo estático (projetos, blog)
- `next/font` para carregamento otimizado de Tahoma, Electrolize e VT323
- `next/image` para ícones e imagens com lazy loading automático
- Deploy trivial na Vercel com zero config
- `dynamic()` imports para lazy loading dos window contents

**Configuração relevante:**
```ts
// next.config.ts
const nextConfig = {
  // Permite uso do Unicorn.studio via iframe
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }]
    }]
  },
  // Domínios de imagem se necessário
  images: {
    domains: ['i.scdn.co'], // Spotify album art
  },
}
```

**Alternativa considerada e descartada:**
- Vite + React SPA: sem SSG nativo, mais setup manual para deploy
- Astro: ótimo para conteúdo estático, mas o desktop é altamente interativo e Astro com React islands ficaria mais complexo que o necessário

---

## Linguagem: TypeScript 5 (strict)

**Justificativa:**
- O sistema de janelas tem estado complexo (posição, tamanho, foco, z-index por janela). TypeScript previne erros em runtime que seriam difíceis de debugar.
- Componentes temáveis ficam seguros: `theme: 'dev' | 'music'` garante que nunca passe um valor inválido.
- `noUncheckedIndexedAccess` previne bugs ao acessar `windows[id]` quando a janela pode não existir.

**tsconfig.json relevante:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

## Estilização: Tailwind CSS 3

**Justificativa:**
- Tokens de design (cores, gradientes, sombras) ficam centralizados no `tailwind.config.ts`
- Mudança de tema: basta trocar classes, não reescrever CSS
- Purge automático garante bundle CSS mínimo em produção

**Padrão de uso:**
- Classes Tailwind para layout, espaçamento e tipografia
- `style` prop inline apenas para valores dinâmicos (gradientes que dependem do tema, posição de janelas)
- CSS modules (`winxp-chrome.css`) para estilos muito específicos do WinXP que seriam verbosos em Tailwind (bevel effects, scrollbar customizada)

**Alternativa considerada:**
- CSS Modules puro: mais verboso, sem tokens centralizados
- Styled Components / Emotion: runtime CSS-in-JS adiciona overhead desnecessário para um site estático

---

## Estado Global: Zustand 4

**Justificativa:**
- API minimalista sem boilerplate (sem actions, reducers, providers)
- Seletores granulares evitam re-renders desnecessários (crítico para drag em 60fps)
- Suporte nativo a `immer` para updates de estado aninhado (perfeito para `windows[id].position`)
- Persistência simples com `zustand/middleware` se quisermos lembrar o tema escolhido

**Exemplo de store:**
```ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: {},
    topZ: 20,
    openWindow: (id) => set((state) => {
      if (!state.windows[id]) {
        state.windows[id] = createInitialWindowState(id)
      }
      state.windows[id].isOpen = true
      state.windows[id].zIndex = ++state.topZ
    }),
    // ...
  }))
)
```

**Alternativa considerada:**
- Jotai: ótimo para átomos individuais, mas o estado de janelas é muito relacional (foco afeta todas as janelas simultaneamente)
- Redux Toolkit: overkill para este projeto, boilerplate desnecessário
- Context API + useReducer: causaria re-renders em todo o árv ore ao mover uma janela

---

## Unicorn.studio (Wallpapers)

**O que é:** Ferramenta de criação de shaders/partículas visuais que exporta um snippet de embed JavaScript.

**Como integra:**
```tsx
// components/desktop/Wallpaper.tsx
'use client'
import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'

export function Wallpaper() {
  const { theme } = useTheme()

  useEffect(() => {
    // Unicorn.studio injeta via script tag
    // DEV theme: grade azul com partículas frias
    // MUSIC theme: ondas sonoras com partículas quentes
    const scriptId = `unicorn-${theme}`
    // carrega o script do embed correspondente ao tema
  }, [theme])

  return <div id="unicorn-canvas" className="absolute inset-0" />
}
```

**Consideração:** Criar duas cenas distintas no Unicorn.studio, uma por tema, e alternar via ID do embed.

**Fallback:** Se o Unicorn.studio não carregar (ad blocker, timeout), o wallpaper cai para o gradiente CSS puro definido no design-system.md. Nunca quebre a experiência por isso.

---

## 21.st.dev (Componentes UI)

**O que é:** Registry de componentes React prontos com boa qualidade visual, focados em UI moderna.

**Uso no projeto:**
- Componentes utilitários (inputs, toasts, tooltips) que não precisam da estética WinXP
- Aceleração de partes menos críticas do design (formulário de contato, elementos do blog)
- **Nunca para os elementos WinXP centrais** (titlebar, botões de janela, taskbar) — esses são customizados a mão

**Como instalar componentes do 21.st:**
```bash
npx shadcn@latest add "https://21st.dev/r/[component-name]"
```

---

## Spotify Embed API

**Como integra na `PlayerWindow`:**
```tsx
// window-contents/PlayerWindow.tsx
interface PlayerWindowProps {
  spotifyPlaylistId: string  // ex: '37i9dQZF1DX...'
}

export function PlayerWindow({ spotifyPlaylistId }: PlayerWindowProps) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?utm_source=generator&theme=0`}
      width="100%"
      height="100%"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  )
}
```

**Tema do embed:** `theme=0` = dark, `theme=1` = light. Usar dark para o tema MUSIC, light para DEV.

---

## Ferramentas de Desenvolvimento

| Ferramenta | Uso |
|---|---|
| **ESLint** | Linting com `eslint-config-next` + regras custom |
| **Prettier** | Formatação consistente (integrado ao ESLint) |
| **Husky + lint-staged** | Pre-commit hooks para garantir qualidade |
| **TypeScript compiler** | `tsc --noEmit` no CI para checar tipos |
| **Vercel** | Preview deploys em cada PR, produção no merge |

**Configuração ESLint relevante:**
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

---

## Dependências do package.json

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "zustand": "^4.0.0",
    "immer": "^10.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^14.0.0"
  }
}
```

---

## Decisões Futuras (não implementar agora)

| Feature | Tecnologia sugerida | Quando considerar |
|---|---|---|
| Blog com MDX | `@next/mdx` + `gray-matter` | Quando tiver 3+ posts |
| Analytics | Vercel Analytics (privacy-first) | No lançamento |
| Formulário de contato | Resend API | Quando o site for ao ar |
| i18n (pt/en) | `next-intl` | Se houver demanda internacional |
| Testes | Vitest + Testing Library | Antes de adicionar colaboradores |
