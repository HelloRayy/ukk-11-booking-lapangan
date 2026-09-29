// ============================================================================
// MODUL KASIR: KELOLA MASTER LAPANGAN (CRUD & ENABLE/DISABLE STATUS)
// ============================================================================
// File ini dibuat sederhana agar mudah dipelajari untuk sidang UKK.
// 2 Fokus Utama:
// 1. CRUD Lapangan (Tambah, Lihat, Hapus Lapangan)
// 2. Set Status Lapangan: Aktif (Enable) <-> Tutup (Disable)
// ============================================================================

import { useState } from 'react'
import type { Lapangan, StatusLapangan } from '../../../types/database'
import { createLapangan, updateLapangan, deleteLapangan } from '../../../lib/api'
import { formatRupiah } from '../../../utils/formatters'
import { Plus, Trash2, Power, Layers } from 'lucide-react'

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
  // 1. State Form Tambah Lapangan Baru
  const [nama, setNama] = useState('')
  const [tarif, setTarif] = useState<number>(50000)
  const [status, setStatus] = useState<StatusLapangan>('Aktif')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
    try {
      setErrorMsg(null)
      await updateLapangan(court.id, { status: statusBaru })
      onCourtsUpdated()
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengubah status lapangan.')
    }
  }

  // 4. Aksi DELETE: Hapus Lapangan
  const handleHapusLapangan = async (id: number, namaLapangan: string) => {
    if (!window.confirm(`Yakin ingin menghapus ${namaLapangan}?`)) return

    try {
      setErrorMsg(null)
      await deleteLapangan(id)
      onCourtsUpdated()
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
            Total: <strong>{courts.length}</strong>
          </span>
          <span className="px-3 py-1 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-lg">
            Aktif: <strong>{courts.filter((c) => c.status === 'Aktif').length}</strong>
          </span>
          <span className="px-3 py-1 bg-rose-950/60 border border-rose-800/40 text-rose-400 rounded-lg">
            Tutup: <strong>{courts.filter((c) => c.status === 'Tutup').length}</strong>
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
            ) : courts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  Belum ada data lapangan.
                </td>
              </tr>
            ) : (
              courts.map((court) => {
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
    </div>
  )
}
