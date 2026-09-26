import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Clock, ArrowRight, ChevronDown, Check, User, Phone } from 'lucide-react'
import type { SlotRangeSelection, PaymentType } from '../../types'
import { formatRupiah } from '../../utils/formatters'

interface BookingDetailsFormProps {
  selectedSlot: SlotRangeSelection
  paymentType: PaymentType
  notes: string
  customerName: string
  customerWhatsapp: string
  customerEmail?: string
  onPaymentTypeChange: (type: PaymentType) => void
  onNotesChange: (notes: string) => void
  onCustomerNameChange: (name: string) => void
  onCustomerWhatsappChange: (whatsapp: string) => void
  onClose: () => void
  onProceedToPayment: () => void
}

export default function BookingDetailsForm({
  selectedSlot,
  paymentType,
  notes,
  customerName,
  customerWhatsapp,
  onPaymentTypeChange,
  onNotesChange,
  onCustomerNameChange,
  onCustomerWhatsappChange,
  onClose,
  onProceedToPayment,
}: BookingDetailsFormProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const dpAmount = selectedSlot.totalPrice * 0.5
  const currentPayAmount = paymentType === 'DP' ? dpAmount : selectedSlot.totalPrice

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formattedDate = useMemo(() => {
    try {
      const [y, m, d] = selectedSlot.date.split('-').map(Number)
      const dateObj = new Date(y, m - 1, d)
      return dateObj.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return selectedSlot.date
    }
  }, [selectedSlot.date])

  return (
    <div className="flex flex-col justify-between h-full animate-in fade-in duration-150 select-none font-aeonik">
      <div className="overflow-y-auto pr-0.5 space-y-4">
        {/* 1. Header Bersih */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Rincian Reservasi
            </h2>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8e8e8e]">
              <span className="font-semibold text-white">{selectedSlot.courtName}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            aria-label="Tutup rincian"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Rincian Reservasi (Clean UI Sesuai Skema Backend) */}
        <div className="p-4 rounded-xl bg-[#202020] border border-[#2e2e2e] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8e8e8e]">Lapangan</span>
            <span className="text-white font-semibold">
              {selectedSlot.courtName} ({formatRupiah(selectedSlot.pricePerHour)}/jam)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8e8e8e] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#f2d953]" />
              <span>Jadwal Bermain</span>
            </span>
            <span className="text-white font-semibold">
              {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.totalHours} Jam)
            </span>
          </div>

          <div className="pt-2.5 border-t border-[#2e2e2e] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8e8e8e]">Total Tagihan Sewa</span>
              <span className="text-sm font-bold text-white">
                {formatRupiah(selectedSlot.totalPrice)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8e8e8e]">
                {paymentType === 'DP' ? 'Dibayar Sekarang (DP 50%)' : 'Dibayar Sekarang (Lunas)'}
              </span>
              <span className="text-sm font-bold text-[#f2d953]">
                {formatRupiah(currentPayAmount)}
              </span>
            </div>

            {paymentType === 'DP' && (
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[#8e8e8e]">
                <span>Sisa Pelunasan di Lokasi</span>
                <span className="text-white font-medium">
                  {formatRupiah(dpAmount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Pilihan Skema Pembayaran (Custom Dropdown dengan UI Open State) */}
        <div className="space-y-1.5 relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-white tracking-wide uppercase px-0.5 block">
            Pilih Skema Bayar
          </label>

          {/* Trigger Dropdown */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`w-full h-11 px-3.5 rounded-xl bg-[#1c1c1c] border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
              isDropdownOpen
                ? 'border-[#f2d953] ring-1 ring-[#f2d953]/30 text-white shadow-md'
                : 'border-[#2e2e2e] hover:border-[#444444] text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f2d953]" />
              <span>
                {paymentType === 'DP'
                  ? `Bayar DP 50% — ${formatRupiah(dpAmount)}`
                  : `Bayar Lunas 100% — ${formatRupiah(selectedSlot.totalPrice)}`}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#8e8e8e] transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-[#f2d953]' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown Menu (UI When Open) */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl bg-[#222222] border border-[#383838] shadow-2xl p-1.5 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              {/* Opsi DP 50% */}
              <div
                onClick={() => {
                  onPaymentTypeChange('DP')
                  setIsDropdownOpen(false)
                }}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  paymentType === 'DP'
                    ? 'bg-[#f2d953]/10 text-white font-semibold'
                    : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white">Bayar DP (50%)</span>
                    <span className="text-xs font-bold text-[#f2d953]">
                      {formatRupiah(dpAmount)}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#737373] block mt-0.5">
                    Sisa {formatRupiah(dpAmount)} dibayar saat tiba di arena
                  </span>
                </div>
                {paymentType === 'DP' && <Check className="w-4 h-4 text-[#f2d953]" />}
              </div>

              {/* Opsi Lunas 100% */}
              <div
                onClick={() => {
                  onPaymentTypeChange('Lunas')
                  setIsDropdownOpen(false)
                }}
                className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  paymentType === 'Lunas'
                    ? 'bg-[#f2d953]/10 text-white font-semibold'
                    : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white">Bayar Lunas (100%)</span>
                    <span className="text-xs font-bold text-[#f2d953]">
                      {formatRupiah(selectedSlot.totalPrice)}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#737373] block mt-0.5">
                    Langsung main saat check-in tanpa sisa tagihan
                  </span>
                </div>
                {paymentType === 'Lunas' && <Check className="w-4 h-4 text-[#f2d953]" />}
              </div>
            </div>
          )}

          <p className="text-[11px] text-[#8e8e8e] px-1 leading-snug">
            {paymentType === 'DP' ? (
              <>Sisa <span className="text-white font-medium">{formatRupiah(dpAmount)}</span> dibayar saat tiba di kasir arena.</>
            ) : (
              <>Langsung main saat check-in tanpa perlu antre pelunasan di kasir.</>
            )}
          </p>
        </div>

        {/* 4. Data Pemesan & Catatan Sewa (Input Field Fleksibel) */}
        <div className="space-y-3 pt-1">
          {/* Input Nama Pemesan */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#8e8e8e] px-1 flex items-center justify-between">
              <span>Nama Penyewa</span>
              <span className="text-[10px] text-[#f2d953]">*Wajib (Min 3 huruf)</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => onCustomerNameChange(e.target.value)}
                placeholder="Contoh: Raditya Rayhan"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors"
              />
            </div>
          </div>

          {/* Input Nomor WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#8e8e8e] px-1 flex items-center justify-between">
              <span>Nomor WhatsApp</span>
              <span className="text-[10px] text-[#f2d953]">*Wajib (Awalan 08)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                value={customerWhatsapp}
                onChange={(e) => onCustomerWhatsappChange(e.target.value.replace(/\D/g, ''))}
                placeholder="Contoh: 085799799857"
                maxLength={13}
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Textarea Catatan */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#8e8e8e] px-1 block">
              Catatan Sewa (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Catatan sewa (opsional, contoh: butuh rompi tambahan)..."
              rows={3}
              className="w-full h-20 p-3 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Sticky Footer: Bayar Sekarang & CTA */}
      <div className="pt-3 border-t border-[#262626] mt-3 space-y-2">
        <div className="flex justify-between items-baseline px-1">
          <div>
            <span className="text-xs text-[#8e8e8e] block">
              {paymentType === 'DP' ? 'Total Bayar Sekarang (DP)' : 'Total Bayar Lunas'}
            </span>
            {paymentType === 'DP' && (
              <span className="text-[11px] text-[#737373]">
                Sisa {formatRupiah(dpAmount)} saat check-in
              </span>
            )}
          </div>
          <span className="text-xl font-bold text-[#f2d953] tracking-tight">
            {formatRupiah(currentPayAmount)}
          </span>
        </div>

        {(() => {
          const isNameValid = customerName.trim().length >= 3
          const isWaValid = /^08[0-9]{8,11}$/.test(customerWhatsapp.trim())
          const isFormComplete = isNameValid && isWaValid

          return (
            <>
              <button
                type="button"
                disabled={!isFormComplete}
                onClick={onProceedToPayment}
                className={`w-full h-11 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isFormComplete
                    ? 'bg-[#f2d953] hover:bg-[#ffe359] text-[#161616] cursor-pointer shadow-md active:scale-[0.98]'
                    : 'bg-[#262626] text-[#666666] cursor-not-allowed opacity-60'
                }`}
              >
                <span>Lanjut ke Pembayaran QRIS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!isFormComplete && (
                <p className="text-[11px] text-[#f2d953]/80 text-center font-medium">
                  {!isNameValid
                    ? 'Lengkapi nama pemesan (min. 3 huruf)'
                    : 'Lengkapi nomor WhatsApp valid (diawali 08, 10-13 digit)'}
                </p>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}
