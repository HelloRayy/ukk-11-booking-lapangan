import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import heroSvg from '../../assets/hero.svg'

export default function HeroBlanca() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerLogoRef = useRef<HTMLAnchorElement>(null)
  const centerLogoRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<SVGGElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const outroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)

  // Logika handler spotlight interaktif berbasis CSS variables native
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const heroMedia = videoRef.current
    if (!heroMedia) return
    const rect = heroMedia.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    heroMedia.style.setProperty('--spotlight-x', `${x}px`)
    heroMedia.style.setProperty('--spotlight-y', `${y}px`)
    heroMedia.style.setProperty('--spotlight-opacity', '1')
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.style.setProperty('--spotlight-opacity', '0.4')
    }
  }

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

    // Sembunyikan header, headerLogo, dan hilangkan vertical bar/scrollbar saat splashscreen awal
    header.style.opacity = '0'
    headerLogo.style.opacity = '0'
    document.documentElement.classList.add('noscroll')

    // Ambil koordinat target logo di header
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
          document.documentElement.classList.remove('noscroll')
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

    // 7. Outro (teks deskripsi & tombol) slide up dari y: 40
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

    // Simpan instance ke window agar Playwright bisa mengontrol timeline secara deterministik
    ;(window as unknown as { __BLANCA_TL__?: gsap.core.Timeline }).__BLANCA_TL__ = tl

    return () => {
      document.documentElement.classList.remove('noscroll')
      tl.kill()
    }
  }, [])

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen bg-[#161616] text-[#fcfcfc] overflow-x-hidden font-aeonik"
    >
      {/* Background Static Radial Glow Circle */}
      <div className="absolute inset-x-0 top-[-446px] lg:top-[-523px] w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="background-circle background-circle--static left-1/2 top-0 w-screen min-w-[1286px] max-w-[1440px] h-[751px] lg:h-[841px] -translate-x-1/2" />
      </div>

      {/* Header Sticky Navigation */}
      <header className="sticky top-0 z-20 w-full" ref={headerRef}>
        <div className="header">
          <div className="header__bar">
            {/* Sisi Kiri: Logo Header */}
            <div className="flex-1 flex flex-row items-center">
              <a
                ref={headerLogoRef}
                className="header__logo cursor-pointer"
                href="/"
                aria-label="Blanca Padel Home"
              >
                <svg
                  aria-hidden="true"
                  className="h-full w-auto block overflow-visible"
                  width="109"
                  height="21"
                  fill="none"
                  viewBox="0 0 109 21"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g className="origin-center">
                    <path
                      d="m17.09 18.42-1.84-1.02a7.01 7.01 0 0 1-8.84-4.92l-1.84-1.02a8.66 8.66 0 0 0 12.52 6.96Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.63 6.46a8.67 8.67 0 1 1 14.33 9.64l3.33 1.86-.85 1.52L1 7.55l.85-1.52L5.03 7.8c.16-.46.36-.9.6-1.34Zm12.88 8.84L6.48 8.6a7.06 7.06 0 0 1 10.15-4.08A7.04 7.04 0 0 1 18.5 15.3Z"
                      fill="currentColor"
                    />
                  </g>
                  <path
                    d="M33.02 17V4.4h4.47c2.68 0 4.17 1.3 4.17 3.33 0 1.44-.79 2.32-1.98 2.74 1.34.25 2.5 1.11 2.5 2.93 0 2.23-1.58 3.6-4.57 3.6h-4.59Zm4.54-11.18h-2.97v4.05h2.97c1.62 0 2.54-.75 2.54-2.03 0-1.26-.9-2.02-2.54-2.02Zm.05 5.46H34.6v4.3h3.02c1.95 0 2.97-.81 2.97-2.1 0-1.43-1.1-2.2-2.97-2.2ZM53.08 17h-7.3V4.4h1.56v11.16h5.74V17Zm3.94 0H55.4l4.8-12.6h1.86L66.85 17h-1.68l-1.33-3.4h-5.49L57.02 17Zm4.07-10.89-2.27 6.07h4.55L61.1 6.1ZM71.42 17H69.9V4.4h1.44l6.77 9.72V4.4h1.53V17H78.2l-6.77-9.72V17Zm17.7.1c-3.62 0-5.9-2.55-5.9-6.4 0-3.82 2.37-6.4 6.02-6.4 2.79 0 4.82 1.61 5.3 4.22h-1.66a3.62 3.62 0 0 0-3.71-2.79c-2.65 0-4.34 2.05-4.34 4.97 0 2.9 1.62 4.97 4.27 4.97 1.94 0 3.29-1.03 3.76-2.8h1.65c-.46 2.62-2.55 4.24-5.4 4.24Zm9.04-.1h-1.62l4.8-12.6h1.86L108 17h-1.67l-1.34-3.4H99.5L98.16 17Zm4.07-10.89-2.27 6.07h4.56l-2.3-6.07Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>

            {/* Sisi Tengah: Nav Links Desktop */}
            <nav className="hidden lg:flex items-center header__nav" aria-label="primary">
              <ul className="header__links flex items-center justify-center py-2 px-3 text-[#fcfcfc] text-base rounded-lg h-[43.9714px] leading-normal transition-all duration-300 hover:bg-[rgba(217,217,217,0.12)] hover:backdrop-blur-xl">
                <li className="h-[27.9818px] w-[93.4635px] leading-normal transition-all">
                  <a
                    className="header__link flex items-center justify-between py-1.5 pl-3 pr-4 text-[#fcfcfc] text-base font-light rounded h-[27.9818px] w-[93.4635px] leading-tight transition-all duration-150 hover:bg-[rgba(217,217,217,0.12)] active:scale-[0.98]"
                    href="/collections/racquets"
                  >
                    <span className="leading-tight transition-all">Racquets</span>
                  </a>
                </li>
                <li className="h-[27.9818px] w-[83.5677px] leading-normal transition-all">
                  <a
                    className="header__link flex items-center justify-between py-1.5 pl-3 pr-4 text-[#fcfcfc] text-base font-light rounded h-[27.9818px] w-[83.5677px] leading-tight transition-all duration-150 hover:bg-[rgba(217,217,217,0.12)] active:scale-[0.98]"
                    href="/collections/bundle"
                  >
                    <span className="leading-tight transition-all">Bundles</span>
                  </a>
                </li>
                <li className="h-[27.9818px] w-[112.539px] leading-normal transition-all">
                  <a
                    className="header__link flex items-center justify-between py-1.5 pl-3 pr-4 text-[#fcfcfc] text-base font-light rounded h-[27.9818px] w-[112.539px] leading-tight transition-all duration-150 hover:bg-[rgba(217,217,217,0.12)] active:scale-[0.98]"
                    href="/collections/accessories"
                  >
                    <span className="leading-tight transition-all">Accessories</span>
                  </a>
                </li>
                <li className="h-[27.9818px] w-[81.3281px] leading-normal transition-all">
                  <a
                    className="header__link flex items-center justify-between py-1.5 pl-3 pr-4 text-[#fcfcfc] text-base font-light rounded h-[27.9818px] w-[81.3281px] leading-tight transition-all duration-150 hover:bg-[rgba(217,217,217,0.12)] active:scale-[0.98]"
                    href="/collections/apparel"
                  >
                    <span className="leading-tight transition-all">Apparel</span>
                  </a>
                </li>
                <li className="h-[27.9818px] w-[118.164px] leading-normal transition-all">
                  <a
                    className="header__link flex items-center justify-between py-1.5 pl-3 pr-4 text-[#fcfcfc] text-base font-light rounded h-[27.9818px] w-[118.164px] leading-tight transition-all duration-150 hover:bg-[rgba(217,217,217,0.12)] active:scale-[0.98]"
                    href="/pages/find-a-club"
                  >
                    <span className="leading-tight transition-all">Trial our gear</span>
                  </a>
                </li>
                <li className="h-[27.9818px] w-[90.9375px] leading-normal transition-all">
                  <a
                    className="header__link flex items-center justify-between py-1.5 pl-3 pr-4 text-[#fcfcfc] text-base font-light rounded h-[27.9818px] w-[90.9375px] leading-tight transition-all duration-150 hover:bg-[rgba(217,217,217,0.12)] active:scale-[0.98]"
                    href="/pages/about-us"
                  >
                    <span className="leading-tight transition-all">About us</span>
                  </a>
                </li>
                <li className="h-[27.9818px] w-[76.8099px] leading-normal transition-all">
                  <a
                    className="header__link flex items-center justify-between py-1.5 pl-3 pr-4 text-[#fcfcfc] text-base font-light rounded h-[27.9818px] w-[76.8099px] leading-tight transition-all duration-150 hover:bg-[rgba(217,217,217,0.12)] active:scale-[0.98]"
                    href="/pages/players"
                  >
                    <span className="leading-tight transition-all">Players</span>
                  </a>
                </li>
                <li className="leading-normal transition-all">
                  <a
                    className="header__link hidden py-1.5 pl-3 pr-4 text-[#fcfcfc] text-base font-light rounded leading-tight transition-all duration-150 hover:bg-[rgba(217,217,217,0.12)] active:scale-[0.98]"
                    href="/account"
                  >
                    <span className="leading-tight transition-all">Your account</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Sisi Kanan: Menu Hamburger Mobile, Account & Cart */}
            <div className="flex-1 flex flex-row items-center justify-end gap-x-2">
              <button
                type="button"
                className="flex lg:hidden header__button relative cursor-pointer"
                onClick={() => setMobileMenu(!mobileMenu)}
                aria-label="Menu"
              >
                <span
                  className={`header__line transition-all duration-300 ${
                    mobileMenu ? 'rotate-45 translate-y-0' : '-translate-y-[6px]'
                  }`}
                />
                <span
                  className={`header__line transition-all duration-300 ${
                    mobileMenu ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`header__line transition-all duration-300 ${
                    mobileMenu ? '-rotate-45 translate-y-0' : 'translate-y-[6px]'
                  }`}
                />
              </button>

              <a
                href="/account"
                className="hidden lg:flex header__button cursor-pointer"
                aria-label="Account"
              >
                <svg
                  aria-hidden="true"
                  width="22"
                  height="22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.33 19.25v-1.83a3.67 3.67 0 0 0-3.66-3.67H7.33a3.67 3.67 0 0 0-3.66 3.67v1.83M11 10.08a3.67 3.67 0 1 0 0-7.33 3.67 3.67 0 0 0 0 7.33Z"
                    stroke="currentColor"
                  />
                </svg>
              </a>

              <a href="/cart" className="flex header__button relative cursor-pointer" aria-label="Cart">
                <svg
                  aria-hidden="true"
                  width="19"
                  height="19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.83 6.5a3.6 3.6 0 0 1-.97 2.47A3.25 3.25 0 0 1 9.5 10c-.88 0-1.73-.37-2.36-1.03a3.6 3.6 0 0 1-.97-2.47M2 3v12.25c0 .96.75 1.75 1.67 1.75h11.66c.45 0 .87-.18 1.18-.51.31-.33.49-.78.49-1.24V3H2Z"
                    stroke="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Center Flying Logo Animation (Initial GSAP Position) */}
      <div
        ref={centerLogoRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[94px] w-[114px] z-30 pointer-events-none"
      >
        <svg
          aria-hidden="true"
          className="h-full w-auto block overflow-visible"
          width="109"
          height="21"
          fill="none"
          viewBox="0 0 109 21"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g ref={ballRef} className="origin-center" style={{ transformBox: 'fill-box' }}>
            <path
              d="m17.09 18.42-1.84-1.02a7.01 7.01 0 0 1-8.84-4.92l-1.84-1.02a8.66 8.66 0 0 0 12.52 6.96Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.63 6.46a8.67 8.67 0 1 1 14.33 9.64l3.33 1.86-.85 1.52L1 7.55l.85-1.52L5.03 7.8c.16-.46.36-.9.6-1.34Zm12.88 8.84L6.48 8.6a7.06 7.06 0 0 1 10.15-4.08A7.04 7.04 0 0 1 18.5 15.3Z"
              fill="currentColor"
            />
          </g>
          <path
            d="M33.02 17V4.4h4.47c2.68 0 4.17 1.3 4.17 3.33 0 1.44-.79 2.32-1.98 2.74 1.34.25 2.5 1.11 2.5 2.93 0 2.23-1.58 3.6-4.57 3.6h-4.59Zm4.54-11.18h-2.97v4.05h2.97c1.62 0 2.54-.75 2.54-2.03 0-1.26-.9-2.02-2.54-2.02Zm.05 5.46H34.6v4.3h3.02c1.95 0 2.97-.81 2.97-2.1 0-1.43-1.1-2.2-2.97-2.2ZM53.08 17h-7.3V4.4h1.56v11.16h5.74V17Zm3.94 0H55.4l4.8-12.6h1.86L66.85 17h-1.68l-1.33-3.4h-5.49L57.02 17Zm4.07-10.89-2.27 6.07h4.55L61.1 6.1ZM71.42 17H69.9V4.4h1.44l6.77 9.72V4.4h1.53V17H78.2l-6.77-9.72V17Zm17.7.1c-3.62 0-5.9-2.55-5.9-6.4 0-3.82 2.37-6.4 6.02-6.4 2.79 0 4.82 1.61 5.3 4.22h-1.66a3.62 3.62 0 0 0-3.71-2.79c-2.65 0-4.34 2.05-4.34 4.97 0 2.9 1.62 4.97 4.27 4.97 1.94 0 3.29-1.03 3.76-2.8h1.65c-.46 2.62-2.55 4.24-5.4 4.24Zm9.04-.1h-1.62l4.8-12.6h1.86L108 17h-1.67l-1.34-3.4H99.5L98.16 17Zm4.07-10.89-2.27 6.07h4.56l-2.3-6.07Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Hero Content Section */}
      <section className="relative isolate h-[100vh] flex flex-row items-center justify-center mt-[-76px] lg:mt-[-92px] sm:pt-[76px] pt-[112px]">
        <div className="container h-full flex flex-col gap-[64px] z-10">
          {/* Spacer Atas */}
          <div className="grow basis-0 sm:block hidden" />

          {/* Title Hero dengan Split-Words Mask Reveal */}
          <div className="relative overflow-visible">
            <h1
              ref={titleRef}
              className="h1 w-full max-w-[1052px] mx-auto text-center opacity-0 !leading-[0.95]"
            >
              <div className="inline-block">
                <div className="overflow-hidden inline-block align-top">
                  <span
                    ref={(el) => {
                      wordsRef.current[0] = el
                    }}
                    className="word inline-block"
                    data-word="Minimal."
                  >
                    Minimal.
                  </span>
                </div>
              </div>
              <span className="hidden lg:inline-block w-4 sm:w-6">&nbsp;</span>
              <br className="lg:hidden" />
              <div className="inline-block">
                <div className="overflow-hidden inline-block align-top">
                  <span
                    ref={(el) => {
                      wordsRef.current[1] = el
                    }}
                    className="word inline-block"
                    data-word="Powerful."
                  >
                    Powerful.
                  </span>
                </div>
              </div>
              <br />
              <div className="inline-block">
                <div className="overflow-hidden inline-block align-top">
                  <span
                    ref={(el) => {
                      wordsRef.current[2] = el
                    }}
                    className="word inline-block"
                    data-word="Intentional."
                  >
                    Intentional.
                  </span>
                </div>
              </div>
            </h1>
          </div>

          {/* Outro Bawah: Deskripsi & CTA Button */}
          <div className="flex items-end grow basis-0 sm:pb-[40px] pb-[20px]">
            <div
              ref={outroRef}
              className="w-full mt-auto flex md:flex-row flex-col items-center justify-between gap-5 text-[#fcfcfc] text-base leading-normal transition-all opacity-0"
            >
              <p className="body text-[#bfbfbf] font-light leading-snug transition-all w-full max-w-[335px] max-md:text-center">
                At Blanca, we’re not about flash. We’re about the game. Our equipment is designed
                to be functional and cool but doesn’t need to shout. We’re for the players who prefer
                style in subtlety, and we’re bringing an accessible lineup that doesn’t compromise on
                quality.
              </p>

              <div>
                <a
                  className="icon-button relative flex items-center justify-center px-6 bg-[#f2d953] text-[#161616] text-center rounded-lg h-[55.9896px] w-[227.93px] leading-normal transition-all duration-150 hover:bg-[#e1ca4d] active:scale-[0.98] w-full md:w-[227.93px] max-md:justify-center cursor-pointer"
                  href="/collections/racquets"
                >
                  <span
                    className="absolute right-2 top-2 bottom-2 flex items-center justify-center bg-[#fcfcfc] text-center rounded w-10 h-10 leading-normal transition-all"
                    aria-hidden="true"
                  >
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 11 11 1m0 0v10m0-10H1" stroke="currentColor" />
                    </svg>
                  </span>
                  <span className="pr-12 text-center leading-normal transition-all">Shop our racquets</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Media Layer with Mix-Blend-Screen, Native Spotlight, and Gradient Masks */}
        <div
          ref={videoRef}
          className="absolute isolate sm:top-0 top-[33vh] left-1/2 -translate-x-1/2 w-full sm:h-full h-[40vh] opacity-0 scale-110 pointer-events-none before:absolute before:z-[10] before:bottom-0 before:left-0 before:w-full before:h-[100px] before:bg-gradient-to-t before:from-[#161616] before:via-[#161616]/40 before:to-transparent after:absolute after:z-[10] after:top-0 after:left-0 after:w-full after:h-[100px] after:bg-gradient-to-b after:from-[#161616] after:via-[#161616]/40 after:to-transparent"
        >
          {/* Spotlight Ambient (Sorot Tengah Statis) */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.04) 50%, transparent 80%)',
            }}
          />

          {/* Spotlight Interaktif (Mengikuti Kursor Mouse Native) */}
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
            style={{
              opacity: 'var(--spotlight-opacity, 0.5)',
              background:
                'radial-gradient(450px circle at var(--spotlight-x, 50%) var(--spotlight-y, 45%), rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.06) 45%, transparent 75%)',
            }}
          />

          {/* Hero SVG Image */}
          <img
            src={heroSvg}
            alt="Blanca Padel Hero"
            className="relative z-[1] w-full h-full object-contain sm:object-cover mix-blend-screen opacity-70 select-none"
          />
        </div>
      </section>

      {/* Bottom Floating Action Button (FAB): Quiz Popup */}
      <div className="fixed z-30 left-0 bottom-0 w-full flex flex-row items-center justify-center pointer-events-none">
        <div className="absolute left-0 bottom-0 w-full h-[88px] md:h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div
          onClick={() => setQuizOpen(true)}
          className="pt-[11.008px] pb-[13.008px] pl-5 pr-[111.008px] bg-[#d9d9d9]/[0.12] hover:bg-[#d9d9d9]/[0.22] rounded-t-[8px] relative group backdrop-blur-md h-[54.0104px] leading-normal transition-all duration-200 cursor-pointer pointer-events-auto select-none"
        >
          <div className="absolute -top-[15px] right-[10px] bottom-0 w-[89px] h-auto pointer-events-none group-hover:scale-[1.075] transition-transform duration-300 origin-bottom">
            <img
              className="h-[67.0964px] w-[88.9974px] object-contain object-bottom leading-normal transition-all"
              alt="Find your racquet"
              src="/assets/blanca/quiz-button.png"
              width="191"
              height="144"
            />
          </div>
          <div className="flex flex-col items-start h-[30px] w-[124.01px] leading-tight transition-all">
            <button
              type="button"
              className="text-left h-[16.0026px] text-base text-[#fcfcfc] font-normal leading-tight transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              Find your racquet
            </button>
            <span className="text-[#bfbfbf] text-sm font-light leading-tight transition-all mt-0.5">
              and get a discount
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {quizOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-end md:items-center justify-center p-0 md:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#161616]/[0.6] backdrop-blur-[7px] transition-opacity duration-300"
            onClick={() => setQuizOpen(false)}
          />
          <div className="relative w-full md:max-w-[586px] max-md:rounded-t-[8px] md:rounded-[8px] bg-[#fcfcfc] text-[#161616] p-6 md:p-8 z-10 shadow-2xl transition-all duration-300">
            <button
              type="button"
              onClick={() => setQuizOpen(false)}
              className="absolute top-4 md:top-6 right-4 md:right-6 w-10 h-10 flex items-center justify-center rounded-[8px] border border-neutral-300 hover:border-black hover:bg-neutral-100 transition-colors text-neutral-800 cursor-pointer"
              aria-label="Close quiz"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m6 6 12 12M6 18 18 6" />
              </svg>
            </button>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Quiz</span>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Find your perfect racquet</h2>
              <p className="text-neutral-600 text-sm md:text-base">
                And get 10% off on your purchase
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="/collections/racquets"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#161616] text-[#fcfcfc] rounded-md font-normal hover:bg-neutral-800 transition-colors text-center"
                >
                  Take the quiz
                </a>
                <button
                  type="button"
                  onClick={() => setQuizOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-md font-normal hover:bg-neutral-100 transition-colors text-neutral-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
