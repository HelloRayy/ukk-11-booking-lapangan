import { useReservationSchedule } from './hooks/useReservationSchedule'
import ReservationNavbar from './components/ReservationNavbar'
import ScheduleHeader from './components/ScheduleHeader'
import ScheduleGrid from './components/ScheduleGrid'
import RightPanelInspector from './components/RightPanelInspector'

export default function ReservationPage() {
  const {
    courts,
    timeSlots,
    bookings,
    customer,
    panelMode,
    selectedBooking,
    selectedSlot,
    selectedDate,
    rangeError,
    getSlotBooking,
    isSlotInRange,
    isPastSlot,
    handleSelectBooking,
    handleSelectEmptySlot,
    handleClosePanel,
    handleCreateBooking,
    handleClearError,
    handleDateChange,
  } = useReservationSchedule()

  return (
    <div className="h-screen w-screen bg-[#161616] text-[#fafafa] font-aeonik flex flex-col overflow-hidden select-none">
      {/* 1. Navbar Atas (Header & Date Selector) */}
      <ReservationNavbar
        customerName={customer?.nama}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      {/* 2. Area Utama: Kalender di Kiri, Panel Informasi & Booking di Kanan */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kolom Utama: Tabel Kalender (Header Lapangan + Grid Jam) */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 border-r border-[#262626]">
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
