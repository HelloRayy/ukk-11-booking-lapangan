// PERAN FILE: Kartu jadwal terisi (Booked) atau Maintenance pada kolom lapangan
import type { BookingItem } from '../../types'
import { CALENDAR_CURRENT_TIME } from '../../constants/scheduleConfig'
import { getTodayISODate } from '../../utils/formatters'

interface BookedSlotCardProps {
  booking: BookingItem
  isSelected: boolean
  slotHeight: number
  baseHour: number
  onSelect: (booking: BookingItem) => void
}

export default function BookedSlotCard({
  booking,
  isSelected,
  slotHeight,
  baseHour,
  onSelect,
}: BookedSlotCardProps) {
  const [startH, startM] = booking.startTime.split(':').map(Number)
  const [endH, endM] = booking.endTime.split(':').map(Number)
  const startDecimal = startH + (startM || 0) / 60
  const endDecimal = endH + (endM || 0) / 60
  const duration = Math.max(1, endDecimal - startDecimal)

  const topOffset = (startDecimal - baseHour) * slotHeight + 3
  const cardHeight = duration * slotHeight - 6

  const today = getTodayISODate()
  const currentDecimal = CALENDAR_CURRENT_TIME.hour + CALENDAR_CURRENT_TIME.minute / 60
  const isPastBooking =
    booking.date < today || (booking.date === today && endDecimal <= currentDecimal)

  // Status Slot Lampau yang sudah selesai (Garis Diagonal & Sembunyikan Nama Customer)
  if (isPastBooking) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation()
          onSelect(booking)
        }}
        style={{
          top: `${topOffset}px`,
          height: `${cardHeight}px`,
          backgroundImage:
            'repeating-linear-gradient(-45deg, #181818, #181818 8px, #222222 8px, #222222 16px)',
        }}
        className={`absolute inset-x-1.5 z-10 p-3 rounded-[10px] border border-dashed border-[#383838] flex flex-col justify-between cursor-pointer opacity-50 hover:opacity-75 transition-all shadow-sm select-none font-aeonik ${
          isSelected ? 'ring-2 ring-white/50 border-[#888888]' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-semibold text-[#8e8e8e]">
              Selesai
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#737373] border border-white/5">
              Arsip
            </span>
          </div>
          <span className="text-xs text-[#666666] font-mono block">
            {booking.startTime} - {booking.endTime}
          </span>
        </div>

        <div className="text-[11px] text-[#555555] truncate">
          {booking.courtName}
        </div>
      </div>
    )
  }

  // Status Maintenance
  if (booking.status === 'maintenance') {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation()
          onSelect(booking)
        }}
        style={{
          top: `${topOffset}px`,
          height: `${cardHeight}px`,
          backgroundImage:
            'repeating-linear-gradient(45deg, #1c1c1c, #1c1c1c 10px, #262626 10px, #262626 20px)',
        }}
        className={`absolute inset-x-1.5 z-10 p-3 rounded-[10px] border border-dashed border-[#444444] flex flex-col justify-between cursor-pointer transition-all hover:brightness-110 shadow-md select-none font-aeonik ${
          isSelected ? 'ring-2 ring-white/70' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-semibold text-[#d1d1d1]">
              Maintenance
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <span className="text-xs text-[#8e8e8e] block">
            {booking.startTime} - {booking.endTime}
          </span>
        </div>
      </div>
    )
  }

  // Status Booked Normal
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onSelect(booking)
      }}
      style={{
        top: `${topOffset}px`,
        height: `${cardHeight}px`,
      }}
      className={`absolute inset-x-1.5 z-10 p-3 rounded-[10px] bg-[#222222] border transition-all cursor-pointer flex flex-col justify-between group shadow-md select-none font-aeonik ${
        isSelected
          ? 'border-[#f2d953] ring-1 ring-[#f2d953] shadow-[0_0_16px_rgba(242,217,83,0.25)]'
          : 'border-[#383838] hover:border-[#555555] hover:bg-[#282828]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-sm font-semibold text-[#fcfcfc] truncate block group-hover:text-[#f2d953] transition-colors">
            {booking.customerName}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#a3a3a3] font-medium">
            Booked
          </span>
        </div>

        <span className="text-xs text-[#8e8e8e] block">
          {booking.startTime} - {booking.endTime}
        </span>
      </div>

      <div className="text-[11px] text-[#737373] pt-1">
        {booking.courtName}
      </div>
    </div>
  )
}
