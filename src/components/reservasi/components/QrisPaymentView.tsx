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
  const billAmount = paymentType === 'dp' ? selectedSlot.totalPrice * 0.5 : selectedSlot.totalPrice
  const remainingAmount = selectedSlot.totalPrice - billAmount

  return (
    <div className="flex flex-col justify-between h-full animate-in fade-in duration-200">
      <div>
        {/* 1. Header & Navigasi Kembali */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBackToDetails}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-white/5 hover:bg-white/10 text-white text-xs transition-colors cursor-pointer border border-white/10"
            aria-label="Kembali ke rincian sewa"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Rincian</span>
          </button>

          {/* Indikator Hitung Mundur (Label Bersih & Font Besar) */}
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] uppercase font-semibold text-[#8e8e8e] tracking-wider">
              Sisa Waktu
            </span>
            <span
              className={`text-2xl font-bold tracking-tight leading-none mt-1 tabular-nums ${
                isUrgent ? 'text-red-400 animate-pulse' : 'text-[#f2d953]'
              }`}
            >
              {formattedTime}
            </span>
          </div>
        </div>

        {/* 2. Judul Layar Pembayaran */}
        <div className="mb-3.5">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Pembayaran QRIS Dinamis
          </h2>
          <p className="text-xs text-[#8e8e8e] mt-0.5">
            Pindai kode QRIS dengan m-Banking atau e-Wallet favorit Anda
          </p>
        </div>

        {/* 3. Kartu QRIS Dinamis (Full Cashless) */}
        <div className="p-4 rounded-[14px] bg-white text-black mb-3.5 shadow-xl flex flex-col items-center animate-in fade-in duration-150">
          <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-gray-200 text-xs">
            <span className="font-extrabold tracking-widest text-sm text-gray-900">QRIS</span>
            <span className="text-[10px] text-gray-500 font-medium">GPN Interoperable</span>
          </div>

          <div className="w-44 h-44 bg-white p-1 rounded-[8px] flex items-center justify-center">
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

          <div className="w-full text-center mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-900 block">BLANCA PADEL ARENA</span>
            <span className="text-[10px] text-gray-500 block">NMID: ID1020039201948</span>
          </div>
        </div>

        {/* 7. Rincian Nominal Tagihan (Selalu Tampil Sinkron) */}
        <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] mb-3">
          <div className="flex items-center justify-between text-xs text-[#8e8e8e] mb-1">
            <span>Wajib Dibayar Sekarang ({paymentType === 'dp' ? 'DP 50%' : 'Lunas 100%'})</span>
            <span className="text-white font-medium">{selectedSlot.courtName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#8e8e8e]">Total Tagihan</span>
            <span className="text-lg font-bold text-[#f2d953]">
              {formatRupiah(billAmount)}
            </span>
          </div>
          {paymentType === 'dp' && (
            <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-[#8e8e8e]">
              Sisa pelunasan <span className="text-white font-semibold">{formatRupiah(remainingAmount)}</span> dilunasi saat tiba di arena.
            </div>
          )}
        </div>
      </div>

      {/* 8. Tombol Aksi Bawah */}
      <div className="pt-3 border-t border-[#262626] space-y-2">
        <button
          type="button"
          onClick={onConfirmPayment}
          className="w-full h-12 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-bold transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Konfirmasi Pembayaran Selesai</span>
        </button>

        <button
          type="button"
          onClick={() => onCancelPayment(false)}
          className="w-full py-2 text-xs text-[#8e8e8e] hover:text-red-400 transition-colors cursor-pointer text-center"
        >
          Batalkan Transaksi
        </button>
      </div>
    </div>
  )
}
