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

export default function BlancaLocations() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

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

  // Fungsi salin ke clipboard
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

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
        <div className="col-span-12 flex flex-col md:flex-row gap-[12px] mdw:gap-[16px] h-auto md:h-[650px] items-stretch">
          {/* Sisi Kiri: Peta Interaktif Leaflet Real-time */}
          <div className="bg-[#141517] border border-white/[0.08] grow w-full md:max-w-[calc(100%-380px)] mdw:max-w-[calc(100%-510px)] h-[360px] md:h-full rounded-[8px] overflow-hidden relative shadow-2xl">
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

          {/* Sisi Kanan: Panel Info Kontak Person & Operasional Lengkap */}
          <div className="w-full md:max-w-[380px] mdw:max-w-[504px] shrink-0 h-auto md:h-full flex flex-col bg-[#1c1c1c]/90 border border-white/[0.08] backdrop-blur-[7px] rounded-[8px] overflow-hidden shadow-2xl">
            {/* Header Panel Kontak */}
            <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#222]/40">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl sm:text-2xl font-normal text-white">
                  Contact & Operational Info
                </h3>
                {/* Badge Status Jam Operasional (Hijau Aktif) */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Buka Setiap Hari</span>
                </span>
              </div>
              <p className="text-xs text-[#8e8e8e] mt-1.5">
                {VENUE_DATA.hours}
              </p>
            </div>

            {/* Daftar Kontak Person & Alamat (Scrollable jika layar kecil) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3.5 divide-y divide-white/[0.06]">
              {/* 1. WhatsApp Admin Kasir (Prioritas Reservasi) */}
              <div className="pt-2 first:pt-0 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">WhatsApp Admin Booking</h4>
                      <p className="text-xs text-[#bfbfbf] font-mono mt-0.5">{VENUE_DATA.phone}</p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${VENUE_DATA.whatsapp}?text=Halo%20Admin%20Blanca%2C%20saya%20ingin%20reservasi%20lapangan%20badminton`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#f2d953] hover:bg-[#fcfbf6] text-[#161616] text-xs font-semibold rounded-[4px] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Chat WA</span>
                    <span className="text-[10px]">&rarr;</span>
                  </a>
                </div>
                <p className="text-[11px] text-[#8e8e8e] pl-[52px]">
                  Fast response untuk konfirmasi DP 50%, jadwal kosong, dan bukti transfer kasir.
                </p>
              </div>

              {/* 2. Instagram Resmi Komunitas & Dokumentasi */}
              <div className="pt-3.5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-[#E1306C]/10 border border-[#E1306C]/20 flex items-center justify-center text-[#E1306C] shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Instagram Resmi</h4>
                      <p className="text-xs text-[#bfbfbf] font-mono mt-0.5">{VENUE_DATA.instagram}</p>
                    </div>
                  </div>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold rounded-[4px] transition-all cursor-pointer"
                  >
                    <span>Follow</span>
                    <span className="text-[10px]">&rarr;</span>
                  </a>
                </div>
                <p className="text-[11px] text-[#8e8e8e] pl-[52px]">
                  Cek foto turnamen mingguan, jadwal sparring terbuka, dan highlight pemain.
                </p>
              </div>

              {/* 3. Email Resmi Kemitraan & Event Perusahaan */}
              <div className="pt-3.5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Email Reservasi & Event</h4>
                      <p className="text-xs text-[#bfbfbf] font-mono mt-0.5">{VENUE_DATA.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(VENUE_DATA.email, 'email')}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold rounded-[4px] transition-all cursor-pointer"
                  >
                    <span>{copiedField === 'email' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#8e8e8e] pl-[52px]">
                  Untuk sewa satu hall penuh, event gathering kantor, dan invoice penagihan resmi.
                </p>
              </div>

              {/* 4. Alamat Fisik Venue & Navigasi */}
              <div className="pt-3.5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[6px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#f2d953] shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Alamat Venue Arena</h4>
                      <p className="text-xs text-[#bfbfbf] mt-0.5 max-w-[220px] leading-snug">{VENUE_DATA.address}</p>
                    </div>
                  </div>

                  <a
                    href={VENUE_DATA.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#f2d953] hover:bg-[#fcfbf6] text-[#161616] text-xs font-semibold rounded-[4px] transition-all cursor-pointer"
                  >
                    <span>Rute</span>
                    <span className="text-[10px]">&rarr;</span>
                  </a>
                </div>
                <p className="text-[11px] text-[#8e8e8e] pl-[52px]">
                  Fasilitas: 6 Lapangan BWF, Parkir Luas, Hot Shower, Kantin & Player Lounge.
                </p>
              </div>
            </div>

            {/* Footer Kartu: Hotline Bantuan Langsung */}
            <div className="p-4 border-t border-white/[0.08] bg-[#141517] flex items-center justify-between text-xs">
              <span className="text-[#8e8e8e]">Butuh bantuan cepat kasir?</span>
              <a
                href={`tel:${VENUE_DATA.phone.replace(/[^0-9+]/g, '')}`}
                className="text-[#f2d953] hover:underline font-medium flex items-center gap-1"
              >
                <span>Telepon Kasir</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
