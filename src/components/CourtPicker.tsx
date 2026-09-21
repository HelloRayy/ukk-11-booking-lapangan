import type { Lapangan } from '../types/database'

interface Props {
  lapangan: Lapangan[]
  selectedId: number | null
  onSelect: (id: number) => void
}

// komponen pilih court - styling simpel border & background polos
export default function CourtPicker({ lapangan, selectedId, onSelect }: Props) {
  return (
    <div>
      <h3 className="font-bold mb-2">1. Pilih Court:</h3>
      <div className="flex gap-2 flex-wrap">
        {lapangan.map((item) => {
          const isSelected = selectedId === item.id
          const isTutup = item.status === 'Tutup'

          return (
            <button
              key={item.id}
              type="button"
              disabled={isTutup}
              onClick={() => onSelect(item.id)}
              className={`p-3 border rounded text-left ${
                isTutup
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isSelected
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <div>{item.nama_lapangan} {isTutup && '(Tutup)'}</div>
              <div className="text-xs">Rp {item.tarif_per_jam.toLocaleString('id-ID')}/jam</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
