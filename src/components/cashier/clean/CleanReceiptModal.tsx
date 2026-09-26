import { useState } from 'react'
import { Receipt, Phone, Printer, Ban, ExternalLink, CreditCard } from 'lucide-react'
import type { Booking, Lapangan } from '../../../types/database'
import { formatRupiah, formatDisplayDate } from '../../../utils/formatters'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'

interface CleanReceiptModalProps {
  booking: Booking | null
  courts: Lapangan[]
  isOpen: boolean
  onClose: () => void
  onOpenLunasi: (booking: Booking) => void
  onBatal: (bookingId: number) => Promise<void>
}

export function CleanReceiptModal({
  booking,
  courts,
  isOpen,
  onClose,
  onOpenLunasi,
  onBatal,
}: CleanReceiptModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!booking) return null

  const courtName =
    courts.find((c) => c.id === booking.lapangan_id)?.nama_lapangan ||
    `Lapangan ${booking.lapangan_id}`

  const isLunas = booking.status === 'Lunas'
  const isBatal = booking.status === 'Batal'
  const isDP = booking.status === 'Booked' && booking.sisa_bayar > 0

  const handleBatalClick = async () => {
    if (confirm('Batalkan jadwal booking ini? Slot jam akan dibuka kembali untuk umum.')) {
      try {
        setIsProcessing(true)
        await onBatal(booking.id)
        onClose()
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Receipt className="w-4 h-4 text-zinc-300" />
            <span>Rincian Booking INV-{booking.id.toString().padStart(4, '0')}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Detail transaksi resmi Blanca Arena
          </DialogDescription>
        </DialogHeader>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col gap-2.5 my-2 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span>Nama Penyewa:</span>
            <span className="font-semibold text-zinc-100">{booking.nama_penyewa}</span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Nomor WhatsApp:</span>
            <a
              href={`https://wa.me/${booking.no_hp.replace(/^0/, '62')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-200 hover:text-zinc-100 font-mono flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>{booking.no_hp}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Lapangan:</span>
            <span className="font-medium text-zinc-200">{courtName}</span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Tanggal Main:</span>
            <span className="text-zinc-200">{formatDisplayDate(booking.tgl_main)}</span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Jam Sewa:</span>
            <span className="font-mono text-zinc-200">
              {(booking.jam_slots || []).join(', ')} ({booking.durasi_jam} Jam)
            </span>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex justify-between text-zinc-400">
            <span>Total Tarif:</span>
            <span className="font-semibold text-zinc-100">{formatRupiah(booking.total_bayar)}</span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Telah Dibayar:</span>
            <span className="font-semibold text-emerald-400">{formatRupiah(booking.nominal_dibayar)}</span>
          </div>

          {booking.sisa_bayar > 0 && (
            <div className="flex justify-between text-zinc-400">
              <span className="font-semibold text-zinc-200">Sisa Tagihan:</span>
              <span className="font-bold text-amber-400">{formatRupiah(booking.sisa_bayar)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-zinc-400">Status:</span>
            <Badge
              variant={isLunas ? 'success' : isDP ? 'warning' : 'secondary'}
              className="text-xs"
            >
              {isLunas ? 'Lunas' : isDP ? 'DP 50%' : 'Batal'}
            </Badge>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 border-t border-zinc-800">
          {!isBatal && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatalClick}
              disabled={isProcessing}
              className="w-full sm:w-auto text-red-400 border-red-900/50 hover:bg-red-950/30 text-xs"
            >
              <Ban className="w-3.5 h-3.5 mr-1" />
              <span>Batalkan</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="w-full sm:w-auto border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100 text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1" />
            <span>Cetak Struk</span>
          </Button>

          {isDP && (
            <Button
              size="sm"
              onClick={() => {
                onClose()
                onOpenLunasi(booking)
              }}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1" />
              <span>Lunasi</span>
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={onClose} className="w-full sm:w-auto text-xs">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
