// PERAN FILE: Root Coordinator Header Navigation Blanca (Modular Feature-Folder)
import { useState } from 'react'
import HeaderLogo from './components/HeaderLogo'
import DesktopNavLinks from './components/DesktopNavLinks'
import MobileNavDrawer from './components/MobileNavDrawer'

interface HeaderNavProps {
  headerRef: React.RefObject<HTMLDivElement | null>
  headerLogoRef: React.RefObject<HTMLAnchorElement | null>
  isScrolled: boolean
  onOpenReservation?: () => void
}

export default function HeaderNav({
  headerRef,
  headerLogoRef,
  isScrolled,
  onOpenReservation,
}: HeaderNavProps) {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full" ref={headerRef}>
      <div className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="header__bar">
          {/* Sisi Kiri: Logo Header Blanca */}
          <HeaderLogo headerLogoRef={headerLogoRef} />

          {/* Sisi Tengah: Nav Links Desktop Pill */}
          <DesktopNavLinks onOpenReservation={onOpenReservation} />

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

            {/* Tombol CTA Book Now (Membuka Side Panel Drawer di LP) */}
            <button
              type="button"
              onClick={onOpenReservation}
              className="flex items-center justify-center h-[38px] px-3.5 sm:px-4 rounded-[6px] bg-white text-black hover:bg-[#eaeaea] active:scale-[0.98] transition-all text-xs tracking-wider font-semibold uppercase shadow-sm whitespace-nowrap cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <MobileNavDrawer
        isOpen={mobileMenu}
        onClose={() => setMobileMenu(false)}
        onOpenReservation={onOpenReservation}
      />
    </header>
  )
}
