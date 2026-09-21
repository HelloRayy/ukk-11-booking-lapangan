// PERAN FILE: Menampilkan rincian durasi jam, total biaya sewa, dan kalkulasi nominal DP 50%
interface Props {
  durasiJam: number
  selectedSlots: string[]
  totalBayar: number
  nominalDP: number
}

// kartu rincian biaya sederhana
export default function RingkasanBiaya({
  durasiJam,
  selectedSlots,
  totalBayar,
  nominalDP,
}: Props) {
  return (
    <div className="p-4 border rounded bg-gray-50 space-y-2">
      <h3 className="font-bold">4. Rincian Biaya:</h3>
      <div>
        Durasi: {durasiJam > 0 ? `${durasiJam} Jam (${selectedSlots.join(', ')})` : 'Belum pilih jam'}
      </div>
      <div className="text-lg font-bold text-blue-600">
        Total Biaya: Rp {totalBayar.toLocaleString('id-ID')}
      </div>
      <div className="text-sm font-semibold text-orange-600">
        Uang Muka (DP 50%): Rp {nominalDP.toLocaleString('id-ID')}
      </div>
    </div>
  )
}
