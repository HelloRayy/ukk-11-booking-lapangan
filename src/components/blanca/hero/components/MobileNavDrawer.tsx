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
          className="py-2 text-base font-light text-[#fcfcfc] border-b border-white/5 hover:text-white"
        >
          {link.label}
        </a>
      ))}
      <a
        href="/account"
        onClick={onClose}
        className="py-2 text-base font-light text-[#fcfcfc] hover:text-white"
      >
        Your account
      </a>
    </div>
  )
}
