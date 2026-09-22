import { useState } from 'react'

interface HeaderNavProps {
  headerRef: React.RefObject<HTMLDivElement | null>
  headerLogoRef: React.RefObject<HTMLAnchorElement | null>
  isScrolled: boolean
}

export default function HeaderNav({ headerRef, headerLogoRef, isScrolled }: HeaderNavProps) {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full" ref={headerRef}>
      <div className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
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

          {/* Sisi Tengah: Nav Links Desktop Pill */}
          <nav className="hidden lg:flex items-center header__nav px-4 h-full" aria-label="primary">
            <ul className="header__links flex items-center justify-center gap-x-1 text-[#fcfcfc] text-base leading-normal">
              <li className="h-[28px] leading-normal transition-all">
                <a className="header__link" href="/collections/racquets">
                  <span className="leading-tight transition-all">Racquets</span>
                </a>
              </li>
              <li className="h-[28px] leading-normal transition-all">
                <a className="header__link" href="/collections/bundle">
                  <span className="leading-tight transition-all">Bundles</span>
                </a>
              </li>
              <li className="h-[28px] leading-normal transition-all">
                <a className="header__link" href="/collections/accessories">
                  <span className="leading-tight transition-all">Accessories</span>
                </a>
              </li>
              <li className="h-[28px] leading-normal transition-all">
                <a className="header__link" href="/collections/apparel">
                  <span className="leading-tight transition-all">Apparel</span>
                </a>
              </li>
              <li className="h-[28px] leading-normal transition-all">
                <a className="header__link" href="/pages/find-a-club">
                  <span className="leading-tight transition-all">Trial our gear</span>
                </a>
              </li>
              <li className="h-[28px] leading-normal transition-all">
                <a className="header__link" href="/pages/about-us">
                  <span className="leading-tight transition-all">About us</span>
                </a>
              </li>
              <li className="h-[28px] leading-normal transition-all">
                <a className="header__link" href="/pages/players">
                  <span className="leading-tight transition-all">Players</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Sisi Kanan: Menu Hamburger Mobile, Account & Cart Buttons */}
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
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 22 22"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.33 19.25v-1.83a3.67 3.67 0 0 0-3.66-3.67H7.33a3.67 3.67 0 0 0-3.66 3.67v1.83M11 10.08a3.67 3.67 0 1 0 0-7.33 3.67 3.67 0 0 0 0 7.33Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a href="/cart" className="flex header__button relative cursor-pointer" aria-label="Cart">
              <svg
                aria-hidden="true"
                width="19"
                height="19"
                fill="none"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.83 6.5a3.6 3.6 0 0 1-.97 2.47A3.25 3.25 0 0 1 9.5 10c-.88 0-1.73-.37-2.36-1.03a3.6 3.6 0 0 1-.97-2.47M2 3v12.25c0 .96.75 1.75 1.67 1.75h11.66c.45 0 .87-.18 1.18-.51.31-.33.49-.78.49-1.24V3H2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenu && (
        <div className="lg:hidden bg-[#161616]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex flex-col gap-3">
          <a
            href="/collections/racquets"
            onClick={() => setMobileMenu(false)}
            className="py-2 text-base font-light text-[#fcfcfc] border-b border-white/5 hover:text-white"
          >
            Racquets
          </a>
          <a
            href="/collections/bundle"
            onClick={() => setMobileMenu(false)}
            className="py-2 text-base font-light text-[#fcfcfc] border-b border-white/5 hover:text-white"
          >
            Bundles
          </a>
          <a
            href="/collections/accessories"
            onClick={() => setMobileMenu(false)}
            className="py-2 text-base font-light text-[#fcfcfc] border-b border-white/5 hover:text-white"
          >
            Accessories
          </a>
          <a
            href="/collections/apparel"
            onClick={() => setMobileMenu(false)}
            className="py-2 text-base font-light text-[#fcfcfc] border-b border-white/5 hover:text-white"
          >
            Apparel
          </a>
          <a
            href="/pages/find-a-club"
            onClick={() => setMobileMenu(false)}
            className="py-2 text-base font-light text-[#fcfcfc] border-b border-white/5 hover:text-white"
          >
            Trial our gear
          </a>
          <a
            href="/pages/about-us"
            onClick={() => setMobileMenu(false)}
            className="py-2 text-base font-light text-[#fcfcfc] border-b border-white/5 hover:text-white"
          >
            About us
          </a>
          <a
            href="/pages/players"
            onClick={() => setMobileMenu(false)}
            className="py-2 text-base font-light text-[#fcfcfc] border-b border-white/5 hover:text-white"
          >
            Players
          </a>
          <a
            href="/account"
            onClick={() => setMobileMenu(false)}
            className="py-2 text-base font-light text-[#fcfcfc] hover:text-white"
          >
            Your account
          </a>
        </div>
      )}
    </header>
  )
}
