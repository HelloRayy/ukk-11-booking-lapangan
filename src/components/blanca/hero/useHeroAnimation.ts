import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export function useHeroAnimation() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerLogoRef = useRef<HTMLAnchorElement>(null)
  const centerLogoRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<SVGGElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const outroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Pantau scroll untuk efek header sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  // Timeline GSAP Intro Splashscreen
  useEffect(() => {
    const headerLogo = headerLogoRef.current
    const centerLogo = centerLogoRef.current
    const ball = ballRef.current
    const header = headerRef.current
    const video = videoRef.current
    const title = titleRef.current
    const outro = outroRef.current
    const words = wordsRef.current.filter(Boolean)

    if (!headerLogo || !centerLogo || !ball || !header || !video || !title || !outro) return

    header.style.opacity = '0'
    headerLogo.style.opacity = '0'

    const rect = headerLogo.getBoundingClientRect()

    const tl = gsap.timeline({
      onStart: () => {
        header.style.opacity = '0'
      },
    })

    // 1. Bola pada logo berputar -180 deg ke 0 (0.5s snappy)
    tl.fromTo(
      ball,
      { rotation: -180 },
      {
        duration: 0.55,
        rotation: 0,
        transformOrigin: 'center',
        ease: 'power3.out',
      },
    )

    // 2. Center logo membesar ke dimensi transisi
    tl.to(
      centerLogo,
      {
        duration: 0.55,
        height: 40,
        width: 208,
        ease: 'power3.out',
      },
      '<',
    )

    // 3. Logo melayang dari posisi tengah ke header logo
    tl.to(
      centerLogo,
      {
        duration: 0.55,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        transform: 'none',
        ease: 'power3.out',
        onComplete: () => {
          headerLogo.style.opacity = '1'
          centerLogo.style.opacity = '0'
        },
      },
      '+=0.05s',
    )

    // 4. Video scale down dan fade in bersamaan
    tl.to(
      video,
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: 'power2.out',
      },
      '<',
    )

    // 5. Title kata-per-kata muncul stagger dari overflow mask
    tl.set(title, { opacity: 1 }, '<')
    tl.fromTo(
      words,
      { y: '100%' },
      {
        y: '0%',
        duration: 0.55,
        stagger: 0.03,
        ease: 'power2.out',
      },
      '<',
    )

    // 6. Header slide down dari y: -40
    tl.fromTo(
      header,
      { opacity: 0, y: -40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(header, { clearProps: 'transform' })
        },
      },
      '<',
    )

    // 7. Outro slide up dari y: 40
    tl.fromTo(
      outro,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
      },
      '<',
    )

    ;(window as unknown as { __BLANCA_TL__?: gsap.core.Timeline }).__BLANCA_TL__ = tl

    // Jika pengguna scroll sebelum animasi selesai, langsung selesaikan timeline agar tidak menghambat navigasi
    const handleEarlyScroll = () => {
      if (tl.isActive()) {
        tl.progress(1)
      }
    }
    window.addEventListener('wheel', handleEarlyScroll, { passive: true, once: true })
    window.addEventListener('touchmove', handleEarlyScroll, { passive: true, once: true })

    return () => {
      document.documentElement.classList.remove('noscroll')
      window.removeEventListener('wheel', handleEarlyScroll)
      window.removeEventListener('touchmove', handleEarlyScroll)
      tl.kill()
    }
  }, [])

  return {
    headerRef,
    headerLogoRef,
    centerLogoRef,
    ballRef,
    videoRef,
    titleRef,
    wordsRef,
    outroRef,
    isScrolled,
  }
}
