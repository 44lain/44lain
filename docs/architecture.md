# architecture.md — Arquitetura do Projeto

## Visão Geral

O WIRED_OS é uma aplicação Next.js 14 com App Router. A maior parte do conteúdo é estático (SSG), com interatividade rica no client-side. A arquitetura prioriza:

1. **Separação clara entre UI e lógica de estado**
2. **Componentes temáveis sem prop drilling**
3. **Lazy loading de conteúdo de janelas**
4. **Tipos TypeScript como documentação viva**

---

## Estrutura de Pastas

```
wired-os/
├── public/
│   ├── cursors/
│   │   ├── default.cur        # Cursor WinXP customizado
│   │   └── pointer.cur
│   ├── icons/
│   │   ├── dev/               # Ícones do tema DEV (32x32 PNG)
│   │   └── music/             # Ícones do tema MUSIC
│   └── fonts/                 # Fontes locais se necessário
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout: fontes, metadata global
│   │   ├── page.tsx           # Entry point → redireciona para /boot ou /desktop
│   │   ├── globals.css        # CSS global: cursor, scrollbar, seleção de texto
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── boot/
│   │   │   ├── BootScreen.tsx         # Orquestra as fases do boot
│   │   │   ├── BiosPost.tsx           # Fase 1: POST do BIOS
│   │   │   ├── BootMenu.tsx           # Fase 2: seleção DEV/MUSIC
│   │   │   └── boot.types.ts
│   │   │
│   │   ├── desktop/
│   │   │   ├── Desktop.tsx            # Container principal, gerencia wallpaper
│   │   │   ├── Taskbar.tsx            # Barra inferior
│   │   │   ├── StartButton.tsx
│   │   │   ├── TaskbarItem.tsx
│   │   │   ├── TaskbarClock.tsx
│   │   │   ├── DesktopIcon.tsx
│   │   │   ├── DesktopIconGrid.tsx
│   │   │   └── desktop.types.ts
│   │   │
│   │   ├── windows/
│   │   │   ├── Window.tsx             # Componente base: drag, resize, focus
│   │   │   ├── TitleBar.tsx
│   │   │   ├── MenuBar.tsx
│   │   │   ├── WindowBody.tsx
│   │   │   ├── ResizeHandle.tsx
│   │   │   ├── WindowManager.tsx      # Renderiza todas as janelas abertas
│   │   │   └── window.types.ts
│   │   │
│   │   ├── window-contents/
│   │   │   ├── AboutWindow.tsx        # Conteúdo: about/whoami
│   │   │   ├── ProjectsWindow.tsx     # Conteúdo: lista de projetos
│   │   │   ├── PlayerWindow.tsx       # Conteúdo: music player + Spotify embed
│   │   │   ├── BlogWindow.tsx         # Conteúdo: lista de posts
│   │   │   ├── ContactWindow.tsx      # Conteúdo: formulário de contato
│   │   │   └── contents.types.ts
│   │   │
│   │   └── ui/
│   │       ├── TitlebarButton.tsx     # close / min / max
│   │       ├── XpButton.tsx           # Botão estilo WinXP genérico
│   │       ├── Badge.tsx              # Tags de tecnologia / gênero
│   │       ├── IniField.tsx           # Campo estilo .ini para contact form
│   │       └── EqualizerBars.tsx      # Animação de barras do player
│   │
│   ├── stores/
│   │   ├── windowStore.ts    # Estado de todas as janelas (open, pos, size, focus)
│   │   ├── themeStore.ts     # Tema ativo: 'dev' | 'music'
│   │   └── bootStore.ts      # Estado do boot (fase atual, completado)
│   │
│   ├── hooks/
│   │   ├── useDraggable.ts   # Hook de drag para janelas
│   │   ├── useResizable.ts   # Hook de resize para janelas
│   │   ├── useFocusTrap.ts   # Trap de foco para acessibilidade
│   │   ├── useTheme.ts       # Lê themeStore, retorna tokens do tema atual
│   │   └── useWindowManager.ts  # open, close, minimize, maximize, focus
│   │
│   ├── data/
│   │   ├── projects.ts       # Array de projetos DEV
│   │   ├── releases.ts       # Array de releases MUSIC
│   │   ├── blog-posts.ts     # Array de posts do blog
│   │   └── window-configs.ts # Config de cada janela (tamanho inicial, ícone, etc.)
│   │
│   ├── types/
│   │   ├── theme.types.ts    # Theme, ThemeTokens, etc.
│   │   ├── window.types.ts   # WindowState, WindowConfig, etc.
│   │   └── content.types.ts  # Project, Release, BlogPost, etc.
│   │
│   ├── lib/
│   │   ├── theme-tokens.ts   # Mapeia tema → tokens CSS (cores, fontes)
│   │   ├── window-utils.ts   # Cálculos de posição, z-index, etc.
│   │   └── constants.ts      # TASKBAR_HEIGHT, MIN_WINDOW_SIZE, etc.
│   │
│   └── styles/
│       ├── globals.css       # (já em app/, aqui apenas imports adicionais)
│       └── winxp-chrome.css  # Estilos específicos dos elementos WinXP
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Padrões de Componentes

### Padrão de Componente Temável

Todo componente que muda entre DEV e MUSIC deve seguir este padrão:

```tsx
// ✅ CORRETO — usa hook de tema
import { useTheme } from '@/hooks/useTheme'

export function StartButton() {
  const { theme, tokens } = useTheme()

  return (
    <button
      style={{ background: tokens.startButtonGradient }}
      className="start-btn"
    >
      {theme === 'dev' ? '⊞ Start' : '♪ Start'}
    </button>
  )
}

// ❌ ERRADO — prop drilling de tema
export function StartButton({ theme }: { theme: 'dev' | 'music' }) { ... }
```

### Padrão de Conteúdo de Janela (Lazy)

Todo `window-content` deve ser lazy-loaded para não impactar o bundle inicial:

```tsx
// windows/WindowManager.tsx
import dynamic from 'next/dynamic'

const windowContents = {
  about:    dynamic(() => import('@/components/window-contents/AboutWindow')),
  projects: dynamic(() => import('@/components/window-contents/ProjectsWindow')),
  player:   dynamic(() => import('@/components/window-contents/PlayerWindow')),
  blog:     dynamic(() => import('@/components/window-contents/BlogWindow')),
  contact:  dynamic(() => import('@/components/window-contents/ContactWindow')),
}
```

### Padrão de Store (Zustand)

```ts
// stores/windowStore.ts
interface WindowState {
  id: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

interface WindowStore {
  windows: Record<string, WindowState>
  topZ: number
  openWindow:     (id: string) => void
  closeWindow:    (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow:    (id: string) => void
  updatePosition: (id: string, pos: { x: number; y: number }) => void
  updateSize:     (id: string, size: { width: number; height: number }) => void
}
```

### Padrão de Dados Estáticos

```ts
// data/projects.ts
export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  url?: string
  year: number
  theme: 'dev' | 'music' | 'both'
}

export const projects: Project[] = [
  {
    id: 'wired-os',
    name: 'portfolio-os',
    description: 'this very website',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    year: 2025,
    theme: 'dev',
  },
  // ...
]
```

---

## Separação de Responsabilidades

| Camada | Responsabilidade | Não deve fazer |
|---|---|---|
| `app/` | Routing, metadata, layout root | Lógica de negócio, estado |
| `components/` | Renderização, eventos UI | Chamadas de API diretas, lógica complexa |
| `stores/` | Estado global reativo | Renderização, side effects de UI |
| `hooks/` | Lógica reutilizável, abstrações | Estado global direto (use stores) |
| `data/` | Dados estáticos tipados | Mutação, chamadas async |
| `lib/` | Funções utilitárias puras | Estado, efeitos colaterais |
| `types/` | Definições de tipos compartilhadas | Qualquer lógica |

---

## Fluxo de Dados

```
Boot Screen
    │ usuário seleciona tema
    ▼
themeStore.setTheme('dev' | 'music')
    │
    ▼
Desktop renderiza com tokens do tema ativo
    │ usuário dá double-click em ícone
    ▼
windowStore.openWindow('projects')
    │
    ▼
WindowManager renderiza <Window id="projects">
    │ (lazy load)
    ▼
<ProjectsWindow> lê data/projects.ts + themeStore
    │ filtra por tema ativo
    ▼
Renderiza lista de projetos estilizada para o tema
```

---

## Estratégias de Escalabilidade

### Adicionando uma nova janela

1. Crie o conteúdo em `components/window-contents/NomeWindow.tsx`
2. Adicione a config em `data/window-configs.ts`
3. Registre no lazy map em `WindowManager.tsx`
4. Adicione o ícone em ambos os temas em `data/window-configs.ts`
5. Adicione os dados em `data/nome.ts` se necessário

Nenhum outro arquivo precisa mudar.

### Adicionando um novo tema

1. Adicione o valor ao union type em `types/theme.types.ts`
2. Implemente os tokens em `lib/theme-tokens.ts`
3. Adicione ícones em `public/icons/nome-tema/`
4. Adicione opção no `BootMenu.tsx`
5. Adicione config de wallpaper

### Blog com MDX (futuro)

Os posts começam como dados estáticos em `data/blog-posts.ts`. Quando o blog crescer, migrar para `app/blog/[slug]/page.tsx` com MDX é trivial — a janela `BlogWindow` só precisa trocar de fonte de dados.

---

## Convenções de Nomenclatura de Arquivos

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componentes React | PascalCase + `.tsx` | `Window.tsx` |
| Hooks | camelCase prefixado com `use` | `useDraggable.ts` |
| Stores Zustand | camelCase sufixado com `Store` | `windowStore.ts` |
| Arquivos de tipos | camelCase sufixado com `.types.ts` | `window.types.ts` |
| Dados estáticos | camelCase plural | `projects.ts` |
| Utilitários | camelCase sufixado com `-utils` | `window-utils.ts` |
| CSS modules | camelCase sufixado com `.module.css` | `window.module.css` |
