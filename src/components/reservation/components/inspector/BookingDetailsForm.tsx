// PERAN FILE: Formulir konfirmasi rincian sewa, skema pembayaran DP/Lunas, info pemesan & catatan (Clean UI, Less Text)
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
  onPaymentTypeChange,
  onNotesChange,
  onClose,
  onProceedToPayment,
}: BookingDetailsFormProps) {
  const dpAmount = selectedSlot.totalPrice * 0.5
  const currentPayAmount = paymentType === 'DP' ? dpAmount : selectedSlot.totalPrice

  return (
    <div className="flex flex-col justify-between h-full animate-in fade-in duration-150 select-none font-aeonik">
      <div className="overflow-y-auto pr-0.5 space-y-4">
        {/* 1. Header Bersih */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Rincian Reservasi
            </h2>
            <p className="text-xs text-[#8e8e8e]">
              {selectedSlot.courtName} • {selectedSlot.date}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            aria-label="Tutup rincian"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. Ringkasan Jadwal & Total Tagihan (Unified Card) */}
        <div className="p-3.5 rounded-xl bg-[#202020] border border-[#2e2e2e] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8e8e8e] block">Jadwal Bermain</span>
              <span className="text-sm font-bold text-white">
                {selectedSlot.startTime} - {selectedSlot.endTime}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8e8e8e] block">Durasi</span>
              <span className="text-sm font-semibold text-white">
                {selectedSlot.totalHours} Jam
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8e8e8e] block">Total Biaya</span>
              <span className="text-[11px] text-[#737373]">
                {formatRupiah(selectedSlot.pricePerHour)}/jam
              </span>
            </div>
            <span className="text-lg font-bold text-[#f2d953]">
              {formatRupiah(selectedSlot.totalPrice)}
            </span>
          </div>
        </div>

        {/* 3. Skema Pembayaran: Segmented Control Bersih (Zero Dropdown) */}
        <div>
          <span className="text-xs text-[#8e8e8e] block mb-2 font-medium">
            Pilih Skema Bayar
          </span>

          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#202020] border border-[#2e2e2e]">
            {/* Opsi DP 50% */}
            <button
              type="button"
              onClick={() => onPaymentTypeChange('DP')}
              className={`py-2 px-3 rounded-lg text-left transition-all cursor-pointer ${
                paymentType === 'DP'
                  ? 'bg-[#f2d953] text-black shadow-sm font-bold'
                  : 'text-[#a3a3a3] hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span className="text-xs block">DP 50%</span>
              <span className="text-xs block opacity-90">
                {formatRupiah(dpAmount)}
              </span>
            </button>

            {/* Opsi Lunas 100% */}
            <button
              type="button"
              onClick={() => onPaymentTypeChange('Lunas')}
              className={`py-2 px-3 rounded-lg text-left transition-all cursor-pointer ${
                paymentType === 'Lunas'
                  ? 'bg-[#f2d953] text-black shadow-sm font-bold'
                  : 'text-[#a3a3a3] hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span className="text-xs block">Lunas 100%</span>
              <span className="text-xs block opacity-90">
                {formatRupiah(selectedSlot.totalPrice)}
              </span>
            </button>
          </div>

          {paymentType === 'DP' && (
            <p className="text-[11px] text-[#737373] mt-1.5 px-1">
              Sisa pelunasan {formatRupiah(dpAmount)} dibayar di arena.
            </p>
          )}
        </div>

        {/* 4. Info Kontak Ringkas */}
        <div className="px-3.5 py-2.5 rounded-xl bg-[#202020] border border-[#2e2e2e] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#f2d953] shrink-0 font-bold text-[11px]">
              {customerName.charAt(0)}
            </div>
            <div className="truncate">
              <span className="font-semibold text-white block truncate">{customerName}</span>
              <span className="text-[11px] text-[#737373] block">{customerWhatsapp}</span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a3a3a3] shrink-0">
            Penyewa
          </span>
        </div>

        {/* 5. Catatan Singkat */}
        <div>
          <input
            type="text"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Catatan sewa (opsional)..."
            className="w-full h-10 px-3 rounded-xl bg-[#202020] border border-[#2e2e2e] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors"
          />
        </div>
      </div>

      {/* 6. Sticky Footer: Bayar Sekarang & CTA */}
      <div className="pt-3 border-t border-[#262626] mt-3">
        <div className="flex justify-between items-center mb-2.5 px-1">
          <span className="text-xs text-[#8e8e8e]">
            {paymentType === 'DP' ? 'Bayar DP Sekarang' : 'Total Bayar Lunas'}
          </span>
          <span className="text-base font-bold text-[#f2d953]">
            {formatRupiah(currentPayAmount)}
          </span>
        </div>

        <button
          type="button"
          onClick={onProceedToPayment}
          className="w-full h-11 rounded-xl bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Lanjut ke QRIS</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
