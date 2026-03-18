# design-system.md — Sistema de Design WIRED_OS

## Filosofia Visual

O WIRED_OS vive na intersecção entre dois universos visuais:

- **WinXP Luna**: skeuomorfia familiar, gradientes de titlebar, botões com bevel, ícones semitransparentes com aquela qualidade plástica dos anos 2000
- **Y2K Cyber**: iridescência, cromado, tipografia técnica, a sensação de que a internet era um lugar mais *estranho* e mais *interessante* antes de ser normalizada

A regra de ouro: **reconhecível primeiro, surpreendente depois**. O visitante precisa entender imediatamente que está num "computador", mesmo que seja um computador de um universo paralelo.

---

## Temas

O sistema tem dois temas completos. Toda decisão de design precisa ter uma resposta para ambos.

| Aspecto | DEV | MUSIC |
|---|---|---|
| Metáfora | Workstation de desenvolvedor | DAW / estúdio digital |
| Paleta primária | Azul XP Luna | Roxo/lilás Y2K |
| Paleta de acento | Verde terminal | Rosa/magenta |
| Tipografia display | Tahoma / Segoe UI | Electrolize / VT323 |
| Wallpaper | Grade técnica azul, partículas frias | Ondas sonoras, partículas quentes |
| Ícones | Estilo arquivo/sistema | Estilo instrumento/mídia |
| Tom do conteúdo | Técnico, preciso | Criativo, evocativo |

---

## Tokens de Design

### Cores

Defina no `tailwind.config.ts` como tokens nomeados:

```ts
// tailwind.config.ts
colors: {
  // Base (compartilhado)
  'wired-black':    '#0a0a0f',
  'wired-surface':  '#111118',
  'wired-border':   'rgba(255,255,255,0.12)',

  // Tema DEV
  'dev-title-dark':  '#0A246A',
  'dev-title-light': '#4a90e2',
  'dev-accent':      '#4a90e2',
  'dev-accent-dim':  '#1a5fb4',
  'dev-green':       '#3a8a10',
  'dev-taskbar':     '#1240a0',

  // Tema MUSIC
  'music-title-dark':  '#2d0a5a',
  'music-title-light': '#9a4ae2',
  'music-accent':      '#9a4ae2',
  'music-accent-dim':  '#6a1ab4',
  'music-pink':        '#e24aaa',
  'music-taskbar':     '#3a1280',

  // Boot screen
  'bios-bg':    '#000000',
  'bios-blue':  '#0000AA',
  'bios-text':  '#AAAAAA',
  'bios-white': '#FFFFFF',
}
```

### Tipografia

```ts
// tailwind.config.ts — fontFamily
fontFamily: {
  'tahoma':      ['Tahoma', 'Verdana', 'sans-serif'],     // DEV UI
  'electrolize': ['Electrolize', 'monospace'],             // MUSIC display
  'vt323':       ['VT323', 'monospace'],                   // Boot screen / terminal
  'mono':        ['Share Tech Mono', 'Courier New', 'monospace'], // Code / output
}
```

**Hierarquia tipográfica por contexto:**

| Contexto | Fonte | Tamanho | Peso |
|---|---|---|---|
| Boot BIOS | VT323 | 13–14px | 400 |
| Titlebar janela | Tahoma | 11px | 700 |
| Corpo janela (DEV) | Tahoma | 11px | 400 |
| Corpo janela (MUSIC) | Electrolize | 11px | 400 |
| Nome do projeto | Tahoma | 11px | 700 |
| Labels / badges | Tahoma | 9–10px | 400 |
| Taskbar clock | Tahoma | 10px | 400 |

**Nunca use fontes abaixo de 9px.** Legibilidade é parte da experiência.

### Espaçamento

Use a escala padrão do Tailwind, com estes valores âncora:

| Token | Valor | Uso |
|---|---|---|
| `spacing-1` | 4px | Gap interno de botões, padding de badges |
| `spacing-2` | 8px | Padding padrão de toolbar |
| `spacing-3` | 12px | Padding interno de janelas |
| `spacing-4` | 16px | Padding de conteúdo |
| `spacing-6` | 24px | Gaps entre seções |

### Sombras

```ts
boxShadow: {
  'window': '2px 4px 16px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.15)',
  'window-focus': '2px 4px 24px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.25)',
  'btn-xp': 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.4)',
}
```

### Border Radius

```ts
borderRadius: {
  'window':    '6px 6px 4px 4px',  // Janelas (top mais arredondado)
  'btn':       '3px',               // Botões padrão
  'btn-start': '12px',              // Botão Start (pill)
  'badge':     '10px',              // Badges / tags
  'titlebar-btn': '3px',            // Botões de fechar/min/max
}
```

---

## Componentes do Design System

### `<Window>` — Componente base de janela

O componente mais crítico do sistema. Toda janela deve usar este base.

**Props interface:**
```ts
interface WindowProps {
  id: string
  title: string
  icon: string                    // emoji ou path de ícone
  theme: 'dev' | 'music'
  initialPosition?: { x: number, y: number }
  initialSize?: { width: number, height: number }
  minSize?: { width: number, height: number }
  menuItems?: string[]            // ex: ['File', 'Edit', 'View']
  children: React.ReactNode
}
```

**Anatomia:**
```
┌─[●][─][□]──── título ─────────────────────┐  ← Titlebar (draggable)
├── File  Edit  View ────────────────────────┤  ← MenuBar (opcional)
│                                            │
│              conteúdo                      │  ← WindowBody (scrollable)
│                                            │
└────────────────────────────────────────── ↘ ← ResizeHandle
```

**Estados visuais:**
- **Focused**: sombra mais intensa, titlebar mais saturada
- **Minimized**: `display: none`, item na taskbar permanece
- **Maximized**: ocupa todo o espaço do desktop (exceto taskbar)
- **Unfocused**: titlebar levemente dessaturada (opacity 0.85)

### `<TitlebarButton>` — Botões de controle de janela

Três variantes: `close`, `minimize`, `maximize`.

```ts
// Gradientes exatos — não improvise
const gradients = {
  close: {
    default: 'linear-gradient(180deg, #ff8080 0%, #e02020 100%)',
    hover:   'linear-gradient(180deg, #ffaaaa 0%, #ff3030 100%)',
  },
  minimize: {
    default: 'linear-gradient(180deg, #ffe080 0%, #e0a020 100%)',
    hover:   'linear-gradient(180deg, #fff0a0 0%, #ffb030 100%)',
  },
  maximize: {
    default: 'linear-gradient(180deg, #80ff80 0%, #20c020 100%)',
    hover:   'linear-gradient(180deg, #a0ffa0 0%, #30e030 100%)',
  },
}
```

Tamanho fixo: `16×14px`. Border radius: `3px`.

### `<Taskbar>` — Barra de tarefas

Contém: Start button, itens de janelas abertas, botão de reboot, relógio.

**Gradientes por tema:**
```ts
const taskbarGradients = {
  dev:   'linear-gradient(180deg, #2a6aba 0%, #1a4a9a 30%, #1240a0 70%, #0a2880 100%)',
  music: 'linear-gradient(180deg, #6a2aaa 0%, #4a1a8a 30%, #3a1280 70%, #220860 100%)',
}
```

Altura fixa: `32px`. Sempre `position: absolute; bottom: 0`.

### `<StartButton>` — Botão Start

```ts
const startGradients = {
  dev:   'linear-gradient(180deg, #5aaa30 0%, #3a8a10 50%, #2a7000 100%)',
  music: 'linear-gradient(180deg, #aa5aee 0%, #8a3acc 50%, #6a10aa 100%)',
}
```

Border radius: `12px` (pill shape). Label muda por tema: `⊞ Start` / `♪ Start`.

### `<DesktopIcon>` — Ícone do desktop

```ts
interface DesktopIconProps {
  emoji: string
  label: string
  onDoubleClick: () => void
  theme: 'dev' | 'music'
}
```

Tamanho do ícone: `32×32px`. Label: `10px`, cor branca com `text-shadow` para legibilidade sobre wallpaper. Hover: `background: rgba(255,255,255,0.12)`.

### `<BootScreen>` — Tela de boot

Três fases distintas com transições:
1. **BIOS POST**: texto progressivo, fundo preto, fonte VT323
2. **Boot Menu**: caixa centralizada com as duas opções, navegável por teclado
3. **Fade out**: `opacity: 0` → `display: none` antes de mostrar o desktop

### `<PlayerWindow>` — Janela do player

Conteúdo em dois modos:
- **Preview mode**: player customizado com barras animadas (enquanto o Spotify embed não carrega)
- **Embed mode**: iframe do Spotify com wrapper estilizado

```ts
interface PlayerWindowProps {
  spotifyPlaylistId?: string   // Se fornecido, usa embed; senão usa preview
  theme: 'dev' | 'music'
}
```

---

## Referências de Estilo

### WinXP Luna (Blue theme)
- Titlebar: gradiente azul de `#4a90e2` para `#1240a0`
- Área de trabalho: gradiente verde do wallpaper Bliss
- Botões: fundo cinza `#ECE9D8` com bevel sutil
- Fontes de sistema: Tahoma 11px, MS Sans Serif para diálogos
- Ícones: 32×32px com transparência, estilo tridimensional e brilhante

### Y2K Cyber
- Superfícies escuras com brilho iridescente
- Fontes techno: Electrolize, VT323, Share Tech Mono
- Paleta: preto profundo + acento néon (roxo, rosa, ciano)
- Elementos cromados e metálicos (gradientes prata/cinza)
- Grid patterns e scanlines sutis como overlay
- A sensação de "internet antiga" — weird, densamente textual, funcional

### Recursos de referência visual
- https://guidebookgallery.org/guis/winxp (screenshots originais do WinXP)
- Série Serial Experiments Lain (1998) — paleta e atmosfera
- Geocities archive — density e texturas Y2K
- Early 2000s Winamp skins — referência direta para o player

---

## Animações e Transições

**Princípio**: animações devem reforçar a metáfora do OS, não decorar.

| Evento | Animação | Duração |
|---|---|---|
| Abrir janela | `scale(0.95) → scale(1)` + `opacity 0 → 1` | 120ms ease-out |
| Fechar janela | `scale(1) → scale(0.95)` + `opacity 1 → 0` | 100ms ease-in |
| Boot fade out | `opacity 1 → 0` | 400ms ease |
| Barra equalizador | `scaleY` alternado por barra | 400–900ms ease-in-out infinite |
| Cursor de boot | `opacity` blink | 1100ms step-end infinite |
| Taskbar item hover | `background` transition | 80ms |

**Nunca animar**: `width`, `height`, `top`, `left`, `margin`, `padding` — use apenas `transform` e `opacity`.

---

## Acessibilidade no Design System

- Todas as janelas devem ter `role="dialog"` e `aria-labelledby` apontando para o título
- Focus trap dentro de janelas abertas (Tab não escapa da janela focada)
- Boot menu navegável com `↑↓` e `Enter`
- Contraste mínimo de 4.5:1 para texto sobre fundos coloridos
- Cursor customizado deve ter fallback para cursor padrão do sistema
- Ícones decorativos com `aria-hidden="true"`, ícones funcionais com `aria-label`
