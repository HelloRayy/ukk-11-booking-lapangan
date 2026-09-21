interface Props {
  durasiJam: number
  selectedSlots: string[]
  totalBayar: number
  nominalDP: number
}

// kartu ringkasan biaya sewa sama opsi dp 50%
export default function BookingSummary({
  durasiJam,
  selectedSlots,
  totalBayar,
  nominalDP,
}: Props) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="text-xs text-slate-400">Rincian Jam Main:</div>
        <div className="text-sm font-medium text-slate-200 mt-0.5">
          {durasiJam > 0 ? (
            <span>
              {durasiJam} Jam ({selectedSlots.join(', ')})
            </span>
          ) : (
            <span className="text-slate-500 italic">Belum ada jam yang dipilih</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-xs text-slate-400">Total Biaya (Lunas):</div>
          <div className="text-lg font-bold text-emerald-400">
            Rp {totalBayar.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="text-right border-l border-slate-800 pl-6">
          <div className="text-xs text-slate-400">Uang Muka (DP 50%):</div>
          <div className="text-lg font-bold text-amber-400">
            Rp {nominalDP.toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  )
}
