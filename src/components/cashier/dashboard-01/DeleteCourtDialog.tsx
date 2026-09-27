// PERAN FILE: Modal Konfirmasi Hapus Lapangan Minimalis Khusus Dashboard Kasir
import { AlertTriangle, Loader2 } from 'lucide-react'
import type { Lapangan } from '../../../types/database'

interface DeleteCourtDialogProps {
  isOpen: boolean
  court: Lapangan | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteCourtDialog({
  isOpen,
  court,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCourtDialogProps) {
  if (!isOpen || !court) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-zinc-100 font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Header Ikon & Peringatan */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-100">
              Hapus Lapangan
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-zinc-200">{court.nama_lapangan}</span>? Data lapangan akan dihapus permanen dari sistem.
            </p>
          </div>
        </div>

        {/* Kotak Catatan Validasi UKK */}
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
          <span className="font-semibold text-zinc-300 block">Perlindungan Integritas Database:</span>
          <p>
            Sistem akan menolak penghapusan jika lapangan ini memiliki riwayat transaksi booking aktif. Jika hanya ingin menonaktifkan lapangan sementara, gunakan tombol toggle status menjadi Tutup.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-semibold border border-zinc-800 cursor-pointer transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>Hapus Permanen</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
