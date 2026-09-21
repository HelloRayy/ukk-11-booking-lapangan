// PERAN FILE: Komponen utama penampung alur pemesanan lapangan & navigasi menu kasir
import { useState, useEffect } from 'react'
import { getLapangan, createBooking, getAllBookings, updateStatusBooking } from './lib/api'
import type { Lapangan, Booking } from './types/database'
import { useJadwal } from './hooks/useJadwal'
import PilihLapangan from './components/PilihLapangan'
import GridJam from './components/GridJam'
import RingkasanBiaya from './components/RingkasanBiaya'
import FormPemesan from './components/FormPemesan'
import TabelKasir from './components/TabelKasir'
import { hitungBiayaBooking } from './utils/hitungBiaya'

export default function App() {
  const [activeTab, setActiveTab] = useState<'pemesan' | 'kasir'>('pemesan')
  const [lapangan, setLapangan] = useState<Lapangan[]>([])
  const [selectedLapangan, setSelectedLapangan] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // custom hook: mengelola jam yang sudah dibooking secara terpisah dari UI
  const { bookedSlots, refreshJadwal } = useJadwal(selectedLapangan, selectedDate)

  // state untuk data tabel kasir
  const [daftarBooking, setDaftarBooking] = useState<Booking[]>([])
  const [loadingKasir, setLoadingKasir] = useState(false)

  // ambil data lapangan pas web dibuka
  useEffect(() => {
    async function loadLapangan() {
      try {
        const data = await getLapangan()
        setLapangan(data)
        if (data.length > 0) setSelectedLapangan(data[0].id)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadLapangan()
  }, [])


  // toggle pilih jam
  const handleToggleSlot = (jam: string) => {
    if (selectedSlots.includes(jam)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== jam))
    } else {
      setSelectedSlots([...selectedSlots, jam].sort())
    }
  }

  const courtAktif = lapangan.find((l) => l.id === selectedLapangan)
  const tarif = courtAktif?.tarif_per_jam || 0
  const { totalBayar, nominalDP, sisaBayar } = hitungBiayaBooking(selectedSlots.length, tarif)

  // fungsi kirim data booking ke database supabase
  const handleKirimBooking = async (dataPemesan: {
    nama: string
    noHp: string
    tipeBayar: 'Lunas' | 'DP'
  }) => {
    if (!selectedLapangan) return

    setIsSubmitting(true)
    try {
      await createBooking({
        lapangan_id: selectedLapangan,
        nama_penyewa: dataPemesan.nama,
        no_hp: dataPemesan.noHp,
        tgl_main: selectedDate,
        jam_slots: selectedSlots,
        durasi_jam: selectedSlots.length,
        total_bayar: totalBayar,
        nominal_dibayar: dataPemesan.tipeBayar === 'DP' ? nominalDP : totalBayar,
        sisa_bayar: dataPemesan.tipeBayar === 'DP' ? sisaBayar : 0,
        tipe_bayar: dataPemesan.tipeBayar,
        status: dataPemesan.tipeBayar === 'Lunas' ? 'Lunas' : 'Booked',
      })

      alert('Berhasil! Booking lapangan badminton sudah tersimpan.')

      // refresh slot jam otomatis via custom hook
      await refreshJadwal()
      setSelectedSlots([]) // kosongkan pilihan jam setelah booking sukses
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan booking. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ambil data seluruh transaksi untuk tabel kasir
  const handleLoadKasir = async () => {
    setLoadingKasir(true)
    try {
      const data = await getAllBookings()
      setDaftarBooking(data)
    } catch (err) {
      console.error(err)
      alert('Gagal mengambil data booking.')
    } finally {
      setLoadingKasir(false)
    }
  }

  // aksi kasir: pelunasan sisa bayar DP
  const handleLunasi = async (id: number) => {
    if (!window.confirm('Lunasi sisa pembayaran untuk transaksi ini?')) return
    try {
      await updateStatusBooking(id, 'Lunas', 0)
      await handleLoadKasir()
      alert('Berhasil dilunasi!')
    } catch (err) {
      console.error(err)
      alert('Gagal melunasi transaksi.')
    }
  }

  // aksi kasir: batalkan jadwal booking
  const handleBatal = async (id: number) => {
    if (!window.confirm('Batalkan jadwal booking ini? Slot jam akan otomatis dibuka kembali.')) return
    try {
      await updateStatusBooking(id, 'Batal')
      await handleLoadKasir()
      // sinkronkan kembali slot jam via custom hook
      await refreshJadwal()
      alert('Booking berhasil dibatalkan.')
    } catch (err) {
      console.error(err)
      alert('Gagal membatalkan booking.')
    }
  }

  if (loading) {
    return <div className="p-6">Loading data lapangan...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 text-black bg-white min-h-screen">
      <header className="border-b pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">Booking Lapangan Badminton</h1>
          <p className="text-sm text-gray-500">Aplikasi UKK RPL / PPLG - Sistem Reservasi & Kasir</p>
        </div>

        {/* Tab Navigasi Menu */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('pemesan')}
            className={`px-3 py-1.5 rounded font-bold text-sm border ${
              activeTab === 'pemesan'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Menu Pemesan
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('kasir')
              handleLoadKasir()
            }}
            className={`px-3 py-1.5 rounded font-bold text-sm border ${
              activeTab === 'kasir'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Menu Kasir
          </button>
        </div>
      </header>

      {activeTab === 'pemesan' ? (
        <div className="max-w-2xl space-y-6">
          {/* 1. Pilih Court */}
          <PilihLapangan
            lapangan={lapangan}
            selectedId={selectedLapangan}
            onSelect={(id) => {
              setSelectedLapangan(id)
              setSelectedSlots([])
            }}
          />

          {/* 2. Pilih Tanggal */}
          <div>
            <h3 className="font-bold mb-2">2. Pilih Tanggal:</h3>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setSelectedSlots([])
              }}
              className="border p-2 rounded"
            />
          </div>

          {/* 3. Grid Jam */}
          <GridJam
            selectedDate={selectedDate}
            bookedSlots={bookedSlots}
            selectedSlots={selectedSlots}
            onToggleSlot={handleToggleSlot}
          />

          {/* 4. Rincian Biaya */}
          <RingkasanBiaya
            durasiJam={selectedSlots.length}
            selectedSlots={selectedSlots}
            totalBayar={totalBayar}
            nominalDP={nominalDP}
          />

          {/* 5. Form Data Pemesan & Tombol Submit */}
          <FormPemesan
            durasiJam={selectedSlots.length}
            totalBayar={totalBayar}
            nominalDP={nominalDP}
            isSubmitting={isSubmitting}
            onKirimData={handleKirimBooking}
          />
        </div>
      ) : (
        <TabelKasir
          daftarBooking={daftarBooking}
          loading={loadingKasir}
          onLunasi={handleLunasi}
          onBatal={handleBatal}
          onRefresh={handleLoadKasir}
        />
      )}
    </div>
  )
}

