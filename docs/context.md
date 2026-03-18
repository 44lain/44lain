# context.md — Visão Geral do Projeto

## Objetivo do Projeto

Criar um portfólio pessoal interativo que funcione como um sistema operacional fictício chamado **WIRED_OS**, rodando no browser. O portfólio é simultaneamente uma obra criativa e uma ferramenta profissional — ele demonstra as capacidades técnicas e artísticas do seu criador pelo próprio meio em que é construído.

O visitante "liga" o computador, passa por um bootloader que permite escolher entre dois "sistemas" (Dev ou Music), e cai num desktop funcional com janelas arrastáveis, taskbar, ícones e uma experiência OS completa.

---

## Público-alvo

**Primário:**
- Recrutadores técnicos e CTOs avaliando candidatos full-stack
- Diretores criativos e produtoras buscando colaboradores

**Secundário:**
- Outros desenvolvedores e designers da comunidade (referência e inspiração)
- Labels, artistas e producers buscando colaboração musical
- Clientes diretos para projetos freelance

**Perfil comportamental do visitante ideal:**
- Aprecia referências culturais (Lain, Matrix, Y2K, WinXP)
- Valoriza craftsmanship e atenção a detalhe
- Está acostumado com portfólios convencionais e quer algo diferente
- Tem tolerância e curiosidade para explorar uma UI não-convencional

---

## Problema que o Portfólio Resolve

Portfólios tradicionais falham em três dimensões para um criador multifacetado:

1. **Identidade fragmentada**: separar portfólio dev do portfólio musical cria duas identidades fracas em vez de uma identidade forte e coesa. A intersecção entre código e música *é* o diferencial — um portfólio único comunica isso.

2. **Indiferenciação visual**: a maioria dos portfólios de dev segue o template `hero + projetos + contato`. Em um mercado saturado, isso não cria memória. O visitante precisa lembrar de quem você é depois de fechar a aba.

3. **Passividade da experiência**: portfólios são geralmente consumidos passivamente (scroll). Este portfólio é *operado* — o visitante abre janelas, escolhe o sistema, interage. Isso cria engajamento e tempo de permanência maior.

---

## Diferenciais Esperados

### Design
- Estética **WinXP Luna + Y2K Cyber**: familiar o suficiente para ser legível, estranho o suficiente para ser memorável
- Dois temas visuais completos que mudam *tudo*: cores, tipografia, ícones, wallpaper, conteúdo das janelas
- Wallpapers vivos via **Unicorn.studio** (partículas, shaders, movimento)
- Cursor customizado, janelas com drag/resize/minimize/maximize/close reais

### Performance
- Carregamento inicial rápido: a boot screen é CSS/JS puro, sem dependências pesadas
- Lazy loading de conteúdo das janelas (só renderiza quando abre)
- Animações via CSS transforms (GPU-accelerated), não JS layout thrashing

### UX
- Boot sequence cria antecipação e contexto antes do conteúdo
- Dual-boot comunica imediatamente a dualidade do criador
- Janelas permitem exploração não-linear (o visitante decide o que abrir)
- Player de música integrado com Spotify embed mantém o visitante imerso

### Técnico
- Next.js App Router com SSG para performance máxima
- TypeScript estrito em todo o codebase
- Sistema de janelas gerenciado por estado global (Zustand)
- Design system tokenizado via Tailwind CSS config
- Totalmente acessível via teclado (navegação no bootloader, foco em janelas)
