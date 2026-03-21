# best-practices.md — Boas Práticas e Convenções

## TypeScript

### Seja estrito. Sempre.

```ts
// tsconfig.json — configuração obrigatória
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Props sempre tipadas com interface, nunca com type inline

```tsx
// ✅ CORRETO
interface WindowProps {
  id: string
  title: string
  theme: 'dev' | 'music'
}

export function Window({ id, title, theme }: WindowProps) { ... }

// ❌ ERRADO
export function Window({ id, title, theme }: { id: string; title: string; theme: string }) { ... }
```

### Evite `any`. Sem exceções.

```ts
// ❌ ERRADO
function handleEvent(e: any) { ... }

// ✅ CORRETO
function handleEvent(e: React.MouseEvent<HTMLButtonElement>) { ... }
```

### Use discriminated unions para estados complexos

```ts
// ✅ Claro, sem null checks desnecessários
type BootPhase =
  | { phase: 'bios';   progress: number }
  | { phase: 'menu';   selected: 'dev' | 'music' }
  | { phase: 'loading'; theme: 'dev' | 'music' }
  | { phase: 'done' }
```

---

## Convenções de Código React

### Ordem dos elementos em um componente

```tsx
export function MyComponent({ prop1, prop2 }: Props) {
  // 1. Stores e contexto
  const { theme } = useTheme()
  const { openWindow } = useWindowManager()

  // 2. Estado local
  const [isHovered, setIsHovered] = useState(false)

  // 3. Refs
  const containerRef = useRef<HTMLDivElement>(null)

  // 4. Efeitos
  useEffect(() => { ... }, [])

  // 5. Handlers (prefixados com 'handle')
  function handleClick() { ... }
  function handleKeyDown(e: React.KeyboardEvent) { ... }

  // 6. Computed values (não em useMemo a menos que seja pesado)
  const displayTitle = theme === 'dev' ? 'Projects' : 'Releases'

  // 7. Render
  return (...)
}
```

### Handlers sempre nomeados com `handle` + evento

```tsx
// ✅
function handleTitlebarMouseDown(e: React.MouseEvent) { ... }
function handleResizeMouseDown(e: React.MouseEvent) { ... }
function handleCloseClick() { ... }

// ❌
function onClose() { ... }
function mouseDown() { ... }
function click() { ... }
```

### Evite lógica inline complexa no JSX

```tsx
// ❌ RUIM — difícil de ler e testar
return (
  <div style={{
    background: theme === 'dev'
      ? `linear-gradient(${darkColor}, ${lightColor})`
      : `linear-gradient(${purpleColor}, ${pinkColor})`
  }}>
```

```tsx
// ✅ BOM — legível e fácil de alterar
const { titlebarGradient } = useTheme()
return <div style={{ background: titlebarGradient }}>
```

### Componentes pequenos e focados

Regra dos 150 linhas: se um componente passa de 150 linhas, provavelmente precisa ser dividido. A `Window.tsx` é a exceção, pode ser maior por sua complexidade intrínseca.

---

## Performance

### Drag e resize: nunca setState no mousemove

```ts
// ❌ RUIM — setState 60x por segundo = re-render massivo
document.addEventListener('mousemove', (e) => {
  setPosition({ x: e.clientX, y: e.clientY }) // causa re-render!
})

// ✅ BOM — manipula o DOM diretamente durante drag, só salva no mouseup
const posRef = useRef({ x: 0, y: 0 })

document.addEventListener('mousemove', (e) => {
  posRef.current = { x: ..., y: ... }
  windowEl.style.left = posRef.current.x + 'px'  // DOM direto
  windowEl.style.top  = posRef.current.y + 'px'
})

document.addEventListener('mouseup', () => {
  updatePosition(id, posRef.current) // só agora vai pro store
})
```

### Memoize seletores de store

```ts
// ❌ Re-renderiza quando qualquer janela muda
const windows = useWindowStore(state => state.windows)

// ✅ Só re-renderiza quando esta janela específica muda
const windowState = useWindowStore(
  useCallback(state => state.windows[id], [id])
)
```

### Lazy load de window contents é obrigatório

```tsx
// WindowManager.tsx — nunca importe diretamente
// ❌
import ProjectsWindow from './ProjectsWindow'

// ✅
const ProjectsWindow = dynamic(() => import('./ProjectsWindow'), {
  loading: () => <WindowLoadingSkeleton />
})
```

### Animações de equalizador: CSS puro, não JS

```css
/* ✅ GPU-accelerated, zero JavaScript */
@keyframes equalizer {
  from { transform: scaleY(0.15); }
  to   { transform: scaleY(1); }
}

.bar {
  transform-origin: bottom;
  animation: equalizer var(--duration) ease-in-out infinite alternate;
}
```

### Imagens sempre com next/image

```tsx
// ✅
import Image from 'next/image'
<Image src="/icons/dev/folder.png" alt="Folder" width={32} height={32} />

// ❌
<img src="/icons/dev/folder.png" />
```

---

## Acessibilidade

### Focus trap em janelas

Toda janela aberta deve trapper o foco. Use o hook `useFocusTrap`:

```tsx
// hooks/useFocusTrap.ts
export function useFocusTrap(ref: RefObject<HTMLElement>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !ref.current) return
    const focusable = ref.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    // implementação do trap
  }, [enabled])
}
```

### Janelas como diálogos

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby={`window-title-${id}`}
>
  <div id={`window-title-${id}`}>{title}</div>
  ...
</div>
```

### Boot menu navegável por teclado

```tsx
// BootMenu.tsx — deve funcionar sem mouse
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      setSelected(prev => prev === 'dev' ? 'music' : 'dev')
    }
    if (e.key === 'Enter') {
      bootInto(selected)
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [selected])
```

### Reduced motion

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  .bar, .cursor-blink, .boot-progress { animation: none; }
  .window-open, .window-close { transition: none; }
}
```

### Contraste mínimo

- Texto sobre fundos coloridos: verifique com https://webaim.org/resources/contrastchecker/
- Mínimo WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande
- Textos brancos sobre o gradiente da titlebar: ok
- Textos escuros sobre `#ECE9D8` (fundo XP): ok
- Badges coloridos: verificar individualmente

---

## Clean Code

### Constantes nomeadas, nunca magic numbers

```ts
// ❌
if (windowEl.style.zIndex > 20) { ... }
const taskbarHeight = 32

// ✅ — em lib/constants.ts
export const TASKBAR_HEIGHT = 32
export const INITIAL_Z_INDEX = 20
export const MIN_WINDOW_WIDTH = 180
export const MIN_WINDOW_HEIGHT = 100
export const WINDOW_OPEN_DURATION_MS = 120
```

### Funções pequenas e nomeadas descritivamente

```ts
// ❌
function calc(w: WindowState) {
  return { x: Math.max(0, Math.min(w.position.x, window.innerWidth - w.size.width)), ... }
}

// ✅
function clampWindowPosition(
  position: Position,
  size: Size,
  bounds: Bounds
): Position {
  return {
    x: Math.max(bounds.minX, Math.min(position.x, bounds.maxX - size.width)),
    y: Math.max(bounds.minY, Math.min(position.y, bounds.maxY - size.height)),
  }
}
```

### Comentários explicam o "porquê", não o "o quê"

```ts
// ❌ — comentário inútil
// incrementa o zIndex
zTop++

// ✅ — explica a decisão
// Janelas usam z-index incremental simples. Não usamos camadas fixas
// porque a ordem de foco é completamente livre pelo usuário.
zTop++
```

### Early return para reduzir nesting

```tsx
// ❌
function closeWindow(id: string) {
  if (windows[id]) {
    if (!windows[id].isMinimized) {
      windows[id].el.remove()
      delete windows[id]
    }
  }
}

// ✅
function closeWindow(id: string) {
  if (!windows[id]) return
  windows[id].el.remove()
  delete windows[id]
}
```

---

## Padrões de Interação (Pointer Events)

### Drag vs Click: use flag `hasMoved` com limiar de pixels

Nunca distinguir drag de click por `onDoubleClick`. Usar Pointer Events com flag:

```ts
// DesktopIconGrid.tsx — padrão estabelecido na sessão 5
const dragging = useRef<{
  id: string
  startX: number
  startY: number
  initX: number
  initY: number
  hasMoved: boolean
} | null>(null)

function handlePointerDown(e: React.PointerEvent, id: string) {
  e.currentTarget.setPointerCapture(e.pointerId)
  dragging.current = {
    id, startX: e.clientX, startY: e.clientY,
    initX: positions[id].x, initY: positions[id].y,
    hasMoved: false,
  }
}

function handlePointerMove(e: React.PointerEvent) {
  if (!dragging.current) return
  const dx = e.clientX - dragging.current.startX
  const dy = e.clientY - dragging.current.startY
  if (!dragging.current.hasMoved && Math.hypot(dx, dy) < 3) return
  dragging.current.hasMoved = true
  // ... atualiza posição via DOM ou state
}

function handlePointerUp(e: React.PointerEvent) {
  if (!dragging.current) return
  if (!dragging.current.hasMoved) {
    handleIconClick(dragging.current.id) // só dispara click se não houve drag
  }
  dragging.current = null
}
```

> Limiar recomendado: 3px via `Math.hypot(dx, dy)`.

---

## Comunicação Cross-Component: Custom Events

Para comunicação entre componentes sem relação pai-filho (ex.: Taskbar → page.tsx), usar `CustomEvent` da Web API em vez de prop drilling ou stores adicionais:

```ts
// Dispatcher (ex.: Taskbar.tsx)
window.dispatchEvent(new CustomEvent('msn:reopen'))

// Listener (ex.: page.tsx)
useEffect(() => {
  const handler = () => setShowMsnPopup(true)
  window.addEventListener('msn:reopen', handler)
  return () => window.removeEventListener('msn:reopen', handler)
}, [])
```

> Convenção de nome: `dominio:acao` em kebab-case (ex.: `msn:reopen`, `window:focus`).

---

## exactOptionalPropertyTypes: Props Opcionais

Com `exactOptionalPropertyTypes: true`, não se pode passar `undefined` para uma prop opcional que não aceita `| undefined`. Usar spread condicional:

```tsx
// ❌ Quebra com exactOptionalPropertyTypes
<DesktopIcon iconSrc={src ?? undefined} />

// ✅ Correto — não inclui a key quando src é falsy
<DesktopIcon {...(src ? { iconSrc: src } : {})} />
```

Ou na função que constrói os objetos:

```ts
// ✅ Não inclui a key no objeto quando valor é undefined
const base = { id, label, emoji }
return src ? { ...base, iconSrc: src } : base
```

---

## Git e Commits

Siga o padrão **Conventional Commits**:

```
feat(windows): add resize handle to Window component
fix(taskbar): clock not updating after minimize
style(boot): adjust BIOS text spacing
refactor(stores): extract window position logic to utils
docs(architecture): update folder structure diagram
```

Tipos: `feat`, `fix`, `style`, `refactor`, `docs`, `test`, `chore`
Escopo: `boot`, `desktop`, `windows`, `taskbar`, `player`, `stores`, `hooks`, `ui`
