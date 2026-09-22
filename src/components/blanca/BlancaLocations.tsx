// PERAN FILE: Komponen Section Lokasi Arena & Kontak Person Lengkap Blanca Padel / Badminton
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface ArenaVenue {
  id: string
  name: string
  address: string
  city: string
  district: string
  lat: number
  lng: number
  courtsCount: number
  phone: string
  whatsapp: string
  email: string
  instagram: string
  hours: string
  googleMapsUrl: string
}

const VENUE_DATA: ArenaVenue = {
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

interface ContactCardItem {
  id: string
  title: string
  address: string
  image: string
  href: string
  isMapAction?: boolean
}

const CONTACT_ITEMS: ContactCardItem[] = [
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
    image: '/assets/blanca/tech-carbon.png',
    href: VENUE_DATA.googleMapsUrl,
    isMapAction: true,
  },
]

export default function BlancaLocations() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Inisialisasi Peta Leaflet dengan Dark Matter Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Inisialisasi peta berpusat pada koordinat arena
    const map = L.map(mapContainerRef.current, {
      center: [VENUE_DATA.lat, VENUE_DATA.lng],
      zoom: 14,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    })

    // Pasang Dark Matter Tiles CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Custom Icon Marker Khas Blanca dengan Badge Kuning
    const customIcon = L.divIcon({
      className: 'custom-blanca-marker',
      html: `
        <div class="relative group cursor-pointer flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <div class="w-10 h-10 rounded-full bg-[#f2d953] text-black shadow-2xl flex items-center justify-center font-bold text-sm border-2 border-white ring-4 ring-[#f2d953]/30 animate-pulse">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#f2d953" />
              <circle cx="12" cy="9" r="2.5" fill="#161616" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })

    const marker = L.marker([VENUE_DATA.lat, VENUE_DATA.lng], { icon: customIcon }).addTo(map)

    marker.bindPopup(`
      <div style="min-width: 220px; font-family: 'Aeonik Pro', -apple-system, sans-serif; color: #fcfcfc; background: #1a1a1a; padding: 4px;">
        <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #f2d953;">${VENUE_DATA.name}</h4>
        <p style="font-size: 12px; color: #bfbfbf; margin: 0 0 8px 0; line-height: 1.4;">${VENUE_DATA.address}</p>
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px; font-size: 11px; color: #a3a3a3;">
          <span>6 Lapangan BWF</span> • <span>500+ Lux LED</span>
        </div>
        <a href="${VENUE_DATA.googleMapsUrl}" target="_blank" rel="noreferrer" style="display: inline-block; background: #f2d953; color: #161616; padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; text-decoration: none;">Buka di Google Maps &rarr;</a>
      </div>
    `)

    markerRef.current = marker
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Fungsi aksi flyTo peta
  const focusOnMap = () => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([VENUE_DATA.lat, VENUE_DATA.lng], 16, { duration: 1.2 })
      markerRef.current.openPopup()
    }
  }

  const filteredContacts = CONTACT_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section
      id="locations"
      className="locations relative w-full text-[#fcfcfc] overflow-hidden pt-[64px] mdw:pt-[110px] pb-[80px] mdw:pb-[140px] font-aeonik"
    >
      <div id="find-a-club" className="absolute -top-[80px]" />

      <div className="container site-grid gap-y-[40px] mdw:gap-y-[80px] overflow-hidden">
        {/* Header Sisi Kiri: Judul Utama */}
        <div className="col-span-12 mdw:col-span-8">
          <span className="block preheading mb-[16px] md:mb-[24px]">Location & Contact</span>
          <h2 className="w-full max-w-[818px] text-[44px] sm:text-[56px] mdw:text-[76px] lg:text-[88px] font-normal leading-[1.02] tracking-[-1px] text-[#fcfcfc]">
            Blanca is much closer than you think
          </h2>
        </div>

        {/* Header Sisi Kanan: Paragraf Penjelas */}
        <div className="col-span-12 mdw:col-span-4 mdw:col-start-9 flex flex-col justify-end">
          <p className="text-[18px] mdw:text-[24px] text-[#bfbfbf] font-light leading-snug">
            Kunjungi arena kami langsung atau hubungi kontak person resmi untuk reservasi jadwal,
            sparing komunitas, dan kerja sama acara.
          </p>
        </div>

        {/* Layout Kontainer Utama (Peta di Kiri, Panel Kontak Person Lengkap di Kanan) */}
        <div className="col-span-12 flex flex-col lg:flex-row gap-[16px] h-auto lg:h-[680px] items-stretch">
          {/* Sisi Kiri: Peta Interaktif Leaflet Real-time */}
          <div className="bg-[#141517] border border-white/[0.08] grow w-full lg:w-[56%] h-[360px] lg:h-full rounded-[8px] overflow-hidden relative shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Tombol Cepat Fokus Arena di Peta */}
            <button
              type="button"
              onClick={focusOnMap}
              className="absolute top-4 left-4 z-[400] px-3.5 py-2 bg-[#1c1c1c]/90 hover:bg-[#2a2a2a] border border-white/10 rounded-md text-xs font-medium text-white flex items-center gap-2 backdrop-blur-md shadow-lg transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#f2d953]" />
              <span>Fokus Lokasi Arena</span>
            </button>

            {/* Watermark Mapbox / Carto */}
            <div className="absolute left-4 bottom-4 z-[400] flex items-center gap-1.5 bg-[#141517]/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 pointer-events-none opacity-80">
              <span className="text-xs font-semibold tracking-wider text-white">Leaflet / Carto Dark</span>
            </div>
          </div>

          {/* Sisi Kanan: Panel Info Kontak Person & Operasional 1:1 Khas Blanca */}
          <div className="w-full lg:w-[44%] lg:max-w-[560px] shrink-0 h-[600px] lg:h-full flex flex-col bg-[#1c1c1c]/90 border border-white/[0.08] backdrop-blur-[7px] rounded-[8px] overflow-hidden shadow-2xl">
            {/* Header & Search Bar Panel */}
            <div className="p-4 sm:p-6 border-b border-[#444444] bg-[#222]/40 shrink-0">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-xl sm:text-2xl font-normal text-white">
                  Find a Club / Contact
                </h3>
                {/* Badge Status Jam Operasional (Hijau Aktif) */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Buka Setiap Hari</span>
                </span>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kontak, WhatsApp, Instagram, arena..."
                  className="w-full bg-[#141414] border border-[#333] rounded-[6px] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-[#777] focus:outline-none focus:border-[#f2d953] transition-colors"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            {/* Daftar Kontak Person 1:1 Kartu Blanca */}
            <ul id="map-results" className="flex-1 overflow-y-auto divide-y divide-[#444444]">
              {filteredContacts.length === 0 ? (
                <li className="p-8 text-center text-[#8e8e8e] text-sm">
                  Tidak ada kontak atau venue yang cocok dengan pencarian "{searchQuery}".
                </li>
              ) : (
                filteredContacts.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-x-4 sm:gap-x-6 py-6 px-5 sm:py-8 sm:px-8 text-[#fcfcfc] text-base border-b border-[#444444] last:border-b-0 leading-normal transition-all hover:bg-white/[0.02]"
                  >
                    {/* Thumbnail 96x96 rounded-lg */}
                    <div className="rounded-lg h-[84px] w-[84px] sm:h-[96px] sm:w-[96px] overflow-hidden shrink-0 bg-[#242424] leading-normal transition-all">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover rounded-lg leading-normal transition-all"
                        loading="lazy"
                      />
                    </div>

                    {/* Tengah: Judul & Alamat / Deskripsi */}
                    <div className="flex-1 flex flex-col items-start gap-y-2 leading-normal transition-all min-w-0">
                      <h3 className="leading-normal transition-all w-full truncate">
                        {item.isMapAction ? (
                          <button
                            type="button"
                            onClick={focusOnMap}
                            className="inline-block text-left font-medium text-white text-base leading-normal hover:text-[#f2d953] transition-colors cursor-pointer truncate"
                          >
                            {item.title}
                          </button>
                        ) : (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-left font-medium text-white text-base leading-normal hover:text-[#f2d953] transition-colors cursor-pointer truncate"
                          >
                            {item.title}
                          </a>
                        )}
                      </h3>
                      <address className="text-[#bfbfbf] font-light leading-snug transition-all not-italic text-xs sm:text-sm line-clamp-2">
                        {item.address}
                      </address>
                      {/* Tombol Go versi Mobile */}
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') || item.href.startsWith('mailto') ? '_blank' : undefined}
                        rel="noreferrer"
                        onClick={item.isMapAction ? focusOnMap : undefined}
                        className="flex sm:hidden items-center justify-center px-4 bg-[#f2d953] text-[#161616] text-center rounded h-9 text-xs font-semibold leading-normal transition-all duration-150 hover:bg-[#e1ca4d] active:scale-[0.98] mt-1 cursor-pointer"
                      >
                        Go
                      </a>
                    </div>

                    {/* Tombol Go Khas Blanca di Sisi Kanan (Desktop) */}
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') || item.href.startsWith('mailto') ? '_blank' : undefined}
                      rel="noreferrer"
                      onClick={item.isMapAction ? focusOnMap : undefined}
                      className="hidden sm:flex shrink-0 items-center justify-center px-4 bg-[#f2d953] text-[#161616] text-center rounded h-10 w-[78px] leading-normal transition-all duration-150 hover:bg-[#e1ca4d] active:scale-[0.98] font-semibold text-sm cursor-pointer ml-auto"
                    >
                      <span className="text-center leading-normal transition-all">Go</span>
                    </a>
                  </li>
                ))
              )}
            </ul>

            {/* Footer Hotline Bantuan Kasir */}
            <div className="p-4 border-t border-[#444444] bg-[#141517] flex items-center justify-between text-xs shrink-0">
              <span className="text-[#8e8e8e]">Butuh bantuan cepat kasir?</span>
              <a
                href={`tel:${VENUE_DATA.phone.replace(/[^0-9+]/g, '')}`}
                className="text-[#f2d953] hover:underline font-medium flex items-center gap-1"
              >
                <span>Telepon Kasir ({VENUE_DATA.phone})</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

