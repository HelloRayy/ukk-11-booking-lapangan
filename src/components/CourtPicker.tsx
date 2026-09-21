import type { Lapangan } from '../types/database'

interface Props {
  lapangan: Lapangan[]
  selectedId: number | null
  onSelect: (id: number) => void
}

// komponen buat milih lapangan badminton (court 1, 2, 3)
export default function CourtPicker({ lapangan, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold uppercase tracking-wider text-slate-300">
        1. Pilih Court Badminton:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {lapangan.map((item) => {
          const isSelected = selectedId === item.id
          const isTutup = item.status === 'Tutup'

          return (
            <button
              key={item.id}
              type="button"
              disabled={isTutup}
              onClick={() => onSelect(item.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isTutup
                  ? 'border-slate-800 bg-slate-900/30 text-slate-600 cursor-not-allowed'
                  : isSelected
                  ? 'border-emerald-500 bg-emerald-950/40 text-white shadow-lg shadow-emerald-950'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base text-white">{item.nama_lapangan}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isTutup ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Rp {item.tarif_per_jam.toLocaleString('id-ID')} / jam
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
