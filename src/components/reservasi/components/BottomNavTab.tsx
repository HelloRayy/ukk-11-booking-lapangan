// PERAN FILE: Bottom Navigation Bar Berorientasi Pembeli (Clean UI)
import type { SlotRangeSelection } from '../types'

interface BottomNavTabProps {
  selectedSlot: SlotRangeSelection | null
}

export default function BottomNavTab({ selectedSlot }: BottomNavTabProps) {
  return (
    <nav className="h-14 border-t border-[#262626] bg-[#161616] px-6 flex items-center justify-between shrink-0 select-none font-aeonik">
      {/* Kiri: Tab Status Aktif */}
      <div className="flex items-center gap-6 text-sm">
        <div className="relative py-4 text-white font-medium flex items-center gap-2">
          <span>Pilih Jadwal</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f2d953]" />
        </div>
      </div>

      {/* Kanan: Ringkasan Seleksi Aktif Pembeli */}
      <div className="flex items-center gap-3">
        {selectedSlot ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-[#f2d953]/15 border border-[#f2d953]/30 text-xs">
            <span className="text-white font-semibold">{selectedSlot.courtName}</span>
            <span className="text-[#8e8e8e]">•</span>
            <span className="text-[#f2d953] font-medium">
              {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.totalHours} Jam)
            </span>
            <span className="text-[#8e8e8e]">•</span>
            <span className="text-white font-semibold">
              Rp {selectedSlot.totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        ) : (
          <span className="text-xs text-[#737373] font-light hidden sm:inline">
            Pilih slot jam di tabel untuk mulai reservasi
          </span>
        )}
      </div>
    </nav>
  )
}
