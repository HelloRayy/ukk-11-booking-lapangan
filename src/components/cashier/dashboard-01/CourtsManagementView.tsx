// PERAN FILE: Halaman Standalone Kelola Master Lapangan Kasir (Card Grid + In-Place Edit + Switch Toggle)
import { useState } from 'react'
import {
  Layers,
  CircleDollarSign,
  Plus,
  Pencil,
  Check,
  X,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import type { Lapangan, StatusLapangan } from '../../../types/database'
import { createLapangan, updateLapangan, deleteLapangan } from '../../../lib/api'
import DeleteCourtDialog from './DeleteCourtDialog'

interface CourtsManagementViewProps {
  courts: Lapangan[]
  loading: boolean
  onCourtsUpdated: () => void
}

export default function CourtsManagementView({
  courts,
  loading,
  onCourtsUpdated,
}: CourtsManagementViewProps) {
  // State Form Tambah Lapangan Baru
  const [newNama, setNewNama] = useState('')
  const [newTarif, setNewTarif] = useState<number>(50000)
  const [newStatus, setNewStatus] = useState<StatusLapangan>('Aktif')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  // State In-Place Editing pada Kartu
  const [editingCourtId, setEditingCourtId] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<'nama' | 'tarif' | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // State Dialog Hapus Lapangan
  const [courtToDelete, setCourtToDelete] = useState<Lapangan | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // Hitung Metrik Ringkasan
  const totalCourts = courts.length
  const activeCourts = courts.filter((c) => c.status === 'Aktif').length
  const closedCourts = courts.filter((c) => c.status === 'Tutup').length
  const avgRate = totalCourts
    ? Math.round(courts.reduce((acc, c) => acc + c.tarif_per_jam, 0) / totalCourts)
    : 0

  // 1. Aksi Tambah Lapangan Baru (Poin 10 Kisi-Kisi UKK)
  const handleCreateCourt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNama.trim()) {
      setFormError('Nama lapangan tidak boleh kosong.')
      return
    }
    if (newTarif <= 0) {
      setFormError('Tarif per jam harus lebih dari 0.')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)
      setFormSuccess(null)
      await createLapangan({
        nama_lapangan: newNama.trim(),
        tarif_per_jam: Number(newTarif),
        status: newStatus,
      })
      setNewNama('')
      setNewTarif(50000)
      setNewStatus('Aktif')
      setFormSuccess('Lapangan baru berhasil disimpan ke database!')
      onCourtsUpdated()
      setTimeout(() => setFormSuccess(null), 3000)
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan lapangan baru.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Aksi Toggle Status Lapangan (Aktif <-> Tutup)
  const handleToggleStatus = async (court: Lapangan) => {
    const nextStatus: StatusLapangan = court.status === 'Aktif' ? 'Tutup' : 'Aktif'
    try {
      setActionError(null)
      await updateLapangan(court.id, { status: nextStatus })
      onCourtsUpdated()
    } catch (err: any) {
      setActionError(err.message || 'Gagal mengubah status lapangan.')
    }
  }

  // 3. Aksi In-Place Edit Nama atau Tarif (Poin 11 Kisi-Kisi UKK)
  const startEdit = (court: Lapangan, field: 'nama' | 'tarif') => {
    setEditingCourtId(court.id)
    setEditingField(field)
    setEditValue(field === 'nama' ? court.nama_lapangan : String(court.tarif_per_jam))
    setActionError(null)
  }

  const cancelEdit = () => {
    setEditingCourtId(null)
    setEditingField(null)
    setEditValue('')
  }

  const saveEdit = async (courtId: number) => {
    if (!editingField) return
    try {
      setIsSavingEdit(true)
      setActionError(null)

      if (editingField === 'nama') {
        const trimmed = editValue.trim()
        if (!trimmed) throw new Error('Nama lapangan tidak boleh kosong.')
        await updateLapangan(courtId, { nama_lapangan: trimmed })
      } else if (editingField === 'tarif') {
        const parsed = parseInt(editValue, 10)
        if (isNaN(parsed) || parsed <= 0) throw new Error('Tarif harus lebih dari 0.')
        await updateLapangan(courtId, { tarif_per_jam: parsed })
      }

      onCourtsUpdated()
      cancelEdit()
    } catch (err: any) {
      setActionError(err.message || 'Gagal memperbarui data lapangan.')
    } finally {
      setIsSavingEdit(false)
    }
  }

  // 4. Aksi Hapus Lapangan (Poin 12 Kisi-Kisi UKK)
  const openDeleteDialog = (court: Lapangan) => {
    setCourtToDelete(court)
    setIsDeleteDialogOpen(true)
    setActionError(null)
  }

  const confirmDeleteCourt = async () => {
    if (!courtToDelete) return
    try {
      setIsDeleting(true)
      setActionError(null)
      await deleteLapangan(courtToDelete.id)
      onCourtsUpdated()
      setIsDeleteDialogOpen(false)
      setCourtToDelete(null)
    } catch (err: any) {
      setActionError(err.message || 'Gagal menghapus lapangan.')
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-sans text-zinc-100">
      {/* 1. Header & Metrik Statistik Ringkasan */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Kelola Master Lapangan
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Konfigurasi ketersediaan, tarif per jam, serta status operasional lapangan arena olahraga.
          </p>
        </div>

        {/* Notifikasi Global Error Jika Terjadi Kendala */}
        {actionError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-rose-400 hover:text-rose-300 font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 Kartu Metrik Ringkasan */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-zinc-400">Total Lapangan</span>
              <div className="text-xl font-bold text-zinc-100 mt-0.5">{totalCourts}</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-zinc-400">Lapangan Aktif</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{activeCourts}</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-zinc-400">Tutup / Perbaikan</span>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{closedCourts}</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-zinc-400">Rata-rata Tarif</span>
              <div className="text-xl font-bold text-zinc-100 mt-0.5">
                Rp {avgRate.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-400">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Area Konten Utama (Grid Kartu Lapangan di Kiri + Form Tambah di Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Grid Kartu Lapangan (8 Kolom di Layar Besar) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Daftar Lapangan Tersedia ({courts.length})
            </span>
            <span className="text-[11px] text-zinc-500">
              Klik nama atau tarif untuk mengedit langsung
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              <span className="text-xs">Memuat data master lapangan...</span>
            </div>
          ) : courts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800/80 text-zinc-400 space-y-2">
              <p className="text-sm font-medium">Belum ada lapangan yang terdaftar.</p>
              <p className="text-xs text-zinc-500">
                Gunakan formulir di samping kanan untuk menambahkan lapangan pertama.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courts.map((court) => {
                const isEditingNama =
                  editingCourtId === court.id && editingField === 'nama'
                const isEditingTarif =
                  editingCourtId === court.id && editingField === 'tarif'
                const isAktif = court.status === 'Aktif'

                return (
                  <div
                    key={court.id}
                    className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-4 relative group shadow-xs"
                  >
                    {/* Header Kartu: ID Badge, Status Pill, & Switch Toggle */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                          #{court.id}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            isAktif
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {court.status}
                        </span>
                      </div>

                      {/* Switch Toggle Status Elegan (Pengganti Button Set Tutup) */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {isAktif ? 'Buka' : 'Tutup'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(court)}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer outline-none focus:ring-2 focus:ring-amber-400/40 ${
                            isAktif ? 'bg-emerald-500' : 'bg-zinc-700'
                          }`}
                          title={`Ubah status menjadi ${isAktif ? 'Tutup' : 'Aktif'}`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                              isAktif ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Nama Lapangan (Bisa diedit in-place) */}
                    <div>
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide block mb-1">
                        Nama Lapangan
                      </span>
                      {isEditingNama ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(court.id)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            autoFocus
                            disabled={isSavingEdit}
                            className="flex-1 text-xs py-1 px-2 rounded-lg bg-zinc-950 border border-amber-400 text-zinc-100 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => saveEdit(court.id)}
                            disabled={isSavingEdit}
                            className="p-1 rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 cursor-pointer"
                            title="Simpan"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isSavingEdit}
                            className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => startEdit(court, 'nama')}
                          className="flex items-center justify-between group/edit cursor-pointer p-1 -ml-1 rounded-lg hover:bg-zinc-800/40 transition-colors"
                          title="Klik untuk ubah nama lapangan"
                        >
                          <span className="text-sm font-bold text-zinc-100 tracking-tight">
                            {court.nama_lapangan}
                          </span>
                          <Pencil className="w-3 h-3 text-zinc-500 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>

                    {/* Tarif per Jam (Bisa diedit in-place) */}
                    <div>
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide block mb-1">
                        Tarif Sewa
                      </span>
                      {isEditingTarif ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="5000"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(court.id)
                              if (e.key === 'Escape') cancelEdit()
                            }}
                            autoFocus
                            disabled={isSavingEdit}
                            className="flex-1 text-xs py-1 px-2 rounded-lg bg-zinc-950 border border-amber-400 text-zinc-100 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => saveEdit(court.id)}
                            disabled={isSavingEdit}
                            className="p-1 rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 cursor-pointer"
                            title="Simpan"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isSavingEdit}
                            className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => startEdit(court, 'tarif')}
                          className="flex items-center justify-between group/edit cursor-pointer p-1 -ml-1 rounded-lg hover:bg-zinc-800/40 transition-colors"
                          title="Klik untuk ubah tarif per jam"
                        >
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold text-emerald-400">
                              Rp {court.tarif_per_jam.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-normal">/ jam</span>
                          </div>
                          <Pencil className="w-3 h-3 text-zinc-500 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>

                    {/* Footer Kartu: Tombol Aksi Hapus */}
                    <div className="pt-3 border-t border-zinc-800/70 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(court)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 text-xs font-medium border border-rose-500/20 hover:border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Form Tambah Lapangan Baru (4 Kolom di Layar Besar, Sticky) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-xs">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-100">
                  Tambah Lapangan Baru
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Daftarkan lapangan tambahan ke dalam sistem arena.
              </p>
            </div>

            {/* Alert Sukses */}
            {formSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Alert Error */}
            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCourt} className="space-y-3.5">
              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">
                  Nama Lapangan
                </label>
                <input
                  type="text"
                  placeholder="e.g. Court 4"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/80 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">
                  Tarif per Jam (Rp)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={newTarif}
                  onChange={(e) => setNewTarif(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 focus:outline-none focus:border-amber-400/80 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">
                  Status Operasional Awal
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as StatusLapangan)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 focus:outline-none focus:border-amber-400/80 transition-colors cursor-pointer"
                >
                  <option value="Aktif">Aktif (Dapat Dipesan)</option>
                  <option value="Tutup">Tutup (Dalam Perbaikan)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs cursor-pointer transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan ke Database...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Simpan Lapangan</span>
                  </>
                )}
              </button>
            </form>

            {/* Tips Panduan */}
            <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 leading-relaxed">
              Lapangan yang ditambahkan otomatis tersedia di kalender booking dan jadwal kasir.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Modal Dialog Konfirmasi Hapus Lapangan Khusus */}
      <DeleteCourtDialog
        isOpen={isDeleteDialogOpen}
        court={courtToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setCourtToDelete(null)
        }}
        onConfirm={confirmDeleteCourt}
      />
    </div>
  )
}
