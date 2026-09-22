// PERAN FILE: Data Statis Rute & Link Navigasi Header Blanca
export interface NavLinkItem {
  id: string
  label: string
  href: string
}

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'racquets', label: 'Racquets', href: '/collections/racquets' },
  { id: 'bundles', label: 'Bundles', href: '/collections/bundle' },
  { id: 'accessories', label: 'Accessories', href: '/collections/accessories' },
  { id: 'apparel', label: 'Apparel', href: '/collections/apparel' },
  { id: 'find-a-club', label: 'Trial our gear', href: '#locations' },
  { id: 'about-us', label: 'About us', href: '#courts' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
]
