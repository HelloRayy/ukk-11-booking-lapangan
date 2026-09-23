// PERAN FILE: Panel Samping Kanan (Right Sheet) untuk Rincian Lengkap Transaksi Kasir
import {
  X,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Copy,
  Calendar,
  CreditCard,
  User,
  Check,
  Trash2,
} from 'lucide-react'
import type { Booking } from '../../../types/database'

interface BookingDetailSheetProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
}

export default function BookingDetailSheet({
  booking,
  isOpen,
  onClose,
  onLunasi,
  onBatal,
}: BookingDetailSheetProps) {
  if (!isOpen || !booking) return null

  const isLunas = booking.status === 'Lunas'
  const isBatal = booking.status === 'Batal'
  const sisa = booking.sisa_bayar || 0
  const courtName = booking.lapangan?.nama_lapangan || `Court ${booking.lapangan_id}`
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  // WhatsApp Link Helper
  const cleanPhone = (booking.no_hp || '').replace(/[^0-9]/g, '')
  const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
  const waText = encodeURIComponent(
    `*BLANCA ARENA - BUKTI SEWA*\n` +
    `Invoice: INV-${booking.id}\n` +
    `Penyewa: ${booking.nama_penyewa}\n` +
    `Lapangan: ${courtName}\n` +
    `Tanggal: ${booking.tgl_main} (${booking.jam_slots.join(', ')})\n` +
    `Total: ${formatRupiah(booking.total_bayar)}\n` +
    `Status: ${booking.status} (${isLunas ? 'LUNAS' : `Sisa ${formatRupiah(sisa)}`})\n\n` +
    `Tunjukkan pesan ini saat tiba di resepsionis arena. Terima kasih!`
  )
  const waUrl = `https://wa.me/${intlPhone}?text=${waText}`

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(booking.no_hp)
    alert('Nomor HP berhasil disalin!')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn select-none">
      {/* 1. Backdrop Overlay Gelap */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* 2. Panel Slide-over Kanan */}
      <aside className="relative z-10 w-full sm:w-[420px] bg-[#161616] border-l border-[#262626] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          {/* Header Panel: Invoice & Status */}
          <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
                INV-{booking.id}
              </span>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Detail Transaksi
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Badge Status */}
              {isLunas ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Lunas</span>
                </span>
              ) : isBatal ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium">
                  <XCircle className="w-3 h-3 text-rose-400" />
                  <span>Batal</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>DP 50%</span>
                </span>
              )}

              {/* Tombol Tutup */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[#8e8e8e] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bagian 1: Data Penyewa */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-[#262626] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Penyewa</span>
            </div>

            <div>
              <div className="text-base font-bold text-white">{booking.nama_penyewa}</div>
              <div className="flex items-center justify-between text-xs text-[#8e8e8e] mt-1">
                <span>{booking.no_hp}</span>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="flex items-center gap-1 text-[11px] text-[#737373] hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bagian 2: Rincian Jadwal Sewa */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-[#262626] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#f2d953]" />
              <span>Jadwal Lapangan</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8e8e8e]">Nama Lapangan</span>
                <span className="font-semibold text-white">{courtName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e8e8e]">Tanggal Main</span>
                <span className="font-medium text-white">{booking.tgl_main}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e8e8e]">Slot Jam</span>
                <span className="font-medium text-emerald-400">
                  {booking.jam_slots.join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e8e8e]">Durasi</span>
                <span className="text-white">{booking.durasi_jam} Jam</span>
              </div>
            </div>
          </div>

          {/* Bagian 3: Rincian Pembayaran */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-[#262626] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>Rincian Finansial</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8e8e8e]">Total Sewa</span>
                <span className="font-bold text-white">{formatRupiah(booking.total_bayar)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8e8e8e]">Sudah Dibayar ({booking.tipe_bayar})</span>
                <span className="font-medium text-emerald-400">
                  {formatRupiah(booking.nominal_dibayar)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                <span className="text-[#8e8e8e]">Sisa Tagihan Kasir</span>
                <span
                  className={`text-sm font-bold ${
                    sisa > 0 ? 'text-amber-400' : 'text-[#737373]'
                  }`}
                >
                  {sisa > 0 ? formatRupiah(sisa) : 'Lunas (Rp 0)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tombol Aksi Kasir */}
        <div className="pt-4 border-t border-[#262626] space-y-2 mt-6">
          {/* Tombol Pelunasan (Jika belum lunas dan tidak batal) */}
          {!isLunas && !isBatal && (
            <button
              type="button"
              onClick={() => {
                onLunasi(booking.id)
                onClose()
              }}
              className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Lunasi Sekarang ({formatRupiah(sisa)})</span>
            </button>
          )}

          {/* Tombol Chat WhatsApp */}
          {cleanPhone.length >= 9 && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-[#262626] text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kirim Bukti via WhatsApp</span>
            </a>
          )}

          {/* Tombol Batalkan Booking */}
          {!isBatal && (
            <button
              type="button"
              onClick={() => {
                onBatal(booking.id)
                onClose()
              }}
              className="w-full h-8 text-[#737373] hover:text-rose-400 text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Batalkan Booking</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}
