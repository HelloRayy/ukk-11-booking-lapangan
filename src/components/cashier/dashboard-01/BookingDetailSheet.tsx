// PERAN FILE: Panel Samping Kanan (Right Sheet) untuk Rincian Lengkap Transaksi Kasir & Pelunasan (Tunai / QRIS)
import { useState, useEffect, useRef } from 'react'
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
  Banknote,
  QrCode,
  ChevronDown,
  ArrowLeft,
  ArrowUpRight,
} from 'lucide-react'
import type { Booking } from '../../../types/database'
import { formatSlotRange } from '../../../lib/utils'

interface BookingDetailSheetProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onNavigateToSchedule?: (date?: string, bookingId?: number | string) => void
}

export default function BookingDetailSheet({
  booking,
  isOpen,
  onClose,
  onLunasi,
  onBatal,
  onNavigateToSchedule,
}: BookingDetailSheetProps) {
  // State Mode Tampilan: 'detail' (rincian umum) atau 'qris' (layar QRIS dinamis)
  const [sheetMode, setSheetMode] = useState<'detail' | 'qris'>('detail')
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(900) // 15 menit
  const paymentDropdownRef = useRef<HTMLDivElement>(null)

  // Reset state saat modal dibuka atau booking berganti
  useEffect(() => {
    setSheetMode('detail')
    setIsPaymentDropdownOpen(false)
  }, [booking?.id, isOpen])

  // Click outside listener untuk dropdown metode pembayaran
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setIsPaymentDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Hitung mundur waktu pembayaran QRIS (15 menit)
  useEffect(() => {
    if (sheetMode !== 'qris') return

    setSecondsRemaining(900)
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setSheetMode('detail')
          alert('Waktu pembayaran QRIS telah habis (15 menit). Silakan pilih metode pembayaran lagi.')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [sheetMode])

  if (!isOpen || !booking) return null

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

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
    `Tanggal: ${booking.tgl_main} (${formatSlotRange(booking.jam_slots)})\n` +
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
        {sheetMode === 'qris' ? (
          /* TAMPILAN MODE QRIS DINAMIS */
          <div className="flex flex-col justify-between h-full min-h-[580px] animate-fadeIn">
            <div>
              {/* Header QRIS: Tombol Kembali & Countdown */}
              <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-5">
                <button
                  type="button"
                  onClick={() => setSheetMode('detail')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors border border-[#262626] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Rincian</span>
                </button>

                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase font-semibold text-[#8e8e8e] tracking-wider">
                    Sisa Waktu QRIS
                  </span>
                  <span
                    className={`text-xl font-bold tracking-tight leading-none mt-0.5 tabular-nums ${
                      secondsRemaining < 120 ? 'text-rose-400 animate-pulse' : 'text-[#f2d953]'
                    }`}
                  >
                    {formattedTime}
                  </span>
                </div>
              </div>

              {/* Judul & Info */}
              <div className="mb-4">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Pelunasan via QRIS Dinamis
                </h3>
                <p className="text-xs text-[#8e8e8e] mt-1 leading-relaxed">
                  Tunjukkan kode QRIS berikut ke pelanggan untuk dipindai via e-Wallet atau m-Banking.
                </p>
              </div>

              {/* Kartu Fisik QRIS */}
              <div className="p-4 rounded-xl bg-white text-black shadow-xl flex flex-col items-center mb-4">
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-gray-200 text-xs">
                  <span className="font-extrabold tracking-widest text-sm text-gray-900">QRIS</span>
                  <span className="text-[10px] text-gray-500 font-medium">GPN Interoperable</span>
                </div>

                <div className="w-44 h-44 bg-white p-1 rounded-lg flex items-center justify-center">
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
                  <span className="text-xs font-bold text-gray-900 block">BLANCA ARENA</span>
                  <span className="text-[10px] text-gray-500 block">NMID: ID1020039201948</span>
                </div>
              </div>

              {/* Rincian Tagihan Pelunasan */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-[#262626] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8e8e8e]">Tagihan Invoice</span>
                  <span className="font-semibold text-white">INV-{booking.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8e8e8e]">Nama Penyewa</span>
                  <span className="font-medium text-white">{booking.nama_penyewa}</span>
                </div>
                <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                  <span className="text-[#8e8e8e]">Nominal Pelunasan</span>
                  <span className="text-base font-bold text-emerald-400">
                    {formatRupiah(sisa)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol Aksi QRIS */}
            <div className="pt-4 border-t border-[#262626] space-y-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  onLunasi(booking.id)
                  onClose()
                }}
                className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Konfirmasi Pelunasan QRIS Selesai</span>
              </button>
              <button
                type="button"
                onClick={() => setSheetMode('detail')}
                className="w-full h-8 text-[#737373] hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Batal / Pilih Metode Lain</span>
              </button>
            </div>
          </div>
        ) : (
          /* TAMPILAN MODE DETAIL RINCIAN */
          <>
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
                    <span className="text-[#8e8e8e]">Rentang Jam</span>
                    <span className="font-semibold text-emerald-400">
                      {formatSlotRange(booking.jam_slots)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e8e8e]">Durasi</span>
                    <span className="text-white">{booking.durasi_jam} Jam</span>
                  </div>
                </div>

                {onNavigateToSchedule && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToSchedule(booking.tgl_main, booking.id)
                      onClose()
                    }}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-[#f2d953]/15 border border-[#333333] hover:border-[#f2d953]/40 text-[#f2d953] text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Buka di Jadwal Lapangan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
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
              {/* Tombol Pelunasan dengan Dropdown Opsi Pembayaran */}
              {!isLunas && !isBatal && (
                <div className="relative" ref={paymentDropdownRef}>
                  {/* Menu Dropdown Popup */}
                  {isPaymentDropdownOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 rounded-xl bg-[#1e1e1e] border border-[#2e2e2e] shadow-2xl z-30 animate-fadeIn space-y-1">
                      <div className="px-2.5 py-1.5 text-[10px] font-semibold text-[#8e8e8e] uppercase tracking-wider">
                        Pilih Metode Pelunasan
                      </div>

                      {/* Opsi 1: Tunai / Cash */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsPaymentDropdownOpen(false)
                          onLunasi(booking.id)
                          onClose()
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            Tunai (Cash di Meja)
                          </div>
                          <div className="text-[11px] text-[#8e8e8e] truncate">
                            Terima uang fisik dan langsung lunasi
                          </div>
                        </div>
                      </button>

                      {/* Opsi 2: QRIS Dinamis */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsPaymentDropdownOpen(false)
                          setSheetMode('qris')
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-[#f2d953] flex items-center justify-center shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white group-hover:text-[#f2d953] transition-colors">
                            QRIS Dinamis
                          </div>
                          <div className="text-[11px] text-[#8e8e8e] truncate">
                            Buka kode QR di panel kasir untuk scan
                          </div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Tombol Utama Pembuka Dropdown Pelunasan */}
                  <button
                    type="button"
                    onClick={() => setIsPaymentDropdownOpen((prev) => !prev)}
                    className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-between px-4"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Lunasi Sekarang ({formatRupiah(sisa)})</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isPaymentDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
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
          </>
        )}
      </aside>
    </div>
  )
}
