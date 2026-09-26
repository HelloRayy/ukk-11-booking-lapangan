// PERAN FILE: Panel Samping Kanan (Right Drawer) Input Booking Walk-in Kasir (Konsisten dengan UI Reservasi)
import { useState, useEffect } from 'react'
import {
  X,
  Clock,
  User,
  Phone,
  ArrowRight,
  ChevronDown,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react'
import type { Lapangan, TipeBayar, StatusBooking } from '../../types/database'
import { getBookedSlots, createBooking } from '../../lib/api'
import { TIME_SLOTS } from '../reservation/constants/scheduleConfig'

interface ManualBookingModalProps {
  courts: Lapangan[]
  isOpen: boolean
  onClose: () => void
  onBookingCreated: () => void
  initialCourtId?: number
  initialDate?: string
  initialHour?: string
}

export default function ManualBookingModal({
  courts,
  isOpen,
  onClose,
  onBookingCreated,
  initialCourtId,
  initialDate,
  initialHour,
}: ManualBookingModalProps) {
  const today = new Date().toISOString().split('T')[0]

  const [selectedCourtId, setSelectedCourtId] = useState<number>(courts[0]?.id || 1)
  const [selectedDate, setSelectedDate] = useState<string>(today)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [namaPenyewa, setNamaPenyewa] = useState('')
  const [noHp, setNoHp] = useState('')
  const [notes, setNotes] = useState('')
  const [tipeBayar, setTipeBayar] = useState<TipeBayar>('Lunas')
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Sinkronisasi nilai inisial saat panel dibuka
  useEffect(() => {
    if (isOpen) {
      if (initialCourtId) setSelectedCourtId(initialCourtId)
      if (initialDate) setSelectedDate(initialDate)
      if (initialHour) setSelectedHours([initialHour])
      setErrorMessage(null)
    }
  }, [isOpen, initialCourtId, initialDate, initialHour])

  // Shortcut tombol Escape untuk menutup panel kanan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Cek ketersediaan slot jam setiap kali lapangan atau tanggal berubah
  useEffect(() => {
    if (!isOpen || !selectedCourtId) return
    async function fetchAvailability() {
      setIsLoadingSlots(true)
      try {
        const booked = await getBookedSlots(selectedCourtId, selectedDate)
        setBookedSlots(booked)
        // Reset jam terpilih jika jam tersebut ternyata sudah dibooking orang lain
        setSelectedHours((prev) => prev.filter((h) => !booked.includes(h)))
      } catch (err) {
        console.error('Gagal mengambil ketersediaan slot:', err)
      } finally {
        setIsLoadingSlots(false)
      }
    }
    fetchAvailability()
  }, [selectedCourtId, selectedDate, isOpen])

  if (!isOpen) return null

  const activeCourt = courts.find((c) => c.id === selectedCourtId) || courts[0]
  const tarifPerJam = activeCourt?.tarif_per_jam || 50000
  const durasiJam = selectedHours.length
  const totalBayar = durasiJam * tarifPerJam
  const nominalDibayar = tipeBayar === 'DP' ? totalBayar * 0.5 : totalBayar
  const sisaBayar = totalBayar - nominalDibayar

  const toggleHour = (hour: string) => {
    if (selectedHours.includes(hour)) {
      setSelectedHours(selectedHours.filter((h) => h !== hour))
    } else {
      setSelectedHours([...selectedHours, hour].sort((a, b) => parseInt(a) - parseInt(b)))
    }
  }

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!namaPenyewa.trim()) {
      setErrorMessage('Nama penyewa wajib diisi.')
      return
    }
    if (selectedHours.length === 0) {
      setErrorMessage('Pilih minimal 1 slot jam bermain.')
      return
    }
    if (noHp.trim().length > 0 && !/^08\d{8,11}$/.test(noHp.trim())) {
      setErrorMessage('Nomor WhatsApp harus berawalan 08 dan memiliki 10-13 digit angka.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const statusBooking: StatusBooking = tipeBayar === 'Lunas' ? 'Lunas' : 'Booked'

      await createBooking({
        lapangan_id: selectedCourtId,
        nama_penyewa: `${namaPenyewa.trim()} (Walk-in)`,
        no_hp: noHp.trim() || '0800000000',
        tgl_main: selectedDate,
        jam_slots: selectedHours,
        durasi_jam: durasiJam,
        total_bayar: totalBayar,
        nominal_dibayar: nominalDibayar,
        sisa_bayar: sisaBayar,
        tipe_bayar: tipeBayar,
        status: statusBooking,
      })

      onBookingCreated()
      onClose()
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Gagal menyimpan booking walk-in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none font-aeonik">
      {/* 1. Backdrop Overlay Lembut (Bisa klik untuk keluar) */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* 2. Slide-over Right Panel Drawer */}
      <aside className="relative z-10 w-full sm:w-[460px] md:w-[500px] h-full bg-[#161616] border-l border-[#262626] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header Drawer */}
        <div className="shrink-0 p-5 border-b border-[#262626] bg-[#181818] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f2d953]" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Input Booking Walk-in
              </h2>
            </div>
            <p className="text-xs text-[#8e8e8e] mt-0.5">
              Pemesanan langsung di loket kasir arena
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            title="Tutup panel (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Lapangan & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8e8e8e] block">
                Pilih Lapangan
              </label>
              <div className="relative">
                <select
                  value={selectedCourtId}
                  onChange={(e) => setSelectedCourtId(Number(e.target.value))}
                  className="w-full h-11 px-3 pr-8 rounded-xl border border-[#2e2e2e] bg-[#1c1c1c] text-xs font-semibold text-white focus:outline-none focus:border-[#f2d953] transition-colors cursor-pointer appearance-none"
                >
                  {courts.map((court) => (
                    <option key={court.id} value={court.id} disabled={court.status === 'Tutup'}>
                      {court.nama_lapangan} (Rp {Math.round(court.tarif_per_jam / 1000)}k/jam)
                      {court.status === 'Tutup' ? ' - [TUTUP]' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#8e8e8e] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8e8e8e] block">
                Tanggal Main
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#2e2e2e] bg-[#1c1c1c] text-xs font-semibold text-white focus:outline-none focus:border-[#f2d953] transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Grid Jam Slot Sewa */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#f2d953]" />
                <span className="text-xs font-semibold text-white">Pilih Jam Sewa</span>
                {isLoadingSlots && (
                  <span className="text-[11px] text-[#f2d953] animate-pulse font-normal">
                    (Memeriksa...)
                  </span>
                )}
              </div>
              <span className="text-xs text-[#8e8e8e]">
                Terpilih: <strong className="text-[#f2d953] font-bold">{durasiJam} Jam</strong>
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {TIME_SLOTS.map((hour) => {
                const isBooked = bookedSlots.includes(hour)
                const isSelected = selectedHours.includes(hour)

                return (
                  <button
                    key={hour}
                    type="button"
                    disabled={isBooked}
                    onClick={() => toggleHour(hour)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                      isBooked
                        ? 'bg-white/[0.03] text-[#555555] line-through cursor-not-allowed border border-[#262626]'
                        : isSelected
                        ? 'bg-[#f2d953] text-[#161616] font-bold border border-[#f2d953] shadow-[0_0_12px_rgba(242,217,83,0.25)]'
                        : 'bg-[#1c1c1c] text-[#d1d1d1] hover:text-white hover:border-[#444444] border border-[#2e2e2e]'
                    }`}
                  >
                    {hour}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Data Penyewa */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-white block">
              Data Calon Penyewa
            </span>

            <div className="space-y-1">
              <div className="relative">
                <User className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Nama Penyewa (e.g. Budi Santoso)"
                  value={namaPenyewa}
                  onChange={(e) => setNamaPenyewa(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#2e2e2e] bg-[#1c1c1c] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Phone className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Nomor WhatsApp (e.g. 08123456789)"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  className={`w-full h-11 pl-10 pr-3 rounded-xl border bg-[#1c1c1c] text-xs text-white placeholder:text-[#555555] focus:outline-none transition-colors ${
                    noHp.trim().length > 0 && !/^08\d{8,11}$/.test(noHp.trim())
                      ? 'border-rose-500/70 focus:border-rose-500'
                      : 'border-[#2e2e2e] focus:border-[#f2d953]'
                  }`}
                />
              </div>
              {noHp.trim().length > 0 && !/^08\d{8,11}$/.test(noHp.trim()) && (
                <p className="text-[11px] text-rose-400 pl-1">
                  Nomor WA harus diawali 08 (10-13 digit).
                </p>
              )}
            </div>
          </div>

          {/* Section 4: Skema Pembayaran & Rincian Tagihan */}
          <div className="p-4 rounded-xl bg-[#202020] border border-[#2e2e2e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Skema Pembayaran</span>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141414] border border-[#282828]">
                <button
                  type="button"
                  onClick={() => setTipeBayar('DP')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    tipeBayar === 'DP'
                      ? 'bg-[#f2d953] text-[#161616] font-bold shadow-xs'
                      : 'text-[#8e8e8e] hover:text-white'
                  }`}
                >
                  DP 50%
                </button>
                <button
                  type="button"
                  onClick={() => setTipeBayar('Lunas')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    tipeBayar === 'Lunas'
                      ? 'bg-emerald-500 text-white font-bold shadow-xs'
                      : 'text-[#8e8e8e] hover:text-white'
                  }`}
                >
                  Lunas 100%
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#2e2e2e] space-y-1.5 text-xs text-[#8e8e8e]">
              <div className="flex items-center justify-between">
                <span>Tarif Lapangan:</span>
                <span className="text-white font-mono">{formatRupiah(tarifPerJam)}/jam</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Tagihan ({durasiJam} Jam):</span>
                <span className="text-white font-bold font-mono">{formatRupiah(totalBayar)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-white font-medium">
                  {tipeBayar === 'DP' ? 'Wajib Dibayar Sekarang (DP):' : 'Wajib Dibayar Sekarang (Lunas):'}
                </span>
                <span className={`font-bold font-mono text-sm ${tipeBayar === 'Lunas' ? 'text-emerald-400' : 'text-[#f2d953]'}`}>
                  {formatRupiah(nominalDibayar)}
                </span>
              </div>
              {tipeBayar === 'DP' && (
                <div className="flex items-center justify-between text-[11px] text-[#8e8e8e]">
                  <span>Sisa Pelunasan di Lokasi:</span>
                  <span className="text-[#f2d953] font-mono font-medium">
                    {formatRupiah(sisaBayar)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Catatan Tambahan (Opsional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#8e8e8e] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#737373]" />
              <span>Catatan Sewa (Opsional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: butuh 2 set rompi latihan / bayar tunai di kasir..."
              rows={2}
              className="w-full p-3 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors resize-none"
            />
          </div>

          {/* Spacer ekstra untuk scroll lancar */}
          <div className="h-2" />
        </form>

        {/* Footer Drawer */}
        <div className="shrink-0 p-5 border-t border-[#262626] bg-[#181818] space-y-3">
          <div className="flex items-baseline justify-between px-1">
            <div>
              <span className="text-xs text-[#8e8e8e] block">
                {tipeBayar === 'DP' ? 'Bayar Sekarang (DP 50%)' : 'Bayar Sekarang (Lunas)'}
              </span>
              {tipeBayar === 'DP' && (
                <span className="text-[11px] text-[#737373]">
                  Sisa {formatRupiah(sisaBayar)} nanti
                </span>
              )}
            </div>
            <span className="text-xl font-bold font-mono tracking-tight text-[#f2d953]">
              {formatRupiah(nominalDibayar)}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl bg-[#141414] hover:bg-white/5 text-[#8e8e8e] hover:text-white border border-[#2e2e2e] text-xs font-semibold cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isSubmitting || durasiJam === 0}
              onClick={handleSubmit}
              className="flex-1 h-11 rounded-xl bg-[#f2d953] hover:bg-[#ffe359] disabled:opacity-40 text-[#161616] text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Menyimpan...' : 'Konfirmasi & Simpan Booking'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
