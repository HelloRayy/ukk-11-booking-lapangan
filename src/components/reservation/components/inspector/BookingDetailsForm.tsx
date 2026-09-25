// PERAN FILE: Formulir konfirmasi rincian sewa, skema pembayaran DP/Lunas, info pemesan & catatan (Itemized Receipt Slip + Fintech Selection)
import { useMemo } from 'react'
import { X, Clock, ArrowRight, ShieldCheck } from 'lucide-react'
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

        {/* 2. Struk Digital Rincian Sewa (Notched Receipt Pass Style) */}
        <div className="relative rounded-2xl bg-[#1f1f1f] border border-[#2e2e2e] overflow-hidden shadow-lg">
          {/* Header Tiket Struk */}
          <div className="p-4 pb-3 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8e8e8e] font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#f2d953]" />
                <span>Jadwal Bermain</span>
              </span>
              <span className="text-white font-semibold">
                {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.totalHours} Jam)
              </span>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#a3a3a3]">
                  Tarif Sewa ({selectedSlot.totalHours} jam × {formatRupiah(selectedSlot.pricePerHour)})
                </span>
                <span className="text-white font-medium">
                  {formatRupiah(selectedSlot.totalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#a3a3a3] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Biaya Layanan & Fasilitas</span>
                </span>
                <span className="text-emerald-400 font-medium">Gratis</span>
              </div>
            </div>
          </div>

          {/* Garis Potong Perforated / Notched Divider */}
          <div className="relative flex items-center justify-center my-0.5">
            <div className="absolute -left-2 w-4 h-4 rounded-full bg-[#1a1a1a] border-r border-[#2e2e2e]" />
            <div className="w-full border-t border-dashed border-[#383838] mx-3" />
            <div className="absolute -right-2 w-4 h-4 rounded-full bg-[#1a1a1a] border-l border-[#2e2e2e]" />
          </div>

          {/* Footer Struk: Total Biaya */}
          <div className="p-4 pt-3 bg-white/[0.02] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8e8e8e] block">Total Biaya Sewa</span>
              <span className="text-[10px] text-[#737373]">Termasuk PPN & Jaminan Slot</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {formatRupiah(selectedSlot.totalPrice)}
            </span>
          </div>
        </div>

        {/* 3. Pilihan Skema Pembayaran (Modern Fintech Stacked Radio Cards) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs font-semibold text-white tracking-wide uppercase">
              Pilih Skema Bayar
            </span>
            <span className="text-[11px] text-[#8e8e8e]">Metode QRIS Dinamis</span>
          </div>

          <div className="space-y-2">
            {/* Opsi DP 50% */}
            <div
              onClick={() => onPaymentTypeChange('DP')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                paymentType === 'DP'
                  ? 'bg-[#242424] border-[#f2d953] ring-1 ring-[#f2d953]/25 shadow-sm'
                  : 'bg-[#1c1c1c] border-[#2e2e2e] hover:border-[#444444] hover:bg-[#202020]'
              }`}
            >
              <div className="pt-0.5">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    paymentType === 'DP'
                      ? 'border-[#f2d953]'
                      : 'border-[#555555]'
                  }`}
                >
                  {paymentType === 'DP' && (
                    <div className="w-2 h-2 rounded-full bg-[#f2d953]" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">
                    Bayar DP (50%)
                  </span>
                  <span className={`text-sm font-bold ${paymentType === 'DP' ? 'text-[#f2d953]' : 'text-white'}`}>
                    {formatRupiah(dpAmount)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8e8e8e] mt-1 leading-snug">
                  Sisa <span className="text-white font-medium">{formatRupiah(dpAmount)}</span> dibayar saat tiba di kasir arena.
                </p>
              </div>
            </div>

            {/* Opsi Lunas 100% */}
            <div
              onClick={() => onPaymentTypeChange('Lunas')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                paymentType === 'Lunas'
                  ? 'bg-[#242424] border-[#f2d953] ring-1 ring-[#f2d953]/25 shadow-sm'
                  : 'bg-[#1c1c1c] border-[#2e2e2e] hover:border-[#444444] hover:bg-[#202020]'
              }`}
            >
              <div className="pt-0.5">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    paymentType === 'Lunas'
                      ? 'border-[#f2d953]'
                      : 'border-[#555555]'
                  }`}
                >
                  {paymentType === 'Lunas' && (
                    <div className="w-2 h-2 rounded-full bg-[#f2d953]" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      Bayar Lunas (100%)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                      Paling Praktis
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${paymentType === 'Lunas' ? 'text-[#f2d953]' : 'text-white'}`}>
                    {formatRupiah(selectedSlot.totalPrice)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8e8e8e] mt-1 leading-snug">
                  Langsung main saat check-in tanpa perlu antre pelunasan di kasir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Data Pemesan & Catatan */}
        <div className="space-y-2 pt-1">
          <div className="px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-between text-xs">
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

          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Catatan sewa (opsional)..."
              className="w-full h-9 px-3 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 5. Sticky Footer: Bayar Sekarang & CTA */}
      <div className="pt-3 border-t border-[#262626] mt-3 space-y-2.5">
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

        <button
          type="button"
          onClick={onProceedToPayment}
          className="w-full h-11 rounded-xl bg-[#f2d953] hover:bg-[#ffe359] text-[#161616] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Lanjut ke Pembayaran QRIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
