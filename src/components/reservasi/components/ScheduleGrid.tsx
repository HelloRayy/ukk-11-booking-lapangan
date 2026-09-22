// PERAN FILE: Grid Kalender Bebas Distorsi & Bersih (Clean UI Tanpa Font Mono & Tanpa Teks Redundan)
import { useState, useMemo } from 'react'
import type { BookingItem, Court, SlotRangeSelection } from '../types'

interface ScheduleGridProps {
  courts: Court[]
  timeSlots: string[]
  bookings: BookingItem[]
  selectedBooking: BookingItem | null
  selectedSlot: SlotRangeSelection | null
  customerName?: string
  rangeError: string | null
  getSlotBooking?: (courtId: string, time: string) => BookingItem | undefined
  isSlotInRange: (courtId: string, time: string) => boolean
  isPastSlot: (time: string) => boolean
  onSelectBooking: (booking: BookingItem) => void
  onSelectEmptySlot: (court: Court, time: string) => void
  onClearSelection?: () => void
}

interface HoveredSlotState {
  courtId: string
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
}: ScheduleGridProps) {
  const [hoveredSlot, setHoveredSlot] = useState<HoveredSlotState | null>(null)

  const currentTimeTop = (10 - BASE_HOUR + 40 / 60) * SLOT_HEIGHT

  // Cek apakah mode preview rentang hover aktif (ketika 1 slot sudah dipilih dan user hover jam lain pada lapangan yang sama)
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
      <div
        className="min-w-[720px] flex"
        onMouseLeave={() => setHoveredSlot(null)}
      >
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
              <div
                key={court.id}
                className="relative"
                onMouseLeave={() => setHoveredSlot(null)}
              >
                {/* 1. Background Grid Slot */}
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
                        {/* Hover Indicator Rounded untuk Single Slot (Mirip Active Card) */}
                        {!isPast && !inRange && !isRangePreviewActive && (
                          <div className="absolute inset-x-1.5 inset-y-1 rounded-[10px] border border-dashed border-[#f2d953]/40 bg-[#f2d953]/5 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-between px-3 pointer-events-none shadow-sm">
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

                {/* 3. Kartu Ghost Preview Rentang Hover (Radius rounded-[10px] Mirip Active Card) */}
                {(() => {
                  if (
                    !isRangePreviewActive ||
                    court.id !== selectedSlot?.courtId ||
                    previewMinHour === null ||
                    previewMaxHour === null
                  ) {
                    return null
                  }

                  const previewHours = previewMaxHour - previewMinHour + 1
                  const previewPrice = previewHours * court.pricePerHour
                  const previewEndHour = previewMaxHour + 1
                  const previewEndTimeStr = `${previewEndHour < 10 ? '0' : ''}${previewEndHour}:00`

                  return (
                    <div
                      style={{
                        top: `${(previewMinHour - BASE_HOUR) * SLOT_HEIGHT + 3}px`,
                        height: `${(previewMaxHour - previewMinHour + 1) * SLOT_HEIGHT - 6}px`,
                      }}
                      className={`absolute inset-x-1.5 z-15 rounded-[10px] border-2 border-dashed pointer-events-none transition-all duration-150 flex flex-col justify-between p-3 animate-in fade-in zoom-in-95 ${
                        previewHasCollision
                          ? 'border-red-500/80 bg-red-500/10 shadow-[0_0_24px_rgba(239,68,68,0.2)]'
                          : 'border-[#f2d953] bg-[#f2d953]/10 shadow-[0_0_24px_rgba(242,217,83,0.18)]'
                      }`}
                    >
                      {/* Header jika kursor mengarah ke jam lebih awal dari slot terpilih */}
                      {hoveredSlot && hoveredSlot.hour < selectedSlot.startHour ? (
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold ${
                              previewHasCollision ? 'text-red-400' : 'text-[#f2d953]'
                            }`}
                          >
                            {previewHasCollision ? 'Jadwal Bentrok' : 'Pilih Jam Mulai'}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              previewHasCollision
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-[#f2d953]/20 text-[#f2d953]'
                            }`}
                          >
                            +{previewHours - 1} Jam
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Footer Info Preview di Ujung Rentang */}
                      {previewHasCollision ? (
                        <div className="p-2.5 rounded-[8px] bg-[#1c1c1c]/95 border border-red-500/50 shadow-lg flex items-center justify-center gap-2">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          <span className="text-xs font-medium text-red-400">
                            Jadwal Bentrok - Tidak Bisa Dipilih
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-[8px] bg-[#1a1a1a]/95 border border-[#f2d953]/60 shadow-lg">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-semibold text-[#f2d953]">
                              {hoveredSlot && hoveredSlot.hour > selectedSlot.startHour
                                ? 'Pilih Jam Selesai'
                                : 'Pilih Jam Mulai'}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f2d953]/20 text-[#f2d953] font-semibold border border-[#f2d953]/30">
                              +{previewHours - 1} Jam (Total {previewHours} Jam)
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-[#e5e5e5]">
                            <span>Sampai {previewEndTimeStr}</span>
                            <span className="font-semibold text-[#f2d953]">
                              Rp {previewPrice.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* 4. Kartu Choice / Seleksi Pengguna Aktif (User POV) */}
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
