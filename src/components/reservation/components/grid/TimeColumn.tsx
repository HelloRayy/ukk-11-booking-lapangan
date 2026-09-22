// PERAN FILE: Kolom vertikal penanda sumbu waktu (08:00 - 23:00) di sisi kiri kalender
interface TimeColumnProps {
  timeSlots: string[]
  isPastSlot: (time: string) => boolean
  slotHeight: number
}

export default function TimeColumn({
  timeSlots,
  isPastSlot,
  slotHeight,
}: TimeColumnProps) {
  return (
    <div className="w-20 sm:w-24 shrink-0 border-r border-[#262626] bg-[#141414] select-none font-aeonik">
      {timeSlots.map((time) => {
        const isPast = isPastSlot(time)
        return (
          <div
            key={time}
            style={{ height: `${slotHeight}px` }}
            className={`p-3 text-right text-xs font-medium border-b border-[#222222] flex items-start justify-end ${
              isPast ? 'text-[#444444]' : 'text-[#8e8e8e]'
            }`}
          >
            {time}
          </div>
        )
      })}
    </div>
  )
}
