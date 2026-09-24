// PERAN FILE: Data Statis Rute & Link Navigasi Header Blanca
export interface NavLinkItem {
  id: string
  label: string
  href: string
  isExternal?: boolean
}

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'courts', label: 'Arena & Courts', href: '#courts' },
  { id: 'technology', label: 'Gear & Tech', href: '#technology' },
  { id: 'locations', label: 'Locations', href: '#locations' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
  { id: 'reservasi', label: 'Book Court', href: '/reservasi' },
]

