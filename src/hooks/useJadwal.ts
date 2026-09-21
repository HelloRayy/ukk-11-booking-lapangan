// PERAN FILE: Custom Hook untuk mengelola state slot jam terisi dan otomatis sinkron saat ganti court/tanggal
import { useState, useEffect } from 'react'
import { getBookedSlots } from '../lib/api'

export function useJadwal(lapanganId: number | null, tglMain: string) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingJadwal, setLoadingJadwal] = useState(false)

  // fungsi untuk refresh slot jam dari database
  const refreshJadwal = async () => {
    if (!lapanganId || !tglMain) return
    setLoadingJadwal(true)
    try {
      const data = await getBookedSlots(lapanganId, tglMain)
      setBookedSlots(data)
    } catch (err) {
      console.error('Gagal mengambil jadwal booked:', err)
    } finally {
      setLoadingJadwal(false)
    }
  }

  // otomatis ambil jadwal tiap ganti lapangan atau tanggal
  useEffect(() => {
    refreshJadwal()
  }, [lapanganId, tglMain])

  return { bookedSlots, refreshJadwal, loadingJadwal }
}
