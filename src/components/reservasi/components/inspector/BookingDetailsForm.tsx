// PERAN FILE: Formulir konfirmasi rincian sewa, skema pembayaran DP/Lunas, info pemesan & catatan
import { useState } from 'react'
import type { SlotRangeSelection, PaymentType } from '../../types'
import { formatRupiah } from '../../utils/formatters'

interface BookingDetailsFormProps {
  selectedSlot: SlotRangeSelection
  paymentType: PaymentType
  notes: string
  customerName: string
  customerWhatsapp: string
  customerEmail: string
  onPaymentTypeChange: (type: PaymentType) => void
  onNotesChange: (notes: string) => void
  onClose: () => void
  onProceedToPayment: () => void
}

export default function BookingDetailsForm({
  selectedSlot,
  paymentType,
  notes,
  customerName,
  customerWhatsapp,
  customerEmail,
  onPaymentTypeChange,
  onNotesChange,
  onClose,
  onProceedToPayment,
}: BookingDetailsFormProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dpAmount = selectedSlot.totalPrice * 0.5
  const currentPayAmount = paymentType === 'dp' ? dpAmount : selectedSlot.totalPrice

  return (
    <div className="flex flex-col justify-between h-full animate-in fade-in duration-150 select-none font-aeonik">
      <div className="overflow-y-auto pr-0.5 space-y-3.5">
        {/* Top Bar: Navigasi & Judul */}
        <div>
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

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Konfirmasi Reservasi
            </h2>
            <p className="text-xs text-[#8e8e8e] mt-0.5">
              {selectedSlot.date} • {selectedSlot.courtName}
            </p>
          </div>
        </div>

        {/* 1. Ringkasan Jadwal & Waktu Main */}
        <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e]">
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
              {formatRupiah(selectedSlot.pricePerHour)} / jam
            </span>
          </div>
        </div>

        {/* 2. Rincian Tagihan Transparan */}
        <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e]">
          <div className="flex justify-between text-xs text-[#8e8e8e] mb-2">
            <span>Sewa {selectedSlot.courtName} ({selectedSlot.totalHours} jam)</span>
            <span className="text-white font-medium">
              {formatRupiah(selectedSlot.totalPrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
            <span>Total Tagihan</span>
            <span className="text-base text-[#f2d953]">
              {formatRupiah(selectedSlot.totalPrice)}
            </span>
          </div>
        </div>

        {/* 3. Metode Pembayaran: Dropdown Standar Ringkas */}
        <div className="relative">
          <label className="text-xs text-[#8e8e8e] block mb-1.5 font-medium">
            Skema Pembayaran
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
                • {formatRupiah(currentPayAmount)}
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
                  onPaymentTypeChange('dp')
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
                      Sisa {formatRupiah(dpAmount)} di arena
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#f2d953]">
                  {formatRupiah(dpAmount)}
                </span>
              </div>

              {/* Opsi 2: Lunas 100% */}
              <div
                onClick={() => {
                  onPaymentTypeChange('lunas')
                  setIsDropdownOpen(false)
                }}
                className={`px-3 py-2.5 rounded-[8px] transition-colors cursor-pointer flex items-center justify-between ${
                  paymentType === 'lunas'
                    ? 'bg-[#f2d953]/15 text-white'
                    : 'hover:bg-white/5 text-[#d4d4d4]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    paymentType === 'lunas' ? 'border-[#f2d953] bg-[#f2d953]' : 'border-white/20'
                  }`}>
                    {paymentType === 'lunas' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">Bayar Lunas 100%</span>
                    <span className="text-[11px] text-[#8e8e8e] block">Bebas antre pelunasan</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#f2d953]">
                  {formatRupiah(selectedSlot.totalPrice)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Ringkasan Akun Pelanggan */}
        <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
            <span className="text-xs text-[#8e8e8e] font-medium">Informasi Penyewa</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a3a3a3]">
              Terverifikasi
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#8e8e8e]">Nama Lengkap</span>
              <span className="font-semibold text-white">{customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8e8e8e]">No. WhatsApp</span>
              <span className="font-medium text-white">{customerWhatsapp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8e8e8e]">Alamat Email</span>
              <span className="font-medium text-[#d4d4d4]">{customerEmail}</span>
            </div>
          </div>
        </div>

        {/* 5. Catatan Opsional */}
        <div>
          <label htmlFor="user_booking_notes" className="text-xs text-[#8e8e8e] block mb-1.5 font-medium">
            Catatan (Opsional)
          </label>
          <textarea
            id="user_booking_notes"
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="e.g. Siapkan raket sewa / shuttlecock tambahan..."
            className="w-full h-20 p-3 rounded-[10px] bg-[#222222] border border-[#333333] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors resize-none leading-relaxed"
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
            {formatRupiah(currentPayAmount)}
          </span>
        </div>
        <button
          type="button"
          onClick={onProceedToPayment}
          className="w-full h-12 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-bold transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Lanjut ke Pembayaran</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
