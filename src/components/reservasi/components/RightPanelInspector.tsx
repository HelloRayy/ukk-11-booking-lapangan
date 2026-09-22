// PERAN FILE: Panel Samping Kanan (Inspector Panel) 1:1 Persis Desain Referensi
import { useState } from 'react'
import type { BookingItem, EmptySlotSelection, PaymentType, RightPanelMode } from '../types'

interface RightPanelInspectorProps {
  panelMode: RightPanelMode
  selectedBooking: BookingItem | null
  selectedSlot: EmptySlotSelection | null
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

  // Case 1: Empty State (Tidak ada slot / booking yang dipilih)
  if (panelMode === 'empty') {
    return (
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-8 flex flex-col justify-center items-center text-center shrink-0 select-none">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#737373] mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Booking Inspector</h3>
        <p className="text-sm text-[#8e8e8e] max-w-xs leading-relaxed mb-6">
          Klik jadwal booking orang lain di kalender untuk melihat rincian pemesan, atau klik slot kosong untuk membuat reservasi baru.
        </p>
        <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#a3a3a3]">
          Menunggu pilihan slot
        </span>
      </aside>
    )
  }

  // Case 2: Inspect Existing Booking (Lihat info pemesan 1:1 referensi)
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
              {isMaintenance ? 'Slot Khusus' : 'Detail Reservasi'}
            </span>
          </div>

          {/* Foto Banner Lapangan */}
          <div className="relative h-[160px] rounded-[14px] overflow-hidden mb-6 border border-white/10 shadow-lg">
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

          {/* Profil Pemesan (Nama & Avatar Inisial Khas Referensi) */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                {selectedBooking.customerName}
              </h2>
              <p className="text-sm text-[#8e8e8e]">
                {selectedBooking.date}, {selectedBooking.startTime}–{selectedBooking.endTime}
              </p>
              <span className="text-xs text-[#0091ff] font-medium block mt-0.5">
                Single Court Booking
              </span>
            </div>

            {/* Avatar Inisial Bulat/Kotak Khas Referensi "FS" */}
            <div className="w-12 h-12 rounded-[12px] bg-[#2a2a2a] border border-white/15 text-white flex items-center justify-center text-lg font-bold font-mono shrink-0">
              {selectedBooking.avatarInitials || 'BS'}
            </div>
          </div>

          {/* Kotak Catatan / Keterangan Pemesan */}
          {selectedBooking.notes && (
            <div className="p-4 rounded-[12px] bg-[#222222] border border-[#2f2f2f] mb-4 text-sm text-[#d1d1d1] flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#8e8e8e] shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span className="leading-snug">{selectedBooking.notes}</span>
            </div>
          )}

          {/* Kotak Info Kontak */}
          <div className="p-4 rounded-[12px] bg-[#222222] border border-[#2f2f2f] mb-4 text-xs text-[#a3a3a3] space-y-1.5">
            <div className="flex justify-between">
              <span>Nomor WhatsApp:</span>
              <span className="text-white font-mono">{selectedBooking.customerWhatsapp}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="text-white truncate max-w-[200px]">{selectedBooking.customerEmail}</span>
            </div>
          </div>

          {/* Kartu Status Pembayaran (Persis Referensi VISA / PAID Card) */}
          <div className="p-4 rounded-[12px] bg-[#222222] border border-[#2f2f2f] mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-[#f2d953] uppercase font-mono">
                  {selectedBooking.paymentType === 'lunas' ? 'LUNAS (100%)' : 'DP (50%)'}
                </span>
                <span className="text-xs text-[#8e8e8e]">Rp {selectedBooking.totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
                  selectedBooking.paymentType === 'lunas'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {selectedBooking.paymentType === 'lunas' ? 'PAID' : 'PARTIAL DP'}
              </span>
            </div>

            <p className="text-[11px] text-[#737373]">
              {selectedBooking.paymentType === 'lunas'
                ? 'Pembayaran penuh telah terverifikasi.'
                : `Sisa tagihan Rp ${selectedBooking.remainingAmount.toLocaleString('id-ID')} wajib dilunasi di kasir.`}
            </p>
          </div>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="space-y-3 pt-4 border-t border-[#262626]">
          {selectedBooking.paymentType === 'dp' && (
            <button
              type="button"
              onClick={() => alert(`Pelunasan kasir untuk ${selectedBooking.customerName} berhasil!`)}
              className="w-full h-12 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-semibold transition-colors cursor-pointer shadow-md"
            >
              Lunasi Sisa Rp {selectedBooking.remainingAmount.toLocaleString('id-ID')}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-[10px] bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors cursor-pointer border border-white/10"
          >
            Tutup Panel
          </button>
        </div>
      </aside>
    )
  }

  // Case 3: Create New Reservation Form (Ketika slot kosong diklik)
  if (panelMode === 'create' && selectedSlot) {
    const finalCustomerName = customerName || 'Calon Penyewa'
    const finalWhatsapp = customerWhatsapp || '08123456789'
    const dpAmount = selectedSlot.pricePerHour * 0.5

    return (
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-6 flex flex-col justify-between overflow-y-auto shrink-0 animate-in fade-in duration-200 select-none">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Batal booking"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <span className="text-xs text-[#f2d953] font-mono uppercase tracking-wider font-semibold">
              Reservasi Baru
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
            Konfirmasi Booking
          </h2>
          <p className="text-sm text-[#8e8e8e] mb-6">
            Pilih opsi pembayaran untuk mengunci slot jadwal ini.
          </p>

          {/* Ringkasan Slot Terpilih */}
          <div className="p-4 rounded-[12px] bg-[#222222] border border-[#2f2f2f] mb-4">
            <span className="text-[11px] text-[#8e8e8e] block uppercase tracking-wider mb-1">
              LAPANGAN & JADWAL
            </span>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-base font-medium text-white">{selectedSlot.courtName}</span>
              <span className="text-sm font-mono text-[#f2d953]">
                Rp {selectedSlot.pricePerHour.toLocaleString('id-ID')}/jam
              </span>
            </div>
            <span className="text-xs text-[#a3a3a3]">
              {selectedSlot.date}, {selectedSlot.startTime} - {selectedSlot.endTime} (1 Jam)
            </span>
          </div>

          {/* Data Calon Penyewa (Terisi Otomatis dari Side Panel) */}
          <div className="p-4 rounded-[12px] bg-[#222222] border border-[#2f2f2f] mb-6">
            <span className="text-[11px] text-[#8e8e8e] block uppercase tracking-wider mb-2">
              DATA PEMESAN
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8e8e8e]">Nama:</span>
                <span className="text-white font-medium">{finalCustomerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e8e]">WhatsApp:</span>
                <span className="text-white font-mono">{finalWhatsapp}</span>
              </div>
              {customerEmail && (
                <div className="flex justify-between">
                  <span className="text-[#8e8e8e]">Email:</span>
                  <span className="text-white truncate max-w-[180px]">{customerEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pilihan Opsi Pembayaran (Poin Kisi-Kisi UKK) */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider block mb-3">
              OPSI PEMBAYARAN
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
                <span className="text-[10px] text-[#8e8e8e] block mt-0.5">Sisa di kasir</span>
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
                  Rp {selectedSlot.pricePerHour.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Bebas antre</span>
              </div>
            </div>
          </div>

          {/* Input Catatan */}
          <div className="mb-4">
            <label htmlFor="booking_notes" className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider block mb-2">
              CATATAN TAMBAHAN (OPSIONAL)
            </label>
            <input
              id="booking_notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Butuh sewa raket / shuttlecock"
              className="w-full h-11 px-3.5 rounded-[10px] bg-[#222222] border border-[#333333] text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#f2d953] transition-colors"
            />
          </div>
        </div>

        {/* Tombol Konfirmasi Booking */}
        <div className="pt-4 border-t border-[#262626]">
          <button
            type="button"
            onClick={() => onCreateBooking(paymentType, notes)}
            className="w-full h-12 rounded-[10px] bg-[#0091ff] hover:bg-[#0081e6] text-white text-sm font-semibold transition-colors cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>
              Kunci Slot ({paymentType === 'dp' ? `DP Rp ${dpAmount.toLocaleString('id-ID')}` : `Lunas Rp ${selectedSlot.pricePerHour.toLocaleString('id-ID')}`})
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
