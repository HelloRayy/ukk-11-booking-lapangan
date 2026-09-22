// PERAN FILE: Pure UI Desktop Pill Navigation Links Blanca
import { NAV_LINKS } from '../data/navLinks'

export default function DesktopNavLinks() {
  return (
    <nav className="hidden lg:flex items-center header__nav px-4 h-full" aria-label="primary">
      <ul className="header__links flex items-center justify-center gap-x-1 text-[#fcfcfc] text-base leading-normal">
        {NAV_LINKS.map((link) => (
          <li key={link.id} className="h-[28px] leading-normal transition-all">
            <a className="header__link" href={link.href}>
              <span className="leading-tight transition-all">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
