// PERAN FILE: Halaman utama pemesan - murni menyusun komponen langkah 1 sampai 5
import { usePemesanan } from '../hooks/usePemesanan'
import PilihLapangan from './PilihLapangan'
import GridJam from './GridJam'
import RingkasanBiaya from './RingkasanBiaya'
import FormPemesan from './FormPemesan'

export default function HalamanPemesan() {
  const {
    lapangan,
    loading,
    selectedLapangan,
    selectedDate,
    selectedSlots,
    bookedSlots,
    isSubmitting,
    totalBayar,
    nominalDP,
    pilihLapangan,
    pilihTanggal,
    toggleSlot,
    kirimBooking,
  } = usePemesanan()

  if (loading) {
    return <div className="p-4 border rounded text-center text-gray-500">Memuat data lapangan...</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* 1. Pilih Court */}
      <PilihLapangan
        lapangan={lapangan}
        selectedId={selectedLapangan}
        onSelect={pilihLapangan}
      />

      {/* 2. Pilih Tanggal */}
      <div>
        <h3 className="font-bold mb-2">2. Pilih Tanggal:</h3>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => pilihTanggal(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* 3. Grid Jam */}
      <GridJam
        selectedDate={selectedDate}
        bookedSlots={bookedSlots}
        selectedSlots={selectedSlots}
        onToggleSlot={toggleSlot}
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
        onKirimData={kirimBooking}
      />
    </div>
  )
}
