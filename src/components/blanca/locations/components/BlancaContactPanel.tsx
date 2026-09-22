// PERAN FILE: Pure UI Panel Kanan (Header Pencarian, List Kontak, & Footer Kasir)
import type { ContactCardItem, ArenaVenue } from '../types'
import BlancaContactCard from './BlancaContactCard'

interface BlancaContactPanelProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  contacts: ContactCardItem[]
  venueData: ArenaVenue
  onFocusMap: () => void
}

export default function BlancaContactPanel({
  searchQuery,
  onSearchChange,
  contacts,
  venueData,
  onFocusMap,
}: BlancaContactPanelProps) {
  return (
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

        {/* Input Pencarian Kontak */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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

      {/* Daftar Kartu Kontak 1:1 Khas Blanca */}
      <ul id="map-results" className="flex-1 overflow-y-auto divide-y divide-[#444444]">
        {contacts.length === 0 ? (
          <li className="p-8 text-center text-[#8e8e8e] text-sm">
            Tidak ada kontak atau venue yang cocok dengan pencarian "{searchQuery}".
          </li>
        ) : (
          contacts.map((item) => (
            <BlancaContactCard
              key={item.id}
              item={item}
              onFocusMap={onFocusMap}
            />
          ))
        )}
      </ul>

      {/* Footer Hotline Bantuan Kasir */}
      <div className="p-4 border-t border-[#444444] bg-[#141517] flex items-center justify-between text-xs shrink-0">
        <span className="text-[#8e8e8e]">Butuh bantuan cepat kasir?</span>
        <a
          href={`tel:${venueData.phone.replace(/[^0-9+]/g, '')}`}
          className="text-[#f2d953] hover:underline font-medium flex items-center gap-1"
        >
          <span>Telepon Kasir ({venueData.phone})</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>
  )
}
