// PERAN FILE: Tampilan inspeksi rincian jadwal yang telah terisi (Clean UI, Less Text)
import type { BookingItem } from '../../types'
import { getInitials } from '../../utils/formatters'

interface InspectBookingViewProps {
  selectedBooking: BookingItem
  onClose: () => void
  onViewReceipt: () => void
}

export default function InspectBookingView({
  selectedBooking,
  onClose,
  onViewReceipt,
}: InspectBookingViewProps) {
  const isMaintenance = selectedBooking.status === 'maintenance'

  return (
    <div className="flex flex-col justify-between h-full animate-in fade-in duration-200 select-none font-aeonik">
      <div className="space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Informasi Jadwal
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            aria-label="Tutup panel"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Kartu Ringkasan Terisi */}
        <div className="p-4 rounded-xl bg-[#202020] border border-[#2e2e2e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8e8e8e]">{selectedBooking.courtName}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
              isMaintenance
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-white/10 text-[#d4d4d4]'
            }`}>
              {isMaintenance ? 'Maintenance' : 'Terisi'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] border border-white/10 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {selectedBooking.avatarInitials || getInitials(selectedBooking.customerName)}
            </div>
            <div className="truncate">
              <span className="text-base font-bold text-white block truncate">
                {selectedBooking.customerName}
              </span>
              <span className="text-xs text-[#8e8e8e] block">
                {selectedBooking.date} • {selectedBooking.startTime}–{selectedBooking.endTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Aksi Bawah */}
      <div className="pt-3 border-t border-[#262626] space-y-2 mt-3">
        {selectedBooking.invoiceNumber && (
          <button
            type="button"
            onClick={onViewReceipt}
            className="w-full h-11 rounded-xl bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>Lihat Struk Digital</span>
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
