import { ChevronDown, ArrowLeft } from 'lucide-react'
import { formatDisplayDate } from '../utils/formatters'

interface ReservationNavbarProps {
  customerName?: string
  selectedDate?: string
  onDateChange?: (date: string) => void
}

export default function ReservationNavbar({ customerName, selectedDate, onDateChange }: ReservationNavbarProps) {
  const handleBack = () => {
    window.location.href = '/'
  }

  const displayDate = selectedDate ? formatDisplayDate(selectedDate) : 'Pilih Tanggal'

  return (
    <header className="h-16 border-b border-[#262626] bg-[#161616] px-3 sm:px-6 flex items-center justify-between shrink-0 select-none z-40 relative">
      {/* Kiri: Tombol Kembali & Tanggal Aktif */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-white/5 hover:bg-white/10 text-xs text-[#a3a3a3] hover:text-white transition-colors cursor-pointer border border-white/10 shrink-0"
          aria-label="Kembali ke beranda"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Beranda</span>
        </button>

        {/* Date Selector: Teks Tanggal Bersih dengan Native Datepicker */}
        <label className="relative flex items-center gap-2 text-white font-aeonik font-medium text-base sm:text-xl cursor-pointer hover:text-[#f2d953] transition-colors group">
          <span className="truncate">{displayDate}</span>
          <ChevronDown className="w-4 h-4 text-[#a3a3a3] group-hover:text-[#f2d953] transition-colors shrink-0" />
          {onDateChange && selectedDate && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  onDateChange(e.target.value)
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Pilih tanggal reservasi"
            />
          )}
        </label>
      </div>

      {/* Kanan: Info Pemesan */}
      <div className="flex items-center gap-3">
        {customerName && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
            <span className="text-white font-medium">{customerName}</span>
          </div>
        )}
      </div>
    </header>
  )
}
