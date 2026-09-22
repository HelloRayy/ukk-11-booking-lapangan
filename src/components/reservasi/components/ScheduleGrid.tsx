// PERAN FILE: Grid Kalender Bebas Distorsi dengan Proteksi Waktu Lampau (< Jam Sekarang)
import type { BookingItem, Court, SlotRangeSelection } from '../types'

interface ScheduleGridProps {
  courts: Court[]
  timeSlots: string[]
  bookings: BookingItem[]
  selectedBooking: BookingItem | null
  selectedSlot: SlotRangeSelection | null
  rangeError: string | null
  isSlotInRange: (courtId: string, time: string) => boolean
  isPastSlot: (time: string) => boolean
  onSelectBooking: (booking: BookingItem) => void
  onSelectEmptySlot: (court: Court, time: string) => void
}

const BASE_HOUR = 8 // Jam operasional awal: 08:00
const SLOT_HEIGHT = 88 // Tinggi baku pixel per 1 jam slot

export default function ScheduleGrid({
  courts,
  timeSlots,
  bookings,
  selectedBooking,
  selectedSlot,
  rangeError,
  isSlotInRange,
  isPastSlot,
  onSelectBooking,
  onSelectEmptySlot,
}: ScheduleGridProps) {
  // Hitung posisi indikator waktu berjalan (10:40)
  const currentTimeTop = (10 - BASE_HOUR + 40 / 60) * SLOT_HEIGHT

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#141414] select-none">
      {/* Toast Peringatan Bentrok Jadwal / Waktu Lampau */}
      {rangeError && (
        <div className="sticky top-2 z-40 mx-auto max-w-md p-3 rounded-[10px] bg-red-500/95 text-white text-xs font-medium shadow-xl backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{rangeError}</span>
          </div>
        </div>
      )}

      {/* Indicator Garis Waktu Berjalan (10:40) Melintasi Seluruh Kolom */}
      <div
        style={{ top: `${currentTimeTop}px` }}
        className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
      >
        <div className="w-20 sm:w-24 shrink-0 flex justify-end pr-2">
          <span className="px-2 py-0.5 rounded bg-[#0091ff] text-white text-[11px] font-mono font-bold shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>10:40</span>
          </span>
        </div>
        <div className="flex-1 h-[2px] bg-[#0091ff]/80 shadow-[0_0_8px_rgba(0,145,255,0.7)]" />
      </div>

      {/* Grid Container */}
      <div className="min-w-[720px] flex">
        {/* Kolom Sumbu Waktu Kiri (Tinggi Baku Per Jam) */}
        <div className="w-20 sm:w-24 shrink-0 border-r border-[#262626] bg-[#141414]">
          {timeSlots.map((time) => {
            const isPast = isPastSlot(time)
            return (
              <div
                key={time}
                style={{ height: `${SLOT_HEIGHT}px` }}
                className={`p-3 text-right text-xs font-mono border-b border-[#222222] flex items-start justify-end ${
                  isPast ? 'text-[#444444]' : 'text-[#8e8e8e]'
                }`}
              >
                {time}
              </div>
            )
          })}
        </div>

        {/* 4 Kolom Lapangan Independen (Side-by-Side Bebas Distorsi) */}
        <div className="flex-1 grid grid-cols-4 divide-x divide-[#222222]">
          {courts.map((court) => {
            const courtBookings = bookings.filter((b) => b.courtId === court.id)

            return (
              <div key={court.id} className="relative">
                {/* 1. Background Grid Slot (Setiap Slot Terkunci 88px) */}
                <div className="flex flex-col">
                  {timeSlots.map((time) => {
                    const isPast = isPastSlot(time)
                    const inRange = isSlotInRange(court.id, time)
                    const isFirst =
                      selectedSlot?.courtId === court.id && selectedSlot?.selectedHours[0] === time
                    const isLast =
                      selectedSlot?.courtId === court.id &&
                      selectedSlot?.selectedHours[selectedSlot.selectedHours.length - 1] === time
                    const isSingle = selectedSlot?.courtId === court.id && selectedSlot?.totalHours === 1

                    return (
                      <div
                        key={time}
                        style={{
                          height: `${SLOT_HEIGHT}px`,
                          ...(isPast
                            ? {
                                backgroundImage:
                                  'repeating-linear-gradient(-45deg, #141414, #141414 8px, #1a1a1a 8px, #1a1a1a 16px)',
                              }
                            : {}),
                        }}
                        onClick={() => onSelectEmptySlot(court, time)}
                        className={`border-b border-[#222222] transition-colors relative select-none ${
                          isPast
                            ? 'opacity-35 cursor-not-allowed group'
                            : inRange
                            ? isSingle
                              ? 'bg-[#f2d953]/25 border-x-2 border-[#f2d953] cursor-pointer'
                              : `bg-[#f2d953]/20 border-x-2 border-[#f2d953] cursor-pointer ${
                                  isFirst ? 'border-t-2' : ''
                                } ${isLast ? 'border-b-2' : ''}`
                            : 'hover:bg-[#f2d953]/5 cursor-pointer group'
                        }`}
                      >
                        {/* Jika Waktu Lampau (< 10:40) */}
                        {isPast && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-mono text-[#555555] group-hover:text-red-400 transition-colors">
                              Lewat Waktu
                            </span>
                          </div>
                        )}

                        {/* Label Panduan Seleksi Jam */}
                        {inRange && !isPast && (
                          <div className="absolute inset-x-2 top-2 flex justify-between items-center pointer-events-none z-0">
                            <span className="text-[10px] font-mono text-white bg-[#161616] px-1.5 py-0.5 rounded border border-[#f2d953]/40">
                              {time}
                            </span>
                            {isFirst && (
                              <span className="text-[9px] font-semibold text-[#f2d953] bg-[#161616] px-1.5 py-0.5 rounded">
                                Mulai
                              </span>
                            )}
                            {isLast && !isSingle && (
                              <span className="text-[9px] font-semibold text-[#f2d953] bg-[#161616] px-1.5 py-0.5 rounded">
                                Selesai
                              </span>
                            )}
                          </div>
                        )}

                        {/* Hover Prompt untuk Slot Masa Depan yang Tersedia */}
                        {!inRange && !isPast && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-[11px] font-mono text-[#f2d953] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#f2d953]/30 shadow-sm">
                              {selectedSlot && selectedSlot.courtId === court.id
                                ? 'Pilih Selesai'
                                : 'Pilih Jam'}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* 2. Kartu Booking yang Diposisikan Absolute */}
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
                              Block • Maintenance
                            </span>
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                          </div>
                          <span className="text-[11px] text-[#8e8e8e] font-mono block">
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#737373] italic">Pemeliharaan Rutin</span>
                      </div>
                    )
                  }

                  // Card Booking Terisi Normal (User POV)
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

                        <span className="text-[11px] text-[#8e8e8e] block font-light font-mono">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#737373]">
                        <span>{booking.courtName}</span>
                        <span className="italic text-[#8e8e8e]">Tidak Tersedia</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
