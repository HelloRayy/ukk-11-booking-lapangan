// PERAN FILE: Data Statis Venue Arena & Kontak Resmi Blanca Badminton
import type { ArenaVenue, ContactCardItem } from '../types'

export const VENUE_DATA: ArenaVenue = {
  id: 'blanca-arena-central',
  name: 'Blanca Badminton Arena - Central Venue',
  address: 'Jl. Boulevard Raya No. 88, Tebet, Jakarta Selatan 12810',
  city: 'Jakarta Selatan',
  district: 'DKI Jakarta',
  lat: -6.2255,
  lng: 106.855,
  courtsCount: 6,
  phone: '+62 812-3456-7890',
  whatsapp: '6281234567890',
  email: 'booking@blanca-arena.id',
  instagram: '@blanca.arena',
  hours: 'Senin - Minggu: 07.00 - 23.00 WIB',
  googleMapsUrl: 'https://maps.google.com/?q=-6.2255,106.8550',
}

export const CONTACT_ITEMS: ContactCardItem[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Admin Booking',
    address: '+62 812-3456-7890 • Konfirmasi DP 50%, jadwal kosong & kasir arena',
    image: '/assets/blanca/difference-poster.jpg',
    href: `https://wa.me/${VENUE_DATA.whatsapp}?text=Halo%20Admin%20Blanca%2C%20saya%20ingin%20reservasi%20lapangan%20badminton`,
  },
  {
    id: 'instagram',
    title: 'Instagram @blanca.arena',
    address: 'Info turnamen mingguan, update jadwal sparring & highlight pemain',
    image: '/assets/blanca/tech-lifestyle.jpg',
    href: 'https://instagram.com',
  },
  {
    id: 'email',
    title: 'Email Reservasi & Event',
    address: 'booking@blanca-arena.id • Sewa hall penuh, event kantor & invoice resmi',
    image: '/assets/blanca/orang-1.webp',
    href: `mailto:${VENUE_DATA.email}`,
  },
  {
    id: 'venue',
    title: 'Blanca Badminton Arena',
    address: 'Jl. Boulevard Raya No. 88, Tebet, Jakarta Selatan 12810',
    image: '/assets/blanca/tech-carbon.webp',
    href: VENUE_DATA.googleMapsUrl,
    isMapAction: true,
  },
]
