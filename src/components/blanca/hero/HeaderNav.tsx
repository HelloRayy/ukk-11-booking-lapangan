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

            {/* Tombol CTA Book Now */}
            <a
              href="/reservasi"
              className="flex items-center justify-center h-[38px] px-3.5 sm:px-4 rounded-[6px] bg-white text-black hover:bg-[#eaeaea] active:scale-[0.98] transition-all text-xs tracking-wider font-semibold uppercase shadow-sm whitespace-nowrap"
            >
              Book Now
            </a>

            {/* Tombol Panel Kasir / Petugas */}
            <a
              href="/kasir"
              className="hidden lg:flex header__button cursor-pointer"
              aria-label="Panel Kasir"
              title="Panel Kasir / Petugas"
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
