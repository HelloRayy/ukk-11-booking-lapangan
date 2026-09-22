import { useBooking } from '../hooks/useBooking'
import CourtSelector from './booking/CourtSelector'
import TimeSlotGrid from './booking/TimeSlotGrid'
import CostSummary from './booking/CostSummary'
import CustomerForm from './booking/CustomerForm'

export default function CustomerBookingPage() {
  const {
    lapangan,
    loading,
    selectedLapangan,
    selectedDate,
    jamDipilih,
    jamTerisi,
    isSubmitting,
    totalBayar,
    nominalDP,
    pilihLapangan,
    pilihTanggal,
    toggleSlot,
    kirimBooking,
  } = useBooking()

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data lapangan...</div>
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* 1. Pilih Court */}
      <CourtSelector
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
      <TimeSlotGrid
        selectedDate={selectedDate}
        jamTerisi={jamTerisi}
        jamDipilih={jamDipilih}
        onToggleSlot={toggleSlot}
      />

      {/* 4. Rincian Biaya */}
      <CostSummary
        durasiJam={jamDipilih.length}
        jamDipilih={jamDipilih}
        totalBayar={totalBayar}
        nominalDP={nominalDP}
      />

      {/* 5. Form Data Pemesan & Tombol Submit */}
      <CustomerForm
        durasiJam={jamDipilih.length}
        totalBayar={totalBayar}
        nominalDP={nominalDP}
        isSubmitting={isSubmitting}
        onKirimData={kirimBooking}
      />
    </div>
  )
}
