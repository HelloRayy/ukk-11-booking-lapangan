// PERAN FILE: Root Coordinator Halaman /reservasi dengan Multi-Slot Range Selection (User POV)
import { useReservasiSchedule } from './hooks/useReservasiSchedule'
import ReservasiNavbar from './components/ReservasiNavbar'
import ScheduleHeader from './components/ScheduleHeader'
import ScheduleGrid from './components/ScheduleGrid'
import RightPanelInspector from './components/RightPanelInspector'

export default function ReservasiPage() {
  const {
    courts,
    timeSlots,
    bookings,
    customer,
    panelMode,
    selectedBooking,
    selectedSlot,
    rangeError,
    getSlotBooking,
    isSlotInRange,
    isPastSlot,
    handleSelectBooking,
    handleSelectEmptySlot,
    handleClosePanel,
    handleCreateBooking,
    handleClearError,
  } = useReservasiSchedule()

  return (
    <div className="h-screen w-screen bg-[#161616] text-[#fafafa] font-aeonik flex flex-col overflow-hidden select-none">
      {/* 1. Navbar Atas (Header & Date Selector) */}
      <ReservasiNavbar customerName={customer?.nama} />

      {/* 2. Area Utama: Kalender & Push Right Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kolom Utama: Tabel Kalender (Header Lapangan + Grid Jam) - Otomatis tergeser saat panel terbuka */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-300 ease-in-out">
          <ScheduleHeader courts={courts} />
          <ScheduleGrid
            courts={courts}
            timeSlots={timeSlots}
            bookings={bookings}
            selectedBooking={selectedBooking}
            selectedSlot={selectedSlot}
            customerName={customer?.nama}
            rangeError={rangeError}
            getSlotBooking={getSlotBooking}
            isSlotInRange={isSlotInRange}
            isPastSlot={isPastSlot}
            onSelectBooking={handleSelectBooking}
            onSelectEmptySlot={handleSelectEmptySlot}
            onClearSelection={handleClosePanel}
            onClearError={handleClearError}
          />
        </div>

        {/* Floating Slide-Over Drawer dari Kanan (Tanpa Empty State) */}
        <RightPanelInspector
          panelMode={panelMode}
          selectedBooking={selectedBooking}
          selectedSlot={selectedSlot}
          customerName={customer?.nama}
          customerWhatsapp={customer?.whatsapp}
          customerEmail={customer?.email}
          onClose={handleClosePanel}
          onCreateBooking={handleCreateBooking}
        />
      </div>
    </div>
  )
}
