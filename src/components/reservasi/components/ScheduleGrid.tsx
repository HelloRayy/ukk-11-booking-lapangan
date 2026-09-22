// PERAN FILE: Orkestrator Grid Kalender (Menghubungkan Toast, TimeColumn, dan Kolom Lapangan)
import { useState, useMemo } from 'react'
import type { BookingItem, Court, SlotRangeSelection } from '../types'
import FloatingToast from './grid/FloatingToast'
import TimeColumn from './grid/TimeColumn'
import BookedSlotCard from './grid/BookedSlotCard'
import ActiveSelectionCard from './grid/ActiveSelectionCard'

interface ScheduleGridProps {
  courts: Court[]
  timeSlots: string[]
  bookings: BookingItem[]
  selectedBooking: BookingItem | null
  selectedSlot: SlotRangeSelection | null
  customerName?: string
  rangeError: string | null
  getSlotBooking?: (courtId: number | string, time: string) => BookingItem | undefined
  isSlotInRange: (courtId: number | string, time: string) => boolean
  isPastSlot: (time: string) => boolean
  onSelectBooking: (booking: BookingItem) => void
  onSelectEmptySlot: (court: Court, time: string) => void
  onClearSelection?: () => void
  onClearError?: () => void
}

interface HoveredSlotState {
  courtId: number | string
  hour: number
  time: string
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
  getSlotBooking,
  isSlotInRange,
  isPastSlot,
  onSelectBooking,
  onSelectEmptySlot,
  onClearSelection,
  onClearError,
}: ScheduleGridProps) {
  const [hoveredSlot, setHoveredSlot] = useState<HoveredSlotState | null>(null)

  const currentTimeTop = (10 - BASE_HOUR + 40 / 60) * SLOT_HEIGHT

  // Cek apakah mode preview rentang hover aktif
  const isRangePreviewActive = Boolean(
    selectedSlot &&
      selectedSlot.totalHours === 1 &&
      hoveredSlot &&
      hoveredSlot.courtId === selectedSlot.courtId &&
      hoveredSlot.hour !== selectedSlot.startHour,
  )

  const previewMinHour = isRangePreviewActive
    ? Math.min(selectedSlot!.startHour, hoveredSlot!.hour)
    : null
  const previewMaxHour = isRangePreviewActive
    ? Math.max(selectedSlot!.startHour, hoveredSlot!.hour)
    : null

  // Cek apakah ada tabrakan jadwal atau slot lampau di dalam rentang hover
  const previewHasCollision = useMemo(() => {
    if (!isRangePreviewActive || previewMinHour === null || previewMaxHour === null || !selectedSlot) {
      return false
    }

    for (let h = previewMinHour; h <= previewMaxHour; h++) {
      const timeStr = `${h < 10 ? '0' : ''}${h}:00`
      if (isPastSlot(timeStr)) return true
      if (getSlotBooking && getSlotBooking(selectedSlot.courtId, timeStr)) return true
    }
    return false
  }, [isRangePreviewActive, previewMinHour, previewMaxHour, isPastSlot, getSlotBooking, selectedSlot])

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#141414] select-none font-aeonik">
      {/* 1. Toast Notifikasi Melayang Tanpa Pergeseran Layout */}
      <FloatingToast message={rangeError} onClose={onClearError} />

      {/* 2. Indikator Garis Waktu Berjalan Saat Ini (10:40) */}
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

      {/* 3. Grid Container Kalender */}
      <div
        className="min-w-[720px] flex"
        onMouseLeave={() => setHoveredSlot(null)}
      >
        {/* Kolom Sumbu Waktu Sisi Kiri */}
        <TimeColumn
          timeSlots={timeSlots}
          isPastSlot={isPastSlot}
          slotHeight={SLOT_HEIGHT}
        />

        {/* 4 Kolom Lapangan Independen */}
        <div className="flex-1 grid grid-cols-4 divide-x divide-[#222222]">
          {courts.map((court) => {
            const courtBookings = bookings.filter((b) => b.courtId === court.id)

            return (
              <div
                key={court.id}
                className="relative"
                onMouseLeave={() => setHoveredSlot(null)}
              >
                {/* Background Grid Slot Baris per Jam */}
                <div className="flex flex-col">
                  {timeSlots.map((time) => {
                    const slotHour = parseInt(time.split(':')[0], 10)
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
                        onMouseEnter={() => {
                          if (!isPast) {
                            setHoveredSlot({ courtId: court.id, hour: slotHour, time })
                          }
                        }}
                        onClick={() => onSelectEmptySlot(court, time)}
                        className={`border-b border-[#222222] transition-colors relative select-none ${
                          isPast
                            ? 'opacity-25 cursor-not-allowed'
                            : inRange
                            ? 'bg-[#1a1a1a] cursor-pointer'
                            : 'cursor-pointer group'
                        }`}
                      >
                        {/* Hover Indicator Box */}
                        {!isPast && !inRange && !isRangePreviewActive && (
                          <div className="absolute inset-x-1.5 inset-y-1 rounded-[10px] border border-[#f2d953]/30 bg-[#f2d953]/5 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-between px-3 pointer-events-none shadow-sm">
                            <span className="text-xs font-semibold text-[#f2d953]">
                              {selectedSlot && selectedSlot.courtId === court.id
                                ? 'Pilih Selesai'
                                : 'Pilih Slot'}
                            </span>
                            <span className="text-[11px] text-[#8e8e8e]">{time}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Kartu Booking Absolute (Booked & Maintenance) */}
                {courtBookings.map((booking) => (
                  <BookedSlotCard
                    key={booking.id}
                    booking={booking}
                    isSelected={selectedBooking?.id === booking.id}
                    slotHeight={SLOT_HEIGHT}
                    baseHour={BASE_HOUR}
                    onSelect={onSelectBooking}
                  />
                ))}

                {/* Kartu Seleksi Pengguna Aktif */}
                {selectedSlot && selectedSlot.courtId === court.id && (
                  <ActiveSelectionCard
                    selectedSlot={selectedSlot}
                    court={court}
                    customerName={customerName}
                    slotHeight={SLOT_HEIGHT}
                    baseHour={BASE_HOUR}
                    isRangePreviewActive={isRangePreviewActive}
                    previewMinHour={previewMinHour}
                    previewMaxHour={previewMaxHour}
                    previewHasCollision={previewHasCollision}
                    onClearSelection={onClearSelection}
                    onSelectEmptySlot={onSelectEmptySlot}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
