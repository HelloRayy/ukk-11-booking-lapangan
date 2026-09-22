// PERAN FILE: Panel Samping Kanan (Inspector Panel) Clean UI & Tanpa Font Mono (User POV)
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Case 1: Empty State (Clean Minimalist Placeholder)
  if (panelMode === 'empty') {
    return (
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-8 flex flex-col justify-center items-center text-center shrink-0 select-none font-aeonik">
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#f2d953] mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Pilih Jam Bermain</h3>
        <p className="text-sm text-[#8e8e8e] max-w-xs leading-relaxed">
          Klik slot jam mulai dan jam selesai pada kalender untuk menentukan durasi sewa lapangan Anda.
        </p>
      </aside>
    )
  }

  // Case 2: Inspect Existing Booking (Jadwal Terisi - Clean)
  if (panelMode === 'inspect' && selectedBooking) {
    const isMaintenance = selectedBooking.status === 'maintenance'

    return (
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-6 flex flex-col justify-between overflow-y-auto shrink-0 animate-in fade-in duration-200 select-none font-aeonik">
        <div>
          {/* Top Bar */}
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
              {selectedBooking.avatarInitials || 'BS'}
            </div>
          </div>

          <div className="p-4 rounded-[12px] bg-white/[0.03] border border-white/10 mb-6 text-sm text-[#a3a3a3] leading-relaxed">
            Slot pada jam ini telah dipesan. Silakan pilih slot lain yang masih berstatus kosong pada tabel kalender.
          </div>
        </div>

        {/* Tombol Aksi */}
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

  // Case 3: Create New Reservation (Clean Form Booking dengan Dropdown Skema Pembayaran)
  if (panelMode === 'create' && selectedSlot) {
    const finalCustomerName = customerName || 'Raditya Rayhan'
    const finalWhatsapp = customerWhatsapp || '085799799857'
    const finalEmail = customerEmail || 'raditya.rayhan@gmail.com'
    const dpAmount = selectedSlot.totalPrice * 0.5

    return (
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-6 flex flex-col justify-between overflow-y-auto shrink-0 animate-in fade-in duration-200 select-none font-aeonik">
        <div>
          {/* Top Bar: Navigasi & Judul */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Batal pemilihan"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <span className="text-xs text-[#8e8e8e] font-medium">
              Rincian Pembayaran
            </span>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Konfirmasi Reservasi
            </h2>
            <p className="text-xs text-[#8e8e8e] mt-0.5">
              {selectedSlot.date} • {selectedSlot.courtName}
            </p>
          </div>

          {/* 1. Ringkasan Jadwal & Waktu Main (Satu Card Bersih) */}
          <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[#8e8e8e]">Waktu Bermain</span>
              <span className="text-xs text-white font-medium">
                {selectedSlot.totalHours} Jam
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white">
                {selectedSlot.startTime} - {selectedSlot.endTime}
              </span>
              <span className="text-xs text-[#8e8e8e]">
                Rp {selectedSlot.pricePerHour.toLocaleString('id-ID')} / jam
              </span>
            </div>
          </div>

          {/* 2. Rincian Tagihan Transparan (Tanpa Pengulangan Angka) */}
          <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] mb-3">
            <div className="flex justify-between text-xs text-[#8e8e8e] mb-2">
              <span>Sewa {selectedSlot.courtName} ({selectedSlot.totalHours} jam)</span>
              <span className="text-white font-medium">
                Rp {selectedSlot.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
              <span>Total Tagihan</span>
              <span className="text-base text-[#f2d953]">
                Rp {selectedSlot.totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* 3. Metode Pembayaran: Dropdown Standar Ringkas */}
          <div className="relative mb-3.5">
            <label className="text-xs text-[#8e8e8e] block mb-1.5 font-medium">
              Metode Pembayaran
            </label>

            {/* Dropdown Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-11 px-3.5 rounded-[10px] bg-[#222222] border border-[#333333] hover:border-[#555555] flex items-center justify-between transition-colors text-left cursor-pointer focus:outline-none focus:border-[#f2d953]"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${paymentType === 'dp' ? 'bg-[#f2d953]' : 'bg-emerald-400'}`} />
                <span className="text-xs font-semibold text-white">
                  {paymentType === 'dp' ? 'Bayar DP 50%' : 'Bayar Lunas 100%'}
                </span>
                <span className="text-xs text-[#8e8e8e]">
                  • Rp {(paymentType === 'dp' ? dpAmount : selectedSlot.totalPrice).toLocaleString('id-ID')}
                </span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-[#8e8e8e] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Popover Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-30 p-1.5 rounded-[10px] bg-[#1e1e1e] border border-[#333333] shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-100">
                {/* Opsi 1: DP 50% */}
                <div
                  onClick={() => {
                    setPaymentType('dp')
                    setIsDropdownOpen(false)
                  }}
                  className={`px-3 py-2.5 rounded-[8px] transition-colors cursor-pointer flex items-center justify-between ${
                    paymentType === 'dp'
                      ? 'bg-[#f2d953]/15 text-white'
                      : 'hover:bg-white/5 text-[#d4d4d4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentType === 'dp' ? 'border-[#f2d953] bg-[#f2d953]' : 'border-white/20'
                    }`}>
                      {paymentType === 'dp' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Bayar DP 50%</span>
                      <span className="text-[11px] text-[#8e8e8e] block">
                        Sisa Rp {dpAmount.toLocaleString('id-ID')} di arena
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#f2d953]">
                    Rp {dpAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Opsi 2: Lunas 100% */}
                <div
                  onClick={() => {
                    setPaymentType('lunas')
                    setIsDropdownOpen(false)
                  }}
                  className={`px-3 py-2.5 rounded-[8px] transition-colors cursor-pointer flex items-center justify-between ${
                    paymentType === 'lunas'
                      ? 'bg-emerald-500/15 text-white'
                      : 'hover:bg-white/5 text-[#d4d4d4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentType === 'lunas' ? 'border-emerald-400 bg-emerald-400' : 'border-white/20'
                    }`}>
                      {paymentType === 'lunas' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Bayar Lunas 100%</span>
                      <span className="text-[11px] text-[#8e8e8e] block">
                        Langsung masuk lapangan
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    Rp {selectedSlot.totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Data Pemesan Lengkap (Nama, Nomor WhatsApp, Email) */}
          <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] mb-3.5 space-y-2.5">
            <div className="pb-2 border-b border-white/5">
              <span className="text-xs font-semibold text-[#8e8e8e]">Informasi Pemesan</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#8e8e8e]">Nama Lengkap</span>
                <span className="font-semibold text-white">{finalCustomerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8e8e8e]">No. WhatsApp</span>
                <span className="font-medium text-white">{finalWhatsapp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8e8e8e]">Alamat Email</span>
                <span className="font-medium text-[#d4d4d4]">{finalEmail}</span>
              </div>
            </div>
          </div>

          {/* 5. Catatan Opsional */}
          <div className="mb-2">
            <label htmlFor="user_booking_notes" className="text-xs text-[#8e8e8e] block mb-1">
              Catatan (Opsional)
            </label>
            <input
              id="user_booking_notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Siapkan raket sewa / shuttlecock"
              className="w-full h-10 px-3 rounded-[8px] bg-[#222222] border border-[#333333] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors"
            />
          </div>
        </div>

        {/* 6. Sticky Footer: Detail Jumlah Bayar Sekarang & Tombol CTA */}
        <div className="pt-3 border-t border-[#262626]">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs text-[#8e8e8e]">
              {paymentType === 'dp' ? 'Wajib Bayar Sekarang (DP 50%)' : 'Wajib Bayar Sekarang (Lunas)'}:
            </span>
            <span className="text-sm font-bold text-[#f2d953]">
              Rp {(paymentType === 'dp' ? dpAmount : selectedSlot.totalPrice).toLocaleString('id-ID')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCreateBooking(paymentType, notes)}
            className="w-full h-12 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-bold transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Konfirmasi & Lanjut Bayar</span>
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
