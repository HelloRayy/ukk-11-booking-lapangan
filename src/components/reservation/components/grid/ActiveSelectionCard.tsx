// PERAN FILE: Kartu seleksi aktif pengguna (Dynamic Stretching & Collision Preview)
import type { Court, SlotRangeSelection } from '../../types'
import { formatRupiah } from '../../utils/formatters'

interface ActiveSelectionCardProps {
  selectedSlot: SlotRangeSelection
  court: Court
  customerName?: string
  slotHeight: number
  baseHour: number
  isRangePreviewActive: boolean
  previewMinHour: number | null
  previewMaxHour: number | null
  previewHasCollision: boolean
  onClearSelection?: () => void
  onSelectEmptySlot: (court: Court, time: string) => void
}

export default function ActiveSelectionCard({
  selectedSlot,
  court,
  customerName,
  slotHeight,
  baseHour,
  isRangePreviewActive,
  previewMinHour,
  previewMaxHour,
  previewHasCollision,
  onClearSelection,
  onSelectEmptySlot,
}: ActiveSelectionCardProps) {
  const isCourtPreviewActive =
    isRangePreviewActive &&
    court.id === selectedSlot.courtId &&
    previewMinHour !== null &&
    previewMaxHour !== null

  // Jam mulai & durasi dinamis: melebar otomatis mengikuti arah kursor pengguna
  const activeStartHour = isCourtPreviewActive ? previewMinHour : selectedSlot.startHour
  const activeTotalHours = isCourtPreviewActive
    ? previewMaxHour - previewMinHour + 1
    : selectedSlot.totalHours

  const activeEndHour = activeStartHour + activeTotalHours
  const activeStartTimeStr = `${activeStartHour < 10 ? '0' : ''}${activeStartHour}:00`
  const activeEndTimeStr = `${activeEndHour < 10 ? '0' : ''}${activeEndHour}:00`
  const activeTotalPrice = activeTotalHours * court.pricePerHour

  const activeTopOffset = (activeStartHour - baseHour) * slotHeight + 3
  const activeCardHeight = activeTotalHours * slotHeight - 6

  const isBlocked = isCourtPreviewActive && previewHasCollision

  return (
    <div
      style={{
        top: `${activeTopOffset}px`,
        height: `${activeCardHeight}px`,
      }}
      onClick={(e) => {
        if (!isRangePreviewActive) {
          e.stopPropagation()
          const rect = e.currentTarget.getBoundingClientRect()
          const relativeY = e.clientY - rect.top
          const clickedHourOffset = Math.floor(relativeY / slotHeight)
          const targetHour = selectedSlot.startHour + clickedHourOffset
          const targetTime = `${targetHour < 10 ? '0' : ''}${targetHour}:00`
          onSelectEmptySlot(court, targetTime)
        }
      }}
      className={`absolute inset-x-1.5 z-20 p-3 rounded-[10px] bg-[#222222] border-2 transition-all duration-150 flex flex-col justify-between group shadow-lg select-none font-aeonik ${
        isBlocked
          ? 'border-red-500 shadow-[0_0_24px_rgba(239,68,68,0.25)]'
          : 'border-[#f2d953] ring-1 ring-[#f2d953]/30 shadow-[0_0_24px_rgba(242,217,83,0.22)]'
      } ${isRangePreviewActive ? 'pointer-events-none' : 'cursor-pointer'}`}
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-sm font-semibold text-[#fcfcfc] truncate block group-hover:text-[#f2d953] transition-colors pr-2">
            {customerName || 'Calon Penyewa'}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-semibold tracking-wide transition-opacity duration-150 ${
                isBlocked
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-[#f2d953] text-black'
              } ${onClearSelection ? 'group-hover:opacity-0' : ''}`}
            >
              {isBlocked ? 'Bentrok' : 'Dipilih'}
            </span>
          </div>
        </div>

        {/* Tombol Batal Pemilihan (Hanya Muncul Saat Kartu di-Hover) */}
        {onClearSelection && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClearSelection()
            }}
            title="Batalkan pilihan"
            aria-label="Batalkan pilihan"
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#2e2e2e] hover:bg-rose-500 text-[#a3a3a3] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto shadow-md border border-white/10 cursor-pointer z-30 active:scale-90"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        <span
          className={`text-xs block ${
            isBlocked ? 'text-red-400 font-medium' : 'text-[#d4d4d4]'
          }`}
        >
          {isBlocked
            ? `${activeStartTimeStr} - ${activeEndTimeStr} (Jadwal Bentrok)`
            : `${activeStartTimeStr} - ${activeEndTimeStr} (${activeTotalHours} jam)`}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#8e8e8e] pt-1 border-t border-white/10">
        <span>{selectedSlot.courtName}</span>
        <span
          className={`font-semibold ${
            isBlocked ? 'text-red-400' : 'text-[#f2d953]'
          }`}
        >
          {isBlocked
            ? 'Tidak Tersedia'
            : formatRupiah(activeTotalPrice)}
        </span>
      </div>
    </div>
  )
}
