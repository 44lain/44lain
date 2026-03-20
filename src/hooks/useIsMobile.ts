'use client'

import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Hook SSR-safe para detectar viewport mobile (< 768px).
 * Inicia como false (server-safe) e atualiza no cliente após o mount.
 * Responde a mudanças de orientação/resize via MediaQueryList.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    function handleChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches)
    }

    setIsMobile(mql.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
