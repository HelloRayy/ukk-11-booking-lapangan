// PERAN FILE: Pure UI Desktop Pill Navigation Links Blanca
import { NAV_LINKS } from '../data/navLinks'

interface DesktopNavLinksProps {
  onOpenReservation?: () => void
}

export default function DesktopNavLinks({ onOpenReservation }: DesktopNavLinksProps) {
  return (
    <nav className="hidden lg:flex items-center header__nav px-4 h-full" aria-label="primary">
      <ul className="header__links flex items-center justify-center gap-x-1 text-[#fcfcfc] text-base leading-normal">
        {NAV_LINKS.map((link) => (
          <li key={link.id} className="h-[28px] leading-normal transition-all">
            {link.href === '/reservasi' ? (
              <button
                type="button"
                onClick={onOpenReservation}
                className="header__link cursor-pointer bg-transparent border-0 p-0 text-inherit font-inherit"
              >
                <span className="leading-tight transition-all">{link.label}</span>
              </button>
            ) : (
              <a className="header__link" href={link.href}>
                <span className="leading-tight transition-all">{link.label}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
