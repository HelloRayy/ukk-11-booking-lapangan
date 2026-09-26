import { useState, useEffect, useMemo } from 'react'
import { Plus, Clock, AlertCircle } from 'lucide-react'
import type { Lapangan, TipeBayar } from '../../../types/database'
import { getBookedSlots, createBooking } from '../../../lib/api'
import { DAFTAR_JAM } from '../../../constants/operationalHours'
import { formatRupiah, getTodayISODate } from '../../../utils/formatters'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'

interface CleanWalkinModalProps {
  courts: Lapangan[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialCourtId?: number
  initialDate?: string
  initialHour?: string
}

export function CleanWalkinModal({
  courts,
  isOpen,
  onClose,
  onSuccess,
  initialCourtId,
  initialDate,
  initialHour,
}: CleanWalkinModalProps) {
  const today = getTodayISODate()

  const [selectedCourtId, setSelectedCourtId] = useState<number>(1)
  const [selectedDate, setSelectedDate] = useState<string>(today)
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentType, setPaymentType] = useState<TipeBayar>('Lunas')
  const [notes, setNotes] = useState('')

  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Inisialisasi awal saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (initialCourtId) setSelectedCourtId(initialCourtId)
      else if (courts.length > 0) setSelectedCourtId(courts[0].id)

      if (initialDate) setSelectedDate(initialDate)
      else setSelectedDate(today)

      if (initialHour) setSelectedHours([initialHour])
      else setSelectedHours([])

      setCustomerName('')
      setCustomerPhone('')
      setPaymentType('Lunas')
      setNotes('')
      setErrorMsg(null)
    }
  }, [isOpen, initialCourtId, initialDate, initialHour, courts, today])

  // Cek ketersediaan slot yang sudah dibooking
  useEffect(() => {
    if (!isOpen || !selectedCourtId || !selectedDate) return

    let isMounted = true
    setIsLoadingSlots(true)

    getBookedSlots(selectedCourtId, selectedDate)
      .then((slots) => {
        if (isMounted) setBookedSlots(slots)
      })
      .catch((err) => {
        console.error('Gagal mengambil jadwal booked:', err)
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, selectedCourtId, selectedDate])

  const selectedCourt = useMemo(() => {
    return courts.find((c) => c.id === selectedCourtId) || courts[0]
  }, [courts, selectedCourtId])

  // Kalkulasi tarif
  const pricing = useMemo(() => {
    const ratePerHour = selectedCourt ? selectedCourt.tarif_per_jam : 0
    const duration = selectedHours.length
    const total = duration * ratePerHour
    const nominalDibayar = paymentType === 'DP' ? Math.round(total * 0.5) : total
    const sisaBayar = total - nominalDibayar

    return { duration, total, nominalDibayar, sisaBayar }
  }, [selectedCourt, selectedHours, paymentType])

  // Toggle jam
  const handleToggleHour = (hour: string) => {
    if (bookedSlots.includes(hour)) return

    setSelectedHours((prev) => {
      if (prev.includes(hour)) {
        return prev.filter((h) => h !== hour)
      } else {
        return [...prev, hour].sort((a, b) => parseInt(a) - parseInt(b))
      }
    })
  }

  // Submit booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!customerName.trim()) {
      setErrorMsg('Nama pemesan wajib diisi.')
      return
    }

    if (!customerPhone.trim()) {
      setErrorMsg('Nomor WhatsApp wajib diisi.')
      return
    }

    if (selectedHours.length === 0) {
      setErrorMsg('Pilih minimal 1 jam slot bermain.')
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        lapangan_id: selectedCourtId,
        nama_penyewa: customerName.trim(),
        no_hp: customerPhone.trim(),
        tgl_main: selectedDate,
        jam_slots: selectedHours,
        durasi_jam: pricing.duration,
        total_bayar: pricing.total,
        nominal_dibayar: pricing.nominalDibayar,
        sisa_bayar: pricing.sisaBayar,
        tipe_bayar: paymentType,
        status: (paymentType === 'Lunas' ? 'Lunas' : 'Booked') as 'Lunas' | 'Booked',
      }

      await createBooking(payload)
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan reservasi.'
      setErrorMsg(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4 text-zinc-300" />
            <span>Input Booking Baru</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Pencatatan reservasi langsung di kasir
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Pelanggan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-300">Nama Pemesan</label>
              <Input
                type="text"
                placeholder="Contoh: Budi Pratama"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-300">Nomor WhatsApp</label>
              <Input
                type="tel"
                placeholder="Contoh: 08123456789"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Pilihan Lapangan & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-300">Lapangan</label>
              <select
                value={selectedCourtId}
                onChange={(e) => setSelectedCourtId(Number(e.target.value))}
                className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm text-zinc-100 outline-none"
              >
                {courts.map((c) => (
                  <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-100">
                    {c.nama_lapangan} - {formatRupiah(c.tarif_per_jam)}/jam
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-300">Tanggal Main</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Grid Pilihan Jam */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Pilih Slot Jam</span>
              </label>
              {isLoadingSlots && <span className="text-[11px] text-zinc-500">Memeriksa jadwal...</span>}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {DAFTAR_JAM.map((jam) => {
                const isBooked = bookedSlots.includes(jam)
                const isSelected = selectedHours.includes(jam)

                return (
                  <button
                    key={jam}
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleToggleHour(jam)}
                    className={`h-8 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      isBooked
                        ? 'bg-zinc-900 text-zinc-600 border border-zinc-900 line-through cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-100 shadow-xs'
                        : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {jam}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Skema Bayar & Ringkasan Tarif */}
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
            <label className="text-xs font-medium text-zinc-300">Metode Bayar</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentType('Lunas')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                  paymentType === 'Lunas'
                    ? 'border-zinc-100 bg-zinc-800/80 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-semibold">Bayar Lunas (100%)</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Selesai di tempat</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType('DP')}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                  paymentType === 'DP'
                    ? 'border-zinc-100 bg-zinc-800/80 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-semibold">Uang Muka (DP 50%)</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Pelunasan sebelum main</div>
              </button>
            </div>
          </div>

          {/* Rangkuman Biaya */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Total Durasi:</span>
              <span className="text-zinc-200">{pricing.duration} Jam</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Total Tarif:</span>
              <span className="font-semibold text-zinc-100">{formatRupiah(pricing.total)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-800 font-semibold">
              <span className="text-zinc-200">Dibayar Sekarang:</span>
              <span className="text-emerald-400">{formatRupiah(pricing.nominalDibayar)}</span>
            </div>
            {pricing.sisaBayar > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Sisa Tagihan (Saat Main):</span>
                <span>{formatRupiah(pricing.sisaBayar)}</span>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 border-t border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || selectedHours.length === 0}
              className="bg-zinc-100 text-zinc-900 font-semibold hover:bg-zinc-200"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
