// PERAN FILE: Layar Pembayaran QRIS Dinamis (Full Cashless) di Right Panel
import { useState, useEffect } from 'react'
import type { SlotRangeSelection, PaymentType } from '../types'
import { formatRupiah } from '../utils/formatters'

interface QrisPaymentViewProps {
  selectedSlot: SlotRangeSelection
  paymentType: PaymentType
  notes?: string
  expiryTimestamp: number
  onBackToDetails: () => void
  onConfirmPayment: () => void
  onCancelPayment: (isExpired?: boolean) => void
}

export default function QrisPaymentView({
  selectedSlot,
  paymentType,
  expiryTimestamp,
  onBackToDetails,
  onConfirmPayment,
  onCancelPayment,
}: QrisPaymentViewProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return Math.max(0, Math.floor((expiryTimestamp - Date.now()) / 1000))
  })

  // Interval timer hitung mundur
  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiryTimestamp - Date.now()) / 1000))
      setSecondsRemaining(remaining)

      // Jika waktu habis, otomatis batalkan transaksi
      if (remaining <= 0) {
        onCancelPayment(true)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [expiryTimestamp, onCancelPayment])

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const isUrgent = secondsRemaining < 120 // Kurang dari 2 menit
  const billAmount = paymentType === 'DP' ? selectedSlot.totalPrice * 0.5 : selectedSlot.totalPrice
  const remainingAmount = selectedSlot.totalPrice - billAmount

  return (
    <div className="flex flex-col justify-between h-full animate-in fade-in duration-200 select-none font-aeonik">
      <div className="overflow-y-auto pr-0.5 space-y-3.5">
        {/* 1. Header & Navigasi */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToDetails}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs transition-colors cursor-pointer border border-white/10"
            aria-label="Kembali ke rincian sewa"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Rincian</span>
          </button>

          {/* Hitung Mundur */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
            <span className="text-[11px] text-[#8e8e8e]">Batas Bayar:</span>
            <span
              className={`text-xs font-bold tabular-nums ${
                isUrgent ? 'text-red-400 animate-pulse' : 'text-[#f2d953]'
              }`}
            >
              {formattedTime}
            </span>
          </div>
        </div>

        {/* 2. Kartu QRIS Bersih */}
        <div className="p-4 rounded-xl bg-white text-black shadow-lg flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100 text-xs">
            <span className="font-extrabold tracking-widest text-sm text-gray-900">QRIS</span>
            <span className="text-[10px] text-gray-400 font-medium">GPN</span>
          </div>

          <div className="w-40 h-40 bg-white p-1 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" shapeRendering="crispEdges">
              <rect width="100" height="100" fill="white" />
              <rect x="5" y="5" width="30" height="30" fill="black" />
              <rect x="10" y="10" width="20" height="20" fill="white" />
              <rect x="15" y="15" width="10" height="10" fill="black" />

              <rect x="65" y="5" width="30" height="30" fill="black" />
              <rect x="70" y="10" width="20" height="20" fill="white" />
              <rect x="75" y="15" width="10" height="10" fill="black" />

              <rect x="5" y="65" width="30" height="30" fill="black" />
              <rect x="10" y="70" width="20" height="20" fill="white" />
              <rect x="15" y="75" width="10" height="10" fill="black" />

              <rect x="40" y="15" width="5" height="5" fill="black" />
              <rect x="50" y="15" width="5" height="5" fill="black" />
              <rect x="15" y="40" width="5" height="5" fill="black" />
              <rect x="15" y="50" width="5" height="5" fill="black" />

              <rect x="42" y="32" width="6" height="6" fill="black" />
              <rect x="52" y="32" width="6" height="6" fill="black" />
              <rect x="62" y="32" width="6" height="6" fill="black" />
              <rect x="42" y="42" width="6" height="6" fill="black" />
              <rect x="48" y="48" width="6" height="6" fill="black" />
              <rect x="58" y="42" width="6" height="6" fill="black" />
              <rect x="68" y="42" width="6" height="6" fill="black" />
              <rect x="42" y="52" width="6" height="6" fill="black" />
              <rect x="52" y="62" width="6" height="6" fill="black" />
              <rect x="62" y="52" width="6" height="6" fill="black" />
              <rect x="72" y="62" width="6" height="6" fill="black" />
              <rect x="42" y="72" width="6" height="6" fill="black" />
              <rect x="52" y="82" width="6" height="6" fill="black" />
              <rect x="62" y="72" width="6" height="6" fill="black" />
              <rect x="72" y="82" width="6" height="6" fill="black" />
              <rect x="82" y="72" width="6" height="6" fill="black" />
            </svg>
          </div>

          <div className="w-full text-center mt-2 pt-1.5 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-900 block tracking-tight">BLANCA ARENA</span>
            <span className="text-[10px] text-gray-400 block font-mono">NMID: ID1020039201948</span>
          </div>
        </div>

        {/* 3. Nominal Tagihan Ringkas */}
        <div className="p-3.5 rounded-xl bg-[#202020] border border-[#2e2e2e]">
          <div className="flex items-center justify-between text-xs text-[#8e8e8e] mb-1">
            <span>Tagihan ({paymentType === 'DP' ? 'DP 50%' : 'Lunas'})</span>
            <span className="text-white font-medium">{selectedSlot.courtName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8e8e8e]">Total Bayar</span>
            <span className="text-lg font-bold text-[#f2d953]">
              {formatRupiah(billAmount)}
            </span>
          </div>
          {paymentType === 'DP' && (
            <p className="text-[11px] text-[#737373] mt-2 pt-2 border-t border-white/5">
              Sisa {formatRupiah(remainingAmount)} dilunasi saat tiba di lokasi.
            </p>
          )}
        </div>
      </div>

      {/* 4. Tombol Aksi Bawah */}
      <div className="pt-3 border-t border-[#262626] space-y-2 mt-3">
        <button
          type="button"
          onClick={onConfirmPayment}
          className="w-full h-11 rounded-xl bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Saya Sudah Bayar</span>
        </button>

        <button
          type="button"
          onClick={() => onCancelPayment(false)}
          className="w-full py-1.5 text-xs text-[#737373] hover:text-red-400 transition-colors cursor-pointer text-center"
        >
          Batalkan
        </button>
      </div>
    </div>
  )
}
