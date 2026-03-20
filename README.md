```
WIRED_OS v4.4 — initializing...
> hardware check ........... OK
> dual-boot detected ........ DEV / MUSIC
> user identified ........... 44lain
> loading profile ........... ██████████ 100%
```

<br/>

## `whoami`

Full-stack developer and music producer. I build things that shouldn't exist and make sounds that don't have a name yet. The intersection is where I live.

This repository **is** my portfolio — an interactive OS simulation running in the browser. Boot it, choose a side, open the windows.

<br/>

## `dual-boot`

| | DEV | MUSIC |
|---|---|---|
| **mode** | full-stack workstation | DAW / digital studio |
| **palette** | XP Luna blue | Y2K lilac |
| **tools** | Next.js · TypeScript · Node · PostgreSQL | FL Studio · synthesis · sound design |
| **tone** | precise, technical | evocative, abstract |

<br/>

## `stack`

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

<br/>

## `architecture`

```
src/
├── components/
│   ├── boot/             # BIOS POST → dual-boot menu
│   ├── desktop/          # icons, taskbar, wallpaper
│   ├── windows/          # draggable / resizable window system
│   └── window-contents/  # about · projects · player · blog · contact
├── stores/               # Zustand (windows, theme, boot)
├── hooks/                # useDraggable · useResizable · useTheme · useFocusTrap
└── data/                 # projects · releases · blog posts
```

built with **Next.js 16** · **TypeScript strict** · **Zustand + Immer** · deployed on **Vercel**

<br/>

```
; session terminated
; see you on the other side of the boot screen
```
