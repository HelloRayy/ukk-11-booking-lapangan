// ============================================================================
// MODUL KASIR: KELOLA MASTER LAPANGAN (CRUD & ENABLE/DISABLE STATUS)
// ============================================================================
// File ini dibuat sederhana agar mudah dipelajari untuk sidang UKK.
// 2 Fokus Utama:
// 1. CRUD Lapangan (Tambah, Lihat, Hapus Lapangan)
// 2. Set Status Lapangan: Aktif (Enable) <-> Tutup (Disable)
// ============================================================================

import { useState, useEffect } from 'react'
import type { Lapangan, StatusLapangan } from '../../../types/database'
import { createLapangan, updateLapangan, deleteLapangan } from '../../../lib/api'
import { formatRupiah } from '../../../utils/formatters'
import { Plus, Trash2, Power, Layers, Pencil, X } from 'lucide-react'

interface CourtsManagementViewProps {
  courts: Lapangan[]
  loading: boolean
  onCourtsUpdated: () => void | Promise<void>
}

export default function CourtsManagementView({
  courts,
  loading,
  onCourtsUpdated,
}: CourtsManagementViewProps) {
  // State Lokal Lapangan (Optimistic UI Update Seketika)
  const [localCourts, setLocalCourts] = useState<Lapangan[]>(courts)

  useEffect(() => {
    setLocalCourts(courts)
  }, [courts])

  // 1. State Form Tambah Lapangan Baru
  const [nama, setNama] = useState('')
  const [tarif, setTarif] = useState<number>(50000)
  const [status, setStatus] = useState<StatusLapangan>('Aktif')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // State Form Edit Lapangan
  const [editingCourt, setEditingCourt] = useState<Lapangan | null>(null)
  const [editNama, setEditNama] = useState('')
  const [editTarif, setEditTarif] = useState<number>(50000)
  const [editStatus, setEditStatus] = useState<StatusLapangan>('Aktif')
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  // Buka Modal Edit
  const handleBukaEdit = (court: Lapangan) => {
    setEditingCourt(court)
    setEditNama(court.nama_lapangan)
    setEditTarif(court.tarif_per_jam)
    setEditStatus(court.status)
  }

  // Aksi UPDATE: Simpan Perubahan Lapangan
  const handleSimpanEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCourt) return
    if (!editNama.trim()) {
      setErrorMsg('Nama lapangan wajib diisi!')
      return
    }

    try {
      setIsEditSubmitting(true)
      setErrorMsg(null)
      await updateLapangan(editingCourt.id, {
        nama_lapangan: editNama.trim(),
        tarif_per_jam: Number(editTarif),
        status: editStatus,
      })
      setEditingCourt(null)
      onCourtsUpdated()
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengubah data lapangan.')
    } finally {
      setIsEditSubmitting(false)
    }
  }

  // 2. Aksi CREATE: Tambah Lapangan Baru
  const handleTambahLapangan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama.trim()) {
      setErrorMsg('Nama lapangan wajib diisi!')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMsg(null)
      await createLapangan({
        nama_lapangan: nama.trim(),
        tarif_per_jam: Number(tarif),
        status: status,
      })
      // Reset input form setelah sukses
      setNama('')
      setTarif(50000)
      setStatus('Aktif')
      onCourtsUpdated() // Tarik ulang data terbaru dari Supabase
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menambahkan lapangan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. Aksi UPDATE STATUS: Toggle Aktif (Enable) <-> Tutup (Disable)
  const handleToggleStatus = async (court: Lapangan) => {
    const statusBaru: StatusLapangan = court.status === 'Aktif' ? 'Tutup' : 'Aktif'
    // Optimistic UI update seketika
    setLocalCourts((prev) =>
      prev.map((c) => (c.id === court.id ? { ...c, status: statusBaru } : c))
    )
    try {
      setErrorMsg(null)
      await updateLapangan(court.id, { status: statusBaru })
      await onCourtsUpdated()
    } catch (err: any) {
      setLocalCourts(courts)
      setErrorMsg(err.message || 'Gagal mengubah status lapangan.')
    }
  }

  // 4. Aksi DELETE: Hapus Lapangan
  const handleHapusLapangan = async (id: number, namaLapangan: string) => {
    if (!window.confirm(`Yakin ingin menghapus ${namaLapangan}?`)) return

    try {
      setErrorMsg(null)
      await deleteLapangan(id)
      await onCourtsUpdated()
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghapus lapangan.')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-zinc-100">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            Kelola Master Lapangan
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Tambah lapangan baru dan atur status operasional (Aktif / Tutup).
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1 bg-zinc-800 rounded-lg text-zinc-300">
            Total: <strong>{localCourts.length}</strong>
          </span>
          <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-lg">
            Aktif: <strong>{localCourts.filter((c) => c.status === 'Aktif').length}</strong>
          </span>
          <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/40 text-rose-400 rounded-lg">
            Tutup: <strong>{localCourts.filter((c) => c.status === 'Tutup').length}</strong>
          </span>
        </div>
      </div>

      {/* Alert Error jika ada */}
      {errorMsg && (
        <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {/* Form Tambah Lapangan Baru (CREATE) */}
      <form
        onSubmit={handleTambahLapangan}
        className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-wrap gap-4 items-end"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Nama Lapangan
          </label>
          <input
            type="text"
            placeholder="Contoh: Court 3 - Vinyl"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div className="w-40">
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Tarif Per Jam
          </label>
          <input
            type="number"
            step="5000"
            value={tarif}
            onChange={(e) => setTarif(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div className="w-36">
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Status Awal
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusLapangan)}
            className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="Aktif">Aktif</option>
            <option value="Tutup">Tutup</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {isSubmitting ? 'Menyimpan...' : 'Tambah Lapangan'}
        </button>
      </form>

      {/* Tabel Daftar Lapangan (READ, TOGGLE STATUS, & DELETE) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400">
              <th className="py-3 px-4 w-16">ID</th>
              <th className="py-3 px-4">Nama Lapangan</th>
              <th className="py-3 px-4">Tarif / Jam</th>
              <th className="py-3 px-4">Status Operasional</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  Memuat data lapangan...
                </td>
              </tr>
            ) : localCourts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  Belum ada data lapangan.
                </td>
              </tr>
            ) : (
              localCourts.map((court) => {
                const isAktif = court.status === 'Aktif'
                return (
                  <tr key={court.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3 px-4 font-mono text-zinc-400">{court.id}</td>
                    <td className="py-3 px-4 font-semibold text-zinc-200">
                      {court.nama_lapangan}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      {formatRupiah(court.tarif_per_jam)}
                    </td>
                    <td className="py-3 px-4">
                      {/* Badge Status */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isAktif
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                        }`}
                      >
                        {court.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {/* Tombol Edit Data Lapangan */}
                      <button
                        onClick={() => handleBukaEdit(court)}
                        title="Edit Data Lapangan"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
                      >
                        <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                        Edit
                      </button>

                      {/* Tombol Toggle Enable/Disable Status */}
                      <button
                        onClick={() => handleToggleStatus(court)}
                        title={isAktif ? 'Klik untuk Nonaktifkan (Tutup)' : 'Klik untuk Aktifkan'}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                          isAktif
                            ? 'bg-zinc-800 hover:bg-rose-950 hover:border-rose-700 text-zinc-300 hover:text-rose-300 border-zinc-700'
                            : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-800 text-emerald-300'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {isAktif ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>

                      {/* Tombol Hapus Lapangan */}
                      <button
                        onClick={() => handleHapusLapangan(court.id, court.nama_lapangan)}
                        title="Hapus Lapangan"
                        className="inline-flex items-center p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 transition border border-transparent hover:border-rose-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Lapangan */}
      {editingCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 text-zinc-100">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Pencil className="w-5 h-5 text-emerald-400" />
                Edit Data Lapangan
              </h3>
              <button
                onClick={() => setEditingCourt(null)}
                className="text-zinc-400 hover:text-zinc-100 p-1 rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimpanEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Nama Lapangan
                </label>
                <input
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Tarif Per Jam (Rp)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={editTarif}
                  onChange={(e) => setEditTarif(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Status Operasional
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as StatusLapangan)}
                  className="w-full bg-zinc-950 border border-zinc-700 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-zinc-100"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tutup">Tutup</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingCourt(null)}
                  className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
                >
                  {isEditSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
