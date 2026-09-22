// PERAN FILE: Grid Kalender Bebas Distorsi & Bersih (Clean UI Tanpa Font Mono & Tanpa Teks Redundan)
import type { BookingItem, Court, SlotRangeSelection } from '../types'

interface ScheduleGridProps {
  courts: Court[]
  timeSlots: string[]
  bookings: BookingItem[]
  selectedBooking: BookingItem | null
  selectedSlot: SlotRangeSelection | null
  customerName?: string
  rangeError: string | null
  isSlotInRange: (courtId: string, time: string) => boolean
  isPastSlot: (time: string) => boolean
  onSelectBooking: (booking: BookingItem) => void
  onSelectEmptySlot: (court: Court, time: string) => void
  onClearSelection?: () => void
}

const BASE_HOUR = 8 // Jam operasional awal: 08:00
const SLOT_HEIGHT = 88 // Tinggi baku pixel per 1 jam slot

export default function ScheduleGrid({
  courts,
  timeSlots,
  bookings,
  selectedBooking,
  selectedSlot,
  customerName,
  rangeError,
  isSlotInRange,
  isPastSlot,
  onSelectBooking,
  onSelectEmptySlot,
  onClearSelection,
}: ScheduleGridProps) {
  const currentTimeTop = (10 - BASE_HOUR + 40 / 60) * SLOT_HEIGHT

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#141414] select-none font-aeonik">
      {/* Toast Notifikasi Bentrok / Waktu Lampau */}
      {rangeError && (
        <div className="sticky top-3 z-40 mx-auto max-w-md p-3 rounded-[10px] bg-red-500/95 text-white text-xs font-medium shadow-xl backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{rangeError}</span>
          </div>
        </div>
      )}

      {/* Indicator Garis Waktu Berjalan (10:40) */}
      <div
        style={{ top: `${currentTimeTop}px` }}
        className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
      >
        <div className="w-20 sm:w-24 shrink-0 flex justify-end pr-2">
          <span className="px-2.5 py-0.5 rounded bg-[#0091ff] text-white text-xs font-semibold shadow-md">
            10:40
          </span>
        </div>
        <div className="flex-1 h-[2px] bg-[#0091ff]/80 shadow-[0_0_8px_rgba(0,145,255,0.7)]" />
      </div>

      {/* Grid Container */}
      <div className="min-w-[720px] flex">
        {/* Kolom Sumbu Waktu Kiri */}
        <div className="w-20 sm:w-24 shrink-0 border-r border-[#262626] bg-[#141414]">
          {timeSlots.map((time) => {
            const isPast = isPastSlot(time)
            return (
              <div
                key={time}
                style={{ height: `${SLOT_HEIGHT}px` }}
                className={`p-3 text-right text-xs font-medium border-b border-[#222222] flex items-start justify-end ${
                  isPast ? 'text-[#444444]' : 'text-[#8e8e8e]'
                }`}
              >
                {time}
              </div>
            )
          })}
        </div>

        {/* 4 Kolom Lapangan Independen */}
        <div className="flex-1 grid grid-cols-4 divide-x divide-[#222222]">
          {courts.map((court) => {
            const courtBookings = bookings.filter((b) => b.courtId === court.id)

            return (
              <div key={court.id} className="relative">
                {/* 1. Background Grid Slot */}
                <div className="flex flex-col">
                  {timeSlots.map((time) => {
                    const isPast = isPastSlot(time)
                    const inRange = isSlotInRange(court.id, time)

                    return (
                      <div
                        key={time}
                        style={{
                          height: `${SLOT_HEIGHT}px`,
                          ...(isPast
                            ? {
                                backgroundImage:
                                  'repeating-linear-gradient(-45deg, #131313, #131313 8px, #181818 8px, #181818 16px)',
                              }
                            : {}),
                        }}
                        onClick={() => onSelectEmptySlot(court, time)}
                        className={`border-b border-[#222222] transition-colors relative select-none ${
                          isPast
                            ? 'opacity-25 cursor-not-allowed'
                            : inRange
                            ? 'bg-[#1a1a1a] cursor-pointer'
                            : 'hover:bg-[#f2d953]/5 cursor-pointer group'
                        }`}
                      >
                        {/* Hover Prompt Minimal */}
                        {!inRange && !isPast && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-xs text-[#f2d953] font-medium bg-[#1a1a1a] px-2.5 py-1 rounded-[6px] border border-[#f2d953]/30 shadow-sm">
                              {selectedSlot && selectedSlot.courtId === court.id
                                ? 'Pilih Selesai'
                                : 'Pilih Slot'}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* 2. Kartu Booking Absolute */}
                {courtBookings.map((booking) => {
                  const [startH, startM] = booking.startTime.split(':').map(Number)
                  const [endH, endM] = booking.endTime.split(':').map(Number)
                  const startDecimal = startH + (startM || 0) / 60
                  const endDecimal = endH + (endM || 0) / 60
                  const duration = Math.max(1, endDecimal - startDecimal)

                  const topOffset = (startDecimal - BASE_HOUR) * SLOT_HEIGHT + 3
                  const cardHeight = duration * SLOT_HEIGHT - 6
                  const isSelectedBooking = selectedBooking?.id === booking.id

                  // Card Maintenance
                  if (booking.status === 'maintenance') {
                    return (
                      <div
                        key={booking.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectBooking(booking)
                        }}
                        style={{
                          top: `${topOffset}px`,
                          height: `${cardHeight}px`,
                          backgroundImage:
                            'repeating-linear-gradient(45deg, #1c1c1c, #1c1c1c 10px, #262626 10px, #262626 20px)',
                        }}
                        className={`absolute inset-x-1.5 z-10 p-3 rounded-[10px] border border-dashed border-[#444444] flex flex-col justify-between cursor-pointer transition-all hover:brightness-110 shadow-md ${
                          isSelectedBooking ? 'ring-2 ring-white/70' : ''
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

                  // Card Booking Terisi Normal
                  return (
                    <div
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectBooking(booking)
                      }}
                      style={{
                        top: `${topOffset}px`,
                        height: `${cardHeight}px`,
                      }}
                      className={`absolute inset-x-1.5 z-10 p-3 rounded-[10px] bg-[#222222] border transition-all cursor-pointer flex flex-col justify-between group shadow-md ${
                        isSelectedBooking
                          ? 'border-[#f2d953] ring-1 ring-[#f2d953] shadow-[0_0_16px_rgba(242,217,83,0.25)]'
                          : 'border-[#333333] hover:border-[#555555] hover:bg-[#282828]'
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
                })}

                {/* 3. Kartu Choice / Seleksi Pengguna Aktif (User POV) */}
                {selectedSlot && selectedSlot.courtId === court.id && (
                  <div
                    style={{
                      top: `${(selectedSlot.startHour - BASE_HOUR) * SLOT_HEIGHT + 3}px`,
                      height: `${selectedSlot.totalHours * SLOT_HEIGHT - 6}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      const rect = e.currentTarget.getBoundingClientRect()
                      const relativeY = e.clientY - rect.top
                      const clickedHourOffset = Math.floor(relativeY / SLOT_HEIGHT)
                      const targetHour = selectedSlot.startHour + clickedHourOffset
                      const targetTime = `${targetHour < 10 ? '0' : ''}${targetHour}:00`
                      onSelectEmptySlot(court, targetTime)
                    }}
                    className="absolute inset-x-1.5 z-20 p-3 rounded-[10px] bg-[#222222] border-2 border-[#f2d953] ring-1 ring-[#f2d953]/40 shadow-[0_0_20px_rgba(242,217,83,0.22)] transition-all cursor-pointer flex flex-col justify-between group animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-sm font-semibold text-[#fcfcfc] truncate block group-hover:text-[#f2d953] transition-colors">
                          {customerName || 'Pilihan Anda'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#f2d953] text-black font-semibold tracking-wide">
                            Dipilih
                          </span>
                          {onClearSelection && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onClearSelection()
                              }}
                              title="Batalkan pilihan"
                              className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 text-[#a3a3a3] hover:text-white flex items-center justify-center text-[10px] transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-[#d4d4d4] block">
                        {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.totalHours} jam)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8e8e8e] pt-1 border-t border-white/10">
                      <span>{selectedSlot.courtName}</span>
                      <span className="font-semibold text-[#f2d953]">
                        Rp {selectedSlot.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
