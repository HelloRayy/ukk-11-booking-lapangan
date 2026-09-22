// PERAN FILE: Root Coordinator Header Navigation Blanca (Modular Feature-Folder)
import { useState } from 'react'
import HeaderLogo from './components/HeaderLogo'
import DesktopNavLinks from './components/DesktopNavLinks'
import MobileNavDrawer from './components/MobileNavDrawer'

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
          {/* Sisi Kiri: Logo Header Blanca */}
          <HeaderLogo headerLogoRef={headerLogoRef} />

          {/* Sisi Tengah: Nav Links Desktop Pill */}
          <DesktopNavLinks />

          {/* Sisi Kanan: Menu Hamburger Mobile, Account & Cart Buttons */}
          <div className="flex-1 flex flex-row items-center justify-end gap-x-2">
            {/* Tombol Toggle Mobile Hamburger */}
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

            {/* Tombol Akun Desktop */}
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

            {/* Tombol Keranjang Cart */}
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
      <MobileNavDrawer
        isOpen={mobileMenu}
        onClose={() => setMobileMenu(false)}
      />
    </header>
  )
}
