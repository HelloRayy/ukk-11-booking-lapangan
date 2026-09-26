// PERAN FILE: Custom Hook Integrasi Lenis Smooth Scroll Engine untuk Landing Page Blanca
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

interface UseLenisOptions {
  enabled?: boolean
  isLocked?: boolean
}

export function useLenis({ enabled = true, isLocked = false }: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Inisialisasi Lenis dengan auto-requestAnimationFrame (autoRaf)
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled])

  // Otomatis stop scroll saat side panel drawer terbuka
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return

    if (isLocked) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [isLocked])

  return lenisRef
}
