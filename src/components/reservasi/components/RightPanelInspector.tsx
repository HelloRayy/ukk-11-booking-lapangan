// PERAN FILE: Panel Samping Kanan (Inspector Panel) Berorientasi User / Pembeli (User POV)
import { useState } from 'react'
import type { BookingItem, SlotRangeSelection, PaymentType, RightPanelMode } from '../types'

interface RightPanelInspectorProps {
  panelMode: RightPanelMode
  selectedBooking: BookingItem | null
  selectedSlot: SlotRangeSelection | null
  customerName?: string
  customerWhatsapp?: string
  customerEmail?: string
  onClose: () => void
  onCreateBooking: (paymentType: PaymentType, notes?: string) => void
}

export default function RightPanelInspector({
  panelMode,
  selectedBooking,
  selectedSlot,
  customerName,
  customerWhatsapp,
  customerEmail,
  onClose,
  onCreateBooking,
}: RightPanelInspectorProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>('dp')
  const [notes, setNotes] = useState('')

  // Case 1: Empty State (User POV: Panduan Pemilihan Jam)
  if (panelMode === 'empty') {
    return (
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-8 flex flex-col justify-center items-center text-center shrink-0 select-none">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#f2d953] mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Pilih Jam Bermain Anda</h3>
        <p className="text-sm text-[#8e8e8e] max-w-xs leading-relaxed mb-6">
          Klik jam mulai (misal jam 13:00) lalu klik jam selesai (misal jam 17:00). Sistem akan otomatis memilih seluruh jam di antaranya (13, 14, 15, 16, 17).
        </p>
        <span className="text-xs px-3.5 py-1.5 rounded-full bg-[#f2d953]/10 border border-[#f2d953]/30 text-[#f2d953] font-mono">
          Klik slot kosong untuk mulai
        </span>
      </aside>
    )
  }

  // Case 2: Inspect Existing Booking (User POV: Melihat Jadwal Pemain Lain / Tidak Tersedia)
  if (panelMode === 'inspect' && selectedBooking) {
    const isMaintenance = selectedBooking.status === 'maintenance'

    return (
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-6 flex flex-col justify-between overflow-y-auto shrink-0 animate-in fade-in duration-200 select-none">
        <div>
          {/* Top Bar: Tombol Close X */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup panel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <span className="text-xs text-[#8e8e8e] font-mono uppercase tracking-wider">
              {isMaintenance ? 'Perawatan Rutin' : 'Jadwal Terisi'}
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

          {/* Info Jadwal yang Sudah Terisi */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-xs text-red-400 font-medium uppercase tracking-wider block mb-1">
                Jadwal Tidak Tersedia
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                {selectedBooking.customerName}
              </h2>
              <p className="text-sm text-[#8e8e8e]">
                {selectedBooking.date}, {selectedBooking.startTime}–{selectedBooking.endTime}
              </p>
            </div>

            <div className="w-12 h-12 rounded-[12px] bg-[#2a2a2a] border border-white/15 text-white flex items-center justify-center text-lg font-bold font-mono shrink-0">
              {selectedBooking.avatarInitials || 'BS'}
            </div>
          </div>

          {/* Kotak Pemberitahuan User POV */}
          <div className="p-4 rounded-[12px] bg-white/[0.03] border border-white/10 mb-6 text-sm text-[#a3a3a3] leading-relaxed">
            Slot pada jam ini telah dipesan untuk sesi bermain. Silakan cari dan klik slot lain yang masih berstatus kosong pada tabel kalender.
          </div>
        </div>

        {/* Tombol Aksi User POV */}
        <div className="pt-4 border-t border-[#262626]">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-semibold transition-colors cursor-pointer shadow-md"
          >
            Cari Slot Kosong Lain
          </button>
        </div>
      </aside>
    )
  }

  // Case 3: Create New Reservation Form dengan Dukungan Rentang Jam (User POV)
  if (panelMode === 'create' && selectedSlot) {
    const finalCustomerName = customerName || 'Calon Penyewa'
    const finalWhatsapp = customerWhatsapp || '08123456789'
    const dpAmount = selectedSlot.totalPrice * 0.5

    return (
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-6 flex flex-col justify-between overflow-y-auto shrink-0 animate-in fade-in duration-200 select-none">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Batal pemilihan"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <span className="text-xs text-[#f2d953] font-mono uppercase tracking-wider font-semibold">
              Rincian Booking Anda
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
            Konfirmasi Jadwal
          </h2>
          <p className="text-sm text-[#8e8e8e] mb-6">
            {selectedSlot.totalHours > 1
              ? `Anda memilih durasi ${selectedSlot.totalHours} jam bermain berurutan.`
              : 'Klik jam lain di tabel jika ingin memperpanjang durasi bermain.'}
          </p>

          {/* Ringkasan Slot Rentang Jam Terpilih */}
          <div className="p-4 rounded-[12px] bg-[#222222] border border-[#2f2f2f] mb-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-base font-bold text-white">{selectedSlot.courtName}</span>
              <span className="text-xs font-mono text-[#8e8e8e]">
                Rp {selectedSlot.pricePerHour.toLocaleString('id-ID')} / jam
              </span>
            </div>

            <div className="p-2.5 rounded-[8px] bg-white/[0.04] border border-white/5 mb-3 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#a3a3a3] block">WAKTU BERMAIN</span>
                <span className="text-sm font-semibold text-[#f2d953] font-mono">
                  {selectedSlot.startTime} - {selectedSlot.endTime}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[#f2d953]/15 text-[#f2d953] font-bold font-mono">
                {selectedSlot.totalHours} Jam
              </span>
            </div>

            {/* Chip Urutan Jam Terpilih (1, 2, 3, 4, 5) */}
            <div>
              <span className="text-[11px] text-[#737373] block mb-1.5 uppercase tracking-wider">
                SLOT JAM TERPILIH OTOMATIS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSlot.selectedHours.map((hr) => (
                  <span
                    key={hr}
                    className="px-2 py-0.5 rounded bg-white/10 text-white text-xs font-mono font-medium border border-white/10"
                  >
                    {hr}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rincian Total Harga */}
          <div className="p-4 rounded-[12px] bg-[#222222] border border-[#2f2f2f] mb-4">
            <div className="flex justify-between text-xs text-[#a3a3a3] mb-1.5">
              <span>Subtotal ({selectedSlot.totalHours} jam × Rp {selectedSlot.pricePerHour.toLocaleString('id-ID')}):</span>
              <span className="text-white font-mono">Rp {selectedSlot.totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
              <span>Total Tagihan:</span>
              <span className="text-[#f2d953] font-mono text-base">
                Rp {selectedSlot.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Pilihan Opsi Pembayaran (Poin Kisi-Kisi UKK) */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider block mb-3">
              PILIH OPSI PEMBAYARAN
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Opsi DP 50% */}
              <div
                onClick={() => setPaymentType('dp')}
                className={`p-3 rounded-[10px] border cursor-pointer transition-all ${
                  paymentType === 'dp'
                    ? 'bg-[#f2d953]/10 border-[#f2d953] text-white shadow-sm'
                    : 'bg-[#222222] border-[#333333] text-[#a3a3a3] hover:border-[#555555]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Bayar DP 50%</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${paymentType === 'dp' ? 'bg-[#f2d953]' : 'border border-gray-500'}`} />
                </div>
                <span className="text-sm font-bold text-white block font-mono">
                  Rp {dpAmount.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-[#8e8e8e] block mt-0.5">Sisa dilunasi di arena</span>
              </div>

              {/* Opsi Lunas 100% */}
              <div
                onClick={() => setPaymentType('lunas')}
                className={`p-3 rounded-[10px] border cursor-pointer transition-all ${
                  paymentType === 'lunas'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                    : 'bg-[#222222] border-[#333333] text-[#a3a3a3] hover:border-[#555555]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Bayar Lunas</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${paymentType === 'lunas' ? 'bg-emerald-400' : 'border border-gray-500'}`} />
                </div>
                <span className="text-sm font-bold text-white block font-mono">
                  Rp {selectedSlot.totalPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Langsung main bebas antre</span>
              </div>
            </div>
          </div>

          {/* Data Pemesan yang Diisi di Side Panel */}
          <div className="p-3.5 rounded-[10px] bg-white/[0.03] border border-white/5 mb-4 text-xs">
            <span className="text-[#8e8e8e] block mb-1">PEMESAN ATAS NAMA:</span>
            <div className="flex justify-between text-white font-medium">
              <span>{finalCustomerName}</span>
              <span className="font-mono text-[#a3a3a3]">{finalWhatsapp}</span>
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div className="mb-4">
            <label htmlFor="user_booking_notes" className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider block mb-2">
              CATATAN UNTUK ARENA (OPSIONAL)
            </label>
            <input
              id="user_booking_notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Siapkan 4 raket padel sewa"
              className="w-full h-11 px-3.5 rounded-[10px] bg-[#222222] border border-[#333333] text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#f2d953] transition-colors"
            />
          </div>
        </div>

        {/* Tombol Konfirmasi Booking Pembeli */}
        <div className="pt-4 border-t border-[#262626]">
          <button
            type="button"
            onClick={() => onCreateBooking(paymentType, notes)}
            className="w-full h-12 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-bold transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>
              Booking {selectedSlot.totalHours} Jam ({paymentType === 'dp' ? `DP Rp ${dpAmount.toLocaleString('id-ID')}` : `Lunas Rp ${selectedSlot.totalPrice.toLocaleString('id-ID')}`})
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>
    )
  }

  return null
}
