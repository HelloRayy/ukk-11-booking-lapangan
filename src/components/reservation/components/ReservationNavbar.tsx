import { formatDisplayDate } from '../utils/formatters'

interface ReservationNavbarProps {
  customerName?: string
  selectedDate?: string
  onDateChange?: (date: string) => void
}

export default function ReservationNavbar({ customerName, selectedDate, onDateChange }: ReservationNavbarProps) {
  const handleBack = () => {
    window.location.href = '/blanca.html'
  }

  const displayDate = selectedDate ? formatDisplayDate(selectedDate) : 'Wednesday, October 14'

  return (
    <header className="h-16 border-b border-[#262626] bg-[#161616] px-6 flex items-center justify-between shrink-0 select-none">
      {/* Kiri: Tombol Kembali & Tanggal Aktif */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-white/5 hover:bg-white/10 text-xs text-[#a3a3a3] hover:text-white transition-colors cursor-pointer border border-white/10"
          aria-label="Kembali ke beranda"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Beranda</span>
        </button>

        {/* Date Selector Indicator dengan Native Datepicker */}
        <label className="relative flex items-center gap-2 text-white font-aeonik font-medium text-lg sm:text-xl cursor-pointer hover:text-[#f2d953] transition-colors group">
          <span>{displayDate}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a3a3a3] group-hover:text-[#f2d953] transition-colors">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {onDateChange && selectedDate && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  onDateChange(e.target.value)
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
              aria-label="Pilih tanggal reservasi"
            />
          )}
        </label>
      </div>

      {/* Kanan: Info Akun Pemesan Bersih */}
      {customerName && (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
          <span className="text-white font-medium">{customerName}</span>
        </div>
      )}
    </header>
  )
}
