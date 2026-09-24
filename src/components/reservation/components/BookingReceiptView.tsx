// PERAN FILE: Tampilan Bukti Reservasi / Struk Digital Resmi (Tahap 3) dengan Fitur Cetak PDF
import type { BookingItem } from '../types'
import { formatRupiah } from '../utils/formatters'

interface BookingReceiptViewProps {
  booking: BookingItem
  onClose: () => void
}

export default function BookingReceiptView({
  booking,
  onClose,
}: BookingReceiptViewProps) {
  const isLunas = booking.paymentType === 'Lunas'

  // Normalisasi nomor HP WhatsApp untuk share struk online (ROADTOUKK-20)
  const cleanPhone = (booking.customerWhatsapp || '').replace(/[^0-9]/g, '')
  const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
  const waReceiptText = encodeURIComponent(
    `*BUKTI RESERVASI RESMI - BLANCA BADMINTON ARENA*\n` +
    `No. Invoice: ${booking.invoiceNumber || booking.id}\n` +
    `Nama: ${booking.customerName}\n` +
    `Lapangan: ${booking.courtName}\n` +
    `Tanggal: ${booking.date}\n` +
    `Waktu: ${booking.startTime} - ${booking.endTime}\n` +
    `Total Biaya: ${formatRupiah(booking.totalPrice)}\n` +
    `Status Bayar: ${isLunas ? 'LUNAS 100%' : `DP 50% (Sisa ${formatRupiah(booking.remainingAmount || 0)})`}\n\n` +
    `Tunjukkan invoice ini di resepsionis saat check-in. Terima kasih!`
  )
  const waReceiptUrl = `https://wa.me/${intlPhone}?text=${waReceiptText}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col justify-between h-full select-none font-aeonik animate-in fade-in duration-200">
      <div className="overflow-y-auto pr-0.5 space-y-3.5">
        {/* 1. Header Konfirmasi Berhasil (no-print) */}
        <div className="flex items-center gap-3 p-3 rounded-[12px] bg-emerald-500/10 border border-emerald-500/20 no-print">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 block">
              Pembayaran Berhasil Terverifikasi
            </span>
            <span className="text-[11px] text-[#a3a3a3]">
              Slot lapangan Anda telah terkunci di kalender
            </span>
          </div>
        </div>

        {/* 2. Kartu Struk Resmi (#printable-receipt) */}
        <div
          id="printable-receipt"
          className="p-4 rounded-[14px] bg-[#202020] border border-[#2e2e2e] text-white shadow-lg space-y-3"
        >
          {/* Header Brand Struk */}
          <div className="text-center pb-2.5 border-b border-dashed border-white/15">
            <h2 className="text-sm font-bold tracking-tight text-white uppercase">
              BLANCA BADMINTON ARENA
            </h2>
            <p className="text-[10px] text-[#8e8e8e] mt-0.5">
              Sports Hub • Jl. Boulevard Raya No. 88, Tebet, Jakarta Selatan
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px]">
              <span className="text-[#8e8e8e]">No. Invoice:</span>
              <span className="font-bold text-[#f2d953] tracking-wide">
                {booking.invoiceNumber || booking.id}
              </span>
            </div>
            <div className="flex items-center justify-between mt-0.5 text-[10px] text-[#8e8e8e]">
              <span>Waktu Transaksi:</span>
              <span>{booking.createdAt || 'Hari Ini'}</span>
            </div>
          </div>

          {/* Status Pembayaran */}
          <div className="flex items-center justify-between py-1 px-2.5 rounded-[8px] bg-white/[0.03] border border-white/5">
            <span className="text-xs text-[#8e8e8e]">Status Bayar</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                isLunas
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {isLunas ? 'LUNAS 100%' : 'DP 50% TERBAYAR'}
            </span>
          </div>

          {/* Rincian Jadwal & Lapangan */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8e8e8e] block">
              Rincian Lapangan
            </span>
            <div className="flex justify-between">
              <span className="text-[#8e8e8e]">Nama Lapangan</span>
              <span className="font-semibold text-white">{booking.courtName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8e8e]">Tanggal Main</span>
              <span className="font-medium text-white">{booking.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8e8e]">Jam Sewa</span>
              <span className="font-semibold text-[#f2d953]">
                {booking.startTime} - {booking.endTime}
              </span>
            </div>
          </div>

          {/* Rincian Finansial */}
          <div className="pt-2 border-t border-dashed border-white/15 space-y-1.5 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8e8e8e] block">
              Rincian Biaya
            </span>
            <div className="flex justify-between text-[#8e8e8e]">
              <span>Total Tagihan Sewa</span>
              <span className="text-white font-medium">
                {formatRupiah(booking.totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-[#8e8e8e]">
              <span>Dibayar Sekarang (QRIS)</span>
              <span className="text-emerald-400 font-semibold">
                {formatRupiah(booking.paidAmount)}
              </span>
            </div>
            {!isLunas && (
              <div className="flex justify-between pt-1 border-t border-white/5 text-amber-300 font-semibold">
                <span>Sisa Pelunasan di Arena</span>
                <span>{formatRupiah(booking.remainingAmount)}</span>
              </div>
            )}
          </div>

          {/* Identitas Pemesan */}
          <div className="pt-2 border-t border-dashed border-white/15 space-y-1 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8e8e8e] block">
              Data Pemesan
            </span>
            <div className="flex justify-between">
              <span className="text-[#8e8e8e]">Nama</span>
              <span className="font-medium text-white">{booking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8e8e]">WhatsApp</span>
              <span className="text-[#d4d4d4]">{booking.customerWhatsapp}</span>
            </div>
            {booking.notes && (
              <div className="pt-1 text-[11px] text-[#8e8e8e] italic">
                Catatan: "{booking.notes}"
              </div>
            )}
          </div>

          {/* Kode Barcode Check-in Digital */}
          <div className="pt-2.5 border-t border-dashed border-white/15 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase tracking-wider font-medium text-[#8e8e8e] mb-1.5">
              Kode Check-in Arena
            </span>

            {/* Dummy Barcode Lines */}
            <div className="bg-white p-2 rounded-[6px] flex items-center justify-center gap-0.5 h-10 w-full max-w-[220px]">
              <div className="w-1 h-7 bg-black" />
              <div className="w-0.5 h-7 bg-black" />
              <div className="w-1.5 h-7 bg-black" />
              <div className="w-0.5 h-7 bg-black" />
              <div className="w-2 h-7 bg-black" />
              <div className="w-1 h-7 bg-black" />
              <div className="w-0.5 h-7 bg-black" />
              <div className="w-2 h-7 bg-black" />
              <div className="w-1 h-7 bg-black" />
              <div className="w-0.5 h-7 bg-black" />
              <div className="w-1.5 h-7 bg-black" />
              <div className="w-1 h-7 bg-black" />
              <div className="w-0.5 h-7 bg-black" />
              <div className="w-2 h-7 bg-black" />
              <div className="w-1 h-7 bg-black" />
              <div className="w-0.5 h-7 bg-black" />
              <div className="w-1 h-7 bg-black" />
              <div className="w-1.5 h-7 bg-black" />
              <div className="w-0.5 h-7 bg-black" />
              <div className="w-2 h-7 bg-black" />
              <div className="w-0.5 h-7 bg-black" />
              <div className="w-1 h-7 bg-black" />
            </div>
            <span className="text-[10px] text-[#8e8e8e] mt-1 font-mono tracking-widest">
              {booking.invoiceNumber || booking.id}
            </span>
            <p className="text-[10px] text-[#737373] mt-0.5">
              Tunjukkan barcode ini kepada resepsionis saat tiba di venue.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Tombol Aksi Bawah (no-print) */}
      <div className="pt-3 border-t border-[#262626] space-y-2 no-print">
        {/* Tombol Kirim ke WhatsApp (ROADTOUKK-20) */}
        {cleanPhone.length >= 9 && (
          <a
            href={waReceiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-10 rounded-[10px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.148-.541-1.861-.772-3.055-2.664-3.148-2.787-.093-.122-.756-.998-.756-1.903 0-.905.474-1.349.643-1.534.169-.185.37-.231.493-.231.123 0 .247.002.355.008.113.006.265-.043.415.318.155.372.531 1.298.578 1.393.047.095.078.207.016.33-.062.123-.093.2-.185.308-.092.108-.194.24-.277.323-.092.092-.188.192-.081.376.107.184.477.787 1.025 1.275.706.629 1.301.824 1.486.916.185.093.293.077.401-.046.108-.124.463-.539.587-.724.123-.185.246-.154.415-.092.17.061 1.08.509 1.266.601.185.093.308.139.355.216.046.077.046.447-.098.852z"/>
            </svg>
            <span>Kirim Bukti ke WhatsApp</span>
          </a>
        )}

        <button
          type="button"
          onClick={handlePrint}
          className="w-full h-11 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span>Cetak Bukti Booking / PDF</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-10 rounded-[10px] bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/10 text-center"
        >
          Kembali ke Kalender
        </button>
      </div>
    </div>
  )
}
