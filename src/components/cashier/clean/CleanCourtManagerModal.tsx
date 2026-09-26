import { useState } from 'react'
import { Plus, Edit2, Trash2, Settings, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Lapangan, StatusLapangan } from '../../../types/database'
import { createLapangan, updateLapangan, deleteLapangan } from '../../../lib/api'
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
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'

interface CleanCourtManagerModalProps {
  courts: Lapangan[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CleanCourtManagerModal({
  courts,
  isOpen,
  onClose,
  onSuccess,
}: CleanCourtManagerModalProps) {
  const [editingCourt, setEditingCourt] = useState<Lapangan | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<{
    nama_lapangan: string
    tarif_per_jam: number
    status: StatusLapangan
  }>({
    nama_lapangan: '',
    tarif_per_jam: 150000,
    status: 'Aktif',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleStartCreate = () => {
    setEditingCourt(null)
    setFormData({
      nama_lapangan: `Lapangan ${courts.length + 1} (Futsal)`,
      tarif_per_jam: 150000,
      status: 'Aktif',
    })
    setIsCreating(true)
    setErrorMsg(null)
  }

  const handleStartEdit = (court: Lapangan) => {
    setIsCreating(false)
    setEditingCourt(court)
    setFormData({
      nama_lapangan: court.nama_lapangan,
      tarif_per_jam: court.tarif_per_jam,
      status: court.status,
    })
    setErrorMsg(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!formData.nama_lapangan.trim()) {
      setErrorMsg('Nama lapangan wajib diisi.')
      return
    }

    try {
      setIsProcessing(true)

      if (isCreating) {
        await createLapangan({
          nama_lapangan: formData.nama_lapangan.trim(),
          tarif_per_jam: Number(formData.tarif_per_jam),
          status: formData.status,
        })
      } else if (editingCourt) {
        await updateLapangan(editingCourt.id, {
          nama_lapangan: formData.nama_lapangan.trim(),
          tarif_per_jam: Number(formData.tarif_per_jam),
          status: formData.status,
        })
      }

      setIsCreating(false)
      setEditingCourt(null)
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan data lapangan.'
      setErrorMsg(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Hapus master data lapangan ini? Tindakan ini akan divalidasi oleh database.')) {
      try {
        setIsProcessing(true)
        await deleteLapangan(id)
        onSuccess()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal menghapus lapangan.'
        alert(msg)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto" onClose={onClose}>
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4 text-zinc-300" />
              <span>Kelola Master Lapangan</span>
            </DialogTitle>
            {!isCreating && !editingCourt && (
              <Button size="sm" onClick={handleStartCreate} className="h-8 text-xs bg-zinc-100 text-zinc-900 font-semibold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Tambah</span>
              </Button>
            )}
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            Katalog lapangan, tarif per jam, dan ketersediaan operasional
          </DialogDescription>
        </DialogHeader>

        {/* Formulir Tambah / Edit */}
        {(isCreating || editingCourt) && (
          <form onSubmit={handleSave} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col gap-3 my-2">
            <h4 className="text-xs font-semibold text-zinc-200">
              {isCreating ? 'Tambah Lapangan Baru' : `Edit ${editingCourt?.nama_lapangan}`}
            </h4>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-300">Nama Lapangan</label>
                <Input
                  type="text"
                  value={formData.nama_lapangan}
                  onChange={(e) => setFormData({ ...formData, nama_lapangan: e.target.value })}
                  placeholder="Contoh: Lapangan 5 (Badminton)"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-300">Tarif per Jam (Rp)</label>
                <Input
                  type="number"
                  value={formData.tarif_per_jam}
                  onChange={(e) => setFormData({ ...formData, tarif_per_jam: Number(e.target.value) })}
                  step={5000}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-300">Status Operasional</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusLapangan })}
                className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 outline-none"
              >
                <option value="Aktif">Aktif (Dapat Dipesan)</option>
                <option value="Tutup">Tutup / Maintenance</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false)
                  setEditingCourt(null)
                }}
                disabled={isProcessing}
                className="h-8 text-xs"
              >
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={isProcessing} className="h-8 text-xs bg-zinc-100 text-zinc-900 font-semibold">
                {isProcessing ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        )}

        {/* Tabel Master Lapangan */}
        <div className="flex flex-col gap-2 my-2">
          {courts.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-zinc-100">{c.nama_lapangan}</div>
                <div className="text-zinc-400 mt-0.5">{formatRupiah(c.tarif_per_jam)} / jam</div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={c.status === 'Aktif' ? 'success' : 'secondary'} className="text-[10px]">
                  {c.status}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartEdit(c)}
                  className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
                  title="Edit Lapangan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(c.id)}
                  className="h-7 w-7 text-zinc-400 hover:text-red-400"
                  title="Hapus Lapangan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="pt-2 border-t border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
