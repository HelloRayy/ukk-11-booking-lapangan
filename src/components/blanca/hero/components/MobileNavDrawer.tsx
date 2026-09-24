// PERAN FILE: Pure UI Mobile Navigation Drawer Dropdown Blanca
import { NAV_LINKS } from '../data/navLinks'

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="lg:hidden bg-[#161616]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex flex-col gap-3">
      {NAV_LINKS.map((link) => (
        <a
          key={link.id}
          href={link.href}
          onClick={onClose}
          className={`py-2.5 text-base border-b border-white/5 flex items-center justify-between transition-colors ${
            link.href === '/reservasi'
              ? 'text-white font-medium hover:text-white'
              : 'font-light text-[#fcfcfc]/80 hover:text-white'
          }`}
        >
          <span>{link.label}</span>
          {link.href === '/reservasi' && (
            <span className="text-[11px] uppercase tracking-wider bg-white text-black font-semibold px-2 py-0.5 rounded">
              Book
            </span>
          )}
        </a>
      ))}
      <a
        href="/kasir"
        onClick={onClose}
        className="py-2.5 text-base font-light text-[#fcfcfc]/80 hover:text-white flex items-center justify-between transition-colors"
      >
        <span>Panel Kasir / Petugas</span>
        <span className="text-[11px] uppercase tracking-wider bg-white/10 text-white/70 px-2 py-0.5 rounded">
          Staff
        </span>
      </a>
    </div>
  )
}
