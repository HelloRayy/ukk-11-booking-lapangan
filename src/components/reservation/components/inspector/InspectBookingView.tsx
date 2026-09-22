// PERAN FILE: Tampilan inspeksi rincian jadwal yang telah terisi / dipesan oleh pengguna
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
      <div>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <span className="text-xs text-[#8e8e8e]">
            {isMaintenance ? 'Maintenance' : 'Terisi'}
          </span>
        </div>

        {/* Banner Lapangan */}
        <div className="relative h-[150px] rounded-[14px] overflow-hidden mb-6 border border-white/10 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80"
            alt={selectedBooking.courtName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 text-xs px-2.5 py-1 rounded-[6px] bg-black/70 backdrop-blur-md text-white font-medium border border-white/15">
            {selectedBooking.courtName}
          </span>
        </div>

        {/* Detail Pemesan */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-xs text-[#a3a3a3] block mb-1">
              Jadwal Tidak Tersedia
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
              {selectedBooking.customerName}
            </h2>
            <p className="text-sm text-[#8e8e8e]">
              {selectedBooking.date}, {selectedBooking.startTime}–{selectedBooking.endTime}
            </p>
          </div>

          <div className="w-12 h-12 rounded-[12px] bg-[#2a2a2a] border border-white/15 text-white flex items-center justify-center text-lg font-bold shrink-0">
            {selectedBooking.avatarInitials || getInitials(selectedBooking.customerName)}
          </div>
        </div>

        <div className="p-4 rounded-[12px] bg-white/[0.03] border border-white/10 mb-6 text-sm text-[#a3a3a3] leading-relaxed">
          Slot pada jam ini telah dipesan. Silakan pilih slot lain yang masih berstatus kosong pada tabel kalender.
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-4 border-t border-[#262626] space-y-2">
        {selectedBooking.invoiceNumber && (
          <button
            type="button"
            onClick={onViewReceipt}
            className="w-full h-11 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>Lihat Bukti Reservasi / Struk</span>
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className={`w-full ${
            selectedBooking.invoiceNumber
              ? 'h-10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10'
              : 'h-12 bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-semibold'
          } rounded-[10px] transition-colors cursor-pointer`}
        >
          Kembali ke Panduan
        </button>
      </div>
    </div>
  )
}
