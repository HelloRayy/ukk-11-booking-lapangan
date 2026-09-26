import { useState } from 'react'
import { CreditCard, CheckCircle2 } from 'lucide-react'
import type { Booking } from '../../../types/database'
import { formatRupiah } from '../../../utils/formatters'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog'
import { Button } from '../../ui/button'

interface CleanPaymentModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (bookingId: number) => Promise<void>
}

export function CleanPaymentModal({
  booking,
  isOpen,
  onClose,
  onConfirm,
}: CleanPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!booking) return null

  const handleConfirm = async () => {
    try {
      setIsProcessing(true)
      await onConfirm(booking.id)
      onClose()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Pelunasan Sisa Pembayaran</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Pencatatan pembayaran sisa tagihan di kasir
          </DialogDescription>
        </DialogHeader>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col gap-2.5 my-2 text-xs">
          <div className="flex justify-between text-zinc-400">
            <span>No. Invoice:</span>
            <span className="font-mono font-semibold text-zinc-200">
              INV-{booking.id.toString().padStart(4, '0')}
            </span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Nama Penyewa:</span>
            <span className="font-semibold text-zinc-200">{booking.nama_penyewa}</span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Total Tarif:</span>
            <span className="text-zinc-200">{formatRupiah(booking.total_bayar)}</span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Telah Dibayar (DP):</span>
            <span className="text-emerald-400 font-medium">{formatRupiah(booking.nominal_dibayar)}</span>
          </div>

          <div className="flex justify-between pt-3 border-t border-zinc-800 items-baseline">
            <span className="text-xs font-semibold text-zinc-200">Sisa Tagihan:</span>
            <span className="text-2xl font-bold text-amber-400">
              {formatRupiah(booking.sisa_bayar)}
            </span>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isProcessing}>
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span>{isProcessing ? 'Memproses...' : 'Konfirmasi Selesai Lunas'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
