// PERAN FILE: Modal CRUD Master Data Lapangan (Poin 10, 11, 12 Kisi-Kisi UKK)
import { useState } from 'react'
import type { Lapangan, StatusLapangan } from '../../types/database'
import { createLapangan, updateLapangan, deleteLapangan } from '../../lib/api'

interface CourtManagerModalProps {
  courts: Lapangan[]
  isOpen: boolean
  onClose: () => void
  onCourtsUpdated: () => void
}

export default function CourtManagerModal({
  courts,
  isOpen,
  onClose,
  onCourtsUpdated,
}: CourtManagerModalProps) {
  const [namaLapangan, setNamaLapangan] = useState('')
  const [tarifPerJam, setTarifPerJam] = useState<number>(50000)
  const [status, setStatus] = useState<StatusLapangan>('Aktif')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  // 1. Simpan Lapangan Baru (Poin 10 Kisi-Kisi)
  const handleCreateCourt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!namaLapangan.trim()) {
      setErrorMessage('Nama lapangan wajib diisi.')
      return
    }
    if (tarifPerJam <= 0) {
      setErrorMessage('Tarif per jam harus lebih dari 0.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      await createLapangan({
        nama_lapangan: namaLapangan.trim(),
        tarif_per_jam: Number(tarifPerJam),
        status,
      })
      setNamaLapangan('')
      setTarifPerJam(50000)
      setStatus('Aktif')
      onCourtsUpdated()
      alert('Lapangan baru berhasil ditambahkan!')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Gagal menambahkan lapangan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Ubah Tarif Lapangan (Poin 11 Kisi-Kisi)
  const handleEditTarif = async (court: Lapangan) => {
    const input = window.prompt(`Masukkan tarif baru per jam untuk ${court.nama_lapangan}:`, String(court.tarif_per_jam))
    if (!input) return
    const newPrice = parseInt(input, 10)
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Tarif tidak valid.')
      return
    }

    try {
      await updateLapangan(court.id, { tarif_per_jam: newPrice })
      onCourtsUpdated()
      alert(`Tarif ${court.nama_lapangan} berhasil diubah menjadi Rp ${newPrice.toLocaleString('id-ID')}/jam!`)
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah tarif.')
    }
  }

  // 3. Toggle Status Lapangan Aktif / Tutup (Poin 11 Kisi-Kisi)
  const handleToggleStatus = async (court: Lapangan) => {
    const nextStatus: StatusLapangan = court.status === 'Aktif' ? 'Tutup' : 'Aktif'
    try {
      await updateLapangan(court.id, { status: nextStatus })
      onCourtsUpdated()
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status lapangan.')
    }
  }

  // 4. Hapus Lapangan (Poin 12 Kisi-Kisi)
  const handleDeleteCourt = async (court: Lapangan) => {
    if (!window.confirm(`Yakin ingin menghapus ${court.nama_lapangan}?`)) return
    try {
      await deleteLapangan(court.id)
      onCourtsUpdated()
      alert(`Lapangan ${court.nama_lapangan} berhasil dihapus!`)
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus lapangan.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Kelola Master Data Lapangan</h3>
            <p className="text-xs text-gray-500">Tambah, ubah tarif, dan atur ketersediaan lapangan.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Form Tambah Lapangan Baru (Poin 10) */}
        <form onSubmit={handleCreateCourt} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
            + Tambah Lapangan Baru
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Nama Lapangan</label>
              <input
                type="text"
                placeholder="e.g. Court 4"
                value={namaLapangan}
                onChange={(e) => setNamaLapangan(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white focus:outline-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Tarif per Jam (Rp)</label>
              <input
                type="number"
                step="5000"
                value={tarifPerJam}
                onChange={(e) => setTarifPerJam(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white focus:outline-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Status Awal</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusLapangan)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white focus:outline-blue-500"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tutup">Tutup (Perbaikan)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Lapangan'}
          </button>
        </form>

        {/* Tabel Daftar Lapangan & Aksi Edit/Hapus (Poin 11 & 12) */}
        <div>
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
            Daftar Lapangan Tersedia ({courts.length})
          </span>
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Nama Lapangan</th>
                  <th className="p-2.5">Tarif / Jam</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courts.map((court) => (
                  <tr key={court.id} className="hover:bg-gray-50">
                    <td className="p-2.5 font-medium text-gray-500">#{court.id}</td>
                    <td className="p-2.5 font-bold text-gray-900">{court.nama_lapangan}</td>
                    <td className="p-2.5 text-gray-700">Rp {court.tarif_per_jam.toLocaleString('id-ID')}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        court.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {court.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditTarif(court)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-semibold cursor-pointer"
                        title="Ubah tarif per jam"
                      >
                        Edit Tarif
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(court)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-semibold cursor-pointer"
                        title="Ubah status Aktif / Tutup"
                      >
                        {court.status === 'Aktif' ? 'Set Tutup' : 'Set Aktif'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCourt(court)}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-semibold cursor-pointer"
                        title="Hapus lapangan dari database"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
