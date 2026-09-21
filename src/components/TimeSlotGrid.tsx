import { DAFTAR_JAM } from '../constants/gor'

interface Props {
  bookedSlots: string[]
  selectedSlots: string[]
  onToggleSlot: (jam: string) => void
}

// grid slot jam - tombol otomatis kekunci kalo udah dibooking orang lain
export default function TimeSlotGrid({
  bookedSlots,
  selectedSlots,
  onToggleSlot,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          3. Pilih Jam Main (Bisa Lebih Dari 1 Jam):
        </label>

        {/* petunjuk warna biar user ga bingung */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Terpilih
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900 border border-slate-700 inline-block"></span> Kosong
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800/40 inline-block"></span> Udah Dibooking
          </span>
        </div>
      </div>

      {/* daftar tombol jam operasional */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {DAFTAR_JAM.map((jam) => {
          const isBooked = bookedSlots.includes(jam)
          const isSelected = selectedSlots.includes(jam)

          return (
            <button
              key={jam}
              type="button"
              disabled={isBooked}
              onClick={() => onToggleSlot(jam)}
              className={`py-3 rounded-lg text-sm font-medium transition-all ${
                isBooked
                  ? 'bg-slate-900/40 text-slate-600 border border-slate-800/50 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/60 hover:text-white'
              }`}
            >
              {jam}
            </button>
          )
        })}
      </div>
    </div>
  )
}
