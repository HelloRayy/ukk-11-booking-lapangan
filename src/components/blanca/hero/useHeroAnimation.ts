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
    document.documentElement.classList.add('noscroll')

    const rect = headerLogo.getBoundingClientRect()

    const tl = gsap.timeline({
      onStart: () => {
        header.style.opacity = '0'
        document.documentElement.classList.add('noscroll')
      },
    })

    // 1. Bola pada logo berputar -180 deg ke 0
    tl.fromTo(
      ball,
      { rotation: -180 },
      {
        duration: 1,
        rotation: 0,
        transformOrigin: 'center',
        ease: 'power4.out',
      },
    )

    // 2. Center logo membesar ke dimensi transisi
    tl.to(
      centerLogo,
      {
        duration: 1,
        height: 40,
        width: 208,
        ease: 'power4.out',
      },
      '<',
    )

    // 3. Logo melayang dari posisi tengah ke header logo
    tl.to(
      centerLogo,
      {
        duration: 1,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        transform: 'none',
        ease: 'power4.out',
        onComplete: () => {
          headerLogo.style.opacity = '1'
          centerLogo.style.opacity = '0'
        },
      },
      '+=0.3s',
    )

    // 4. Video scale down dan fade in bersamaan
    tl.to(
      video,
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
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
        duration: 1,
        stagger: 0.05,
        ease: 'power3.out',
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
        duration: 1,
        ease: 'power3.out',
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
        duration: 1,
        ease: 'power3.out',
      },
      '<',
    )

    tl.eventCallback('onComplete', () => {
      document.documentElement.classList.remove('noscroll')
    })

    ;(window as unknown as { __BLANCA_TL__?: gsap.core.Timeline }).__BLANCA_TL__ = tl

    return () => {
      document.documentElement.classList.remove('noscroll')
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
