// PERAN FILE: Grid Kalender Jadwal dengan Dukungan Multi-Slot Range Selection (User POV)
import type { BookingItem, Court, SlotRangeSelection } from '../types'

interface ScheduleGridProps {
  courts: Court[]
  timeSlots: string[]
  selectedBooking: BookingItem | null
  selectedSlot: SlotRangeSelection | null
  rangeError: string | null
  getSlotBooking: (courtId: string, time: string) => BookingItem | undefined
  isSlotInRange: (courtId: string, time: string) => boolean
  onSelectBooking: (booking: BookingItem) => void
  onSelectEmptySlot: (court: Court, time: string) => void
}

export default function ScheduleGrid({
  courts,
  timeSlots,
  selectedBooking,
  selectedSlot,
  rangeError,
  getSlotBooking,
  isSlotInRange,
  onSelectBooking,
  onSelectEmptySlot,
}: ScheduleGridProps) {
  return (
    <div className="relative flex-1 overflow-y-auto bg-[#141414] select-none">
      {/* Toast Peringatan Bentrok Jadwal jika Range Overlap */}
      {rangeError && (
        <div className="sticky top-2 z-30 mx-auto max-w-md p-3 rounded-[10px] bg-red-500/90 text-white text-xs font-medium shadow-lg backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
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

      {/* Indicator Waktu Berjalan (Blue Line 10:40) */}
      <div className="absolute top-[280px] left-0 right-0 z-20 pointer-events-none flex items-center">
        <div className="w-20 sm:w-24 shrink-0 flex justify-end pr-2">
          <span className="px-2 py-0.5 rounded bg-[#0091ff] text-white text-[11px] font-mono font-bold shadow-md">
            10:40
          </span>
        </div>
        <div className="flex-1 h-[2px] bg-[#0091ff]/70 shadow-[0_0_8px_rgba(0,145,255,0.6)]" />
      </div>

      {/* Grid Container */}
      <div className="min-w-[720px]">
        {timeSlots.map((time) => (
          <div key={time} className="flex min-h-[96px] border-b border-[#222222]">
            {/* Sumbu Waktu Kiri */}
            <div className="w-20 sm:w-24 shrink-0 p-3 text-right text-xs font-mono text-[#666666] border-r border-[#262626]">
              {time}
            </div>

            {/* 4 Kolom Slot Lapangan */}
            <div className="flex-1 grid grid-cols-4 divide-x divide-[#222222]">
              {courts.map((court) => {
                const booking = getSlotBooking(court.id, time)
                const inRange = isSlotInRange(court.id, time)
                const isSelectedBooking = selectedBooking?.id === booking?.id

                // Kasus 1: Slot memiliki data Booking (Jadwal Terisi / Maintenance)
                if (booking) {
                  // Cek apakah slot ini adalah permulaan booking
                  if (booking.startTime !== time) {
                    return (
                      <div
                        key={court.id}
                        className="bg-[#202020]/40 p-2 cursor-pointer hover:bg-[#202020]/60 transition-colors"
                        onClick={() => onSelectBooking(booking)}
                      />
                    )
                  }

                  const startH = parseInt(booking.startTime.split(':')[0], 10)
                  const endH = parseInt(booking.endTime.split(':')[0], 10)
                  const durationHours = Math.max(1, endH - startH)

                  // Slot Maintenance
                  if (booking.status === 'maintenance') {
                    return (
                      <div
                        key={court.id}
                        onClick={() => onSelectBooking(booking)}
                        style={{
                          height: `calc(${durationHours * 96}px - 8px)`,
                          backgroundImage:
                            'repeating-linear-gradient(45deg, #1c1c1c, #1c1c1c 10px, #262626 10px, #262626 20px)',
                        }}
                        className={`m-1 p-3 rounded-[10px] border border-dashed border-[#404040] flex flex-col justify-between cursor-pointer transition-all hover:brightness-110 ${
                          isSelectedBooking ? 'ring-2 ring-white/60' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-medium text-[#a3a3a3]">
                              Block • Maintenance
                            </span>
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                          </div>
                          <span className="text-[11px] text-[#737373] block">
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#666666] italic">Pemeliharaan Rutin</span>
                      </div>
                    )
                  }

                  // Slot Booked Normal (User POV: Mengetahui slot ini sudah terisi)
                  return (
                    <div
                      key={court.id}
                      onClick={() => onSelectBooking(booking)}
                      style={{
                        height: `calc(${durationHours * 96}px - 8px)`,
                      }}
                      className={`m-1 p-3 rounded-[10px] bg-[#222222] border transition-all cursor-pointer flex flex-col justify-between group shadow-sm ${
                        isSelectedBooking
                          ? 'border-[#f2d953] ring-1 ring-[#f2d953] shadow-[0_0_15px_rgba(242,217,83,0.2)]'
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

                        <span className="text-[11px] text-[#8e8e8e] block font-light">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#737373]">
                        <span>{booking.courtName}</span>
                        <span className="italic">Tidak Tersedia</span>
                      </div>
                    </div>
                  )
                }

                // Kasus 2: Slot Masuk Rentang Pilihan Multi-Slot User (Range Active)
                if (inRange && selectedSlot) {
                  const isFirst = selectedSlot.selectedHours[0] === time
                  const isLast = selectedSlot.selectedHours[selectedSlot.selectedHours.length - 1] === time
                  const isSingle = selectedSlot.totalHours === 1

                  return (
                    <div
                      key={court.id}
                      onClick={() => onSelectEmptySlot(court, time)}
                      className={`p-2 relative flex flex-col justify-between cursor-pointer transition-all ${
                        isSingle
                          ? 'bg-[#f2d953]/25 border-2 border-[#f2d953] rounded-[10px] m-1'
                          : `bg-[#f2d953]/20 border-x-2 border-[#f2d953] ${
                              isFirst ? 'border-t-2 rounded-t-[10px] mt-1' : ''
                            } ${isLast ? 'border-b-2 rounded-b-[10px] mb-1' : ''}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white bg-[#161616] px-2 py-0.5 rounded border border-[#f2d953]/40 font-mono">
                          {time}
                        </span>
                        {isFirst && (
                          <span className="text-[10px] font-semibold text-[#f2d953] bg-[#161616] px-2 py-0.5 rounded">
                            Mulai
                          </span>
                        )}
                        {isLast && !isSingle && (
                          <span className="text-[10px] font-semibold text-[#f2d953] bg-[#161616] px-2 py-0.5 rounded">
                            Selesai ({selectedSlot.endTime})
                          </span>
                        )}
                      </div>

                      {isSingle ? (
                        <span className="text-[11px] text-[#f2d953] font-medium block text-center">
                          Klik jam lain untuk memperpanjang rentang
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#f2d953]/80 font-mono text-center">
                          Terpilih dalam rentang ({selectedSlot.totalHours} Jam)
                        </span>
                      )}
                    </div>
                  )
                }

                // Kasus 3: Slot Kosong Normal (Siap Diklik untuk Memilih Range)
                return (
                  <div
                    key={court.id}
                    onClick={() => onSelectEmptySlot(court, time)}
                    className="p-2 transition-all cursor-pointer flex items-center justify-center relative group hover:bg-[#f2d953]/5 hover:border hover:border-[#f2d953]/30"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-[#f2d953] flex items-center gap-1 bg-[#1a1a1a] px-2.5 py-1 rounded-[6px] border border-[#f2d953]/30 shadow-md">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span>
                        {selectedSlot && selectedSlot.courtId === court.id
                          ? 'Pilih Jam Selesai'
                          : 'Pilih Jam'}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
