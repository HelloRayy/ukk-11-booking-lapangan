// PERAN FILE: Layar Pembayaran Multi-Kanal (QRIS, Transfer VA Bank BCA/Mandiri, Tunai Kasir) di Right Panel
import { useState, useEffect } from 'react'
import type { SlotRangeSelection, PaymentType } from '../types'

interface QrisPaymentViewProps {
  selectedSlot: SlotRangeSelection
  paymentType: PaymentType
  notes?: string
  expiryTimestamp: number
  onBackToDetails: () => void
  onConfirmPayment: () => void
  onCancelPayment: (isExpired?: boolean) => void
}

type ChannelType = 'qris' | 'va' | 'kasir'
type BankType = 'bca' | 'mandiri'

export default function QrisPaymentView({
  selectedSlot,
  paymentType,
  expiryTimestamp,
  onBackToDetails,
  onConfirmPayment,
  onCancelPayment,
}: QrisPaymentViewProps) {
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('qris')
  const [selectedBank, setSelectedBank] = useState<BankType>('bca')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

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

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const isUrgent = secondsRemaining < 120 // Kurang dari 2 menit
  const billAmount = paymentType === 'dp' ? selectedSlot.totalPrice * 0.5 : selectedSlot.totalPrice
  const remainingAmount = selectedSlot.totalPrice - billAmount

  // Data Virtual Account dummy
  const vaAccounts = {
    bca: {
      bankName: 'BCA Virtual Account',
      accountNumber: '8271085799799857',
      formattedNumber: '8271 0857 9979 9857',
      accountHolder: 'BLANCA PADEL ARENA',
    },
    mandiri: {
      bankName: 'Mandiri Virtual Account',
      accountNumber: '8932108579979985',
      formattedNumber: '8932 1085 7997 9985',
      accountHolder: 'BLANCA PADEL ARENA',
    },
  }

  const currentVa = vaAccounts[selectedBank]
  const cashierPaymentCode = 'CSH-8492'

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

          {/* Indikator Hitung Mundur */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
              isUrgent
                ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
                : 'bg-[#f2d953]/15 text-[#f2d953] border-[#f2d953]/30'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* 2. Judul Layar Pembayaran */}
        <div className="mb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Pilih Kanal Pembayaran
          </h2>
          <p className="text-xs text-[#8e8e8e] mt-0.5">
            Selesaikan tagihan sebelum batas waktu berakhir
          </p>
        </div>

        {/* 3. Tab Selektor 3 Kanal Bayar */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-[10px] bg-[#141414] border border-[#2e2e2e] mb-3.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setSelectedChannel('qris')}
            className={`py-2 rounded-[8px] transition-all cursor-pointer text-center ${
              selectedChannel === 'qris'
                ? 'bg-[#262626] text-[#f2d953] font-semibold border border-white/10 shadow-sm'
                : 'text-[#8e8e8e] hover:text-white'
            }`}
          >
            QRIS
          </button>
          <button
            type="button"
            onClick={() => setSelectedChannel('va')}
            className={`py-2 rounded-[8px] transition-all cursor-pointer text-center ${
              selectedChannel === 'va'
                ? 'bg-[#262626] text-[#f2d953] font-semibold border border-white/10 shadow-sm'
                : 'text-[#8e8e8e] hover:text-white'
            }`}
          >
            Transfer VA
          </button>
          <button
            type="button"
            onClick={() => setSelectedChannel('kasir')}
            className={`py-2 rounded-[8px] transition-all cursor-pointer text-center ${
              selectedChannel === 'kasir'
                ? 'bg-[#262626] text-[#f2d953] font-semibold border border-white/10 shadow-sm'
                : 'text-[#8e8e8e] hover:text-white'
            }`}
          >
            Tunai Kasir
          </button>
        </div>

        {/* 4. Konten Kanal 1: QRIS Dinamis */}
        {selectedChannel === 'qris' && (
          <div className="p-4 rounded-[14px] bg-white text-black mb-3 shadow-xl flex flex-col items-center animate-in fade-in duration-150">
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-gray-200 text-xs">
              <span className="font-extrabold tracking-widest text-sm text-gray-900">QRIS</span>
              <span className="text-[10px] text-gray-500 font-medium">GPN Interoperable</span>
            </div>

            <div className="w-40 h-40 bg-white p-1 rounded-[8px] flex items-center justify-center">
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

            <div className="w-full text-center mt-1.5 pt-1.5 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-900 block">BLANCA PADEL ARENA</span>
              <span className="text-[10px] text-gray-500 block">NMID: ID1020039201948</span>
            </div>
          </div>
        )}

        {/* 5. Konten Kanal 2: Transfer Bank / Virtual Account (BCA & Mandiri) */}
        {selectedChannel === 'va' && (
          <div className="space-y-3 mb-3 animate-in fade-in duration-150">
            {/* Pilihan Bank (BCA / Mandiri) */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedBank('bca')}
                className={`flex-1 py-2 px-3 rounded-[8px] border text-xs font-semibold transition-colors cursor-pointer text-center ${
                  selectedBank === 'bca'
                    ? 'bg-[#00529C]/20 border-[#00529C] text-white'
                    : 'bg-[#222222] border-[#333333] text-[#8e8e8e] hover:border-[#555555]'
                }`}
              >
                Bank BCA
              </button>
              <button
                type="button"
                onClick={() => setSelectedBank('mandiri')}
                className={`flex-1 py-2 px-3 rounded-[8px] border text-xs font-semibold transition-colors cursor-pointer text-center ${
                  selectedBank === 'mandiri'
                    ? 'bg-[#003d79]/25 border-[#f2a900] text-white'
                    : 'bg-[#222222] border-[#333333] text-[#8e8e8e] hover:border-[#555555]'
                }`}
              >
                Bank Mandiri
              </button>
            </div>

            {/* Kartu Nomor Virtual Account */}
            <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8e8e8e] font-medium">{currentVa.bankName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a3a3a3]">
                  Verifikasi Otomatis
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[11px] text-[#737373] block">Nomor Virtual Account</span>
                  <span className="text-base font-bold text-white tracking-wide">
                    {currentVa.formattedNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(currentVa.accountNumber, 'va')}
                  className="px-3 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  {copiedKey === 'va' ? 'Tersalin' : 'Salin'}
                </button>
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-between text-xs text-[#8e8e8e]">
                <span>Nama Penerima</span>
                <span className="text-white font-medium">{currentVa.accountHolder}</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Konten Kanal 3: Bayar Tunai di Kasir (Offline) */}
        {selectedChannel === 'kasir' && (
          <div className="p-4 rounded-[14px] bg-[#222222] border border-[#2e2e2e] mb-3 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-semibold text-white">Pembayaran Tunai di Lokasi</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#f2d953]/20 text-[#f2d953] font-medium">
                Pemesanan Offline
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] text-[#8e8e8e] block">Kode Antrean Kasir</span>
                <span className="text-xl font-bold text-[#f2d953] tracking-wider">
                  {cashierPaymentCode}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(cashierPaymentCode, 'kasir')}
                className="px-3 py-1.5 rounded-[8px] bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {copiedKey === 'kasir' ? 'Tersalin' : 'Salin'}
              </button>
            </div>

            <p className="text-[11px] text-[#8e8e8e] leading-relaxed pt-1 border-t border-white/5">
              Tunjukkan kode ini ke petugas kasir Blanca Padel sebelum batas waktu berakhir untuk pembayaran tunai atau kartu debit EDC.
            </p>
          </div>
        )}

        {/* 7. Rincian Nominal Tagihan (Selalu Tampil Sinkron) */}
        <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] mb-3">
          <div className="flex items-center justify-between text-xs text-[#8e8e8e] mb-1">
            <span>Wajib Dibayar Sekarang ({paymentType === 'dp' ? 'DP 50%' : 'Lunas 100%'})</span>
            <span className="text-white font-medium">{selectedSlot.courtName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#8e8e8e]">Total Tagihan</span>
            <span className="text-lg font-bold text-[#f2d953]">
              Rp {billAmount.toLocaleString('id-ID')}
            </span>
          </div>
          {paymentType === 'dp' && (
            <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-[#8e8e8e]">
              Sisa pelunasan <span className="text-white font-semibold">Rp {remainingAmount.toLocaleString('id-ID')}</span> dilunasi saat tiba di arena.
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
