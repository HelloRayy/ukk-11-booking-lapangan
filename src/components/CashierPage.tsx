// PERAN FILE: Halaman Utama Kasir Linear Full-Page (Bebas Margin Box Sesuai Instruksi User)
import { useState } from 'react'
import Sidebar from './cashier/dashboard-01/Sidebar'
import Header from './cashier/dashboard-01/Header'
import DashboardOverview from './cashier/dashboard-01/DashboardOverview'
import BookingsTable from './cashier/dashboard-01/BookingsTable'
import CourtScheduleGrid from './cashier/dashboard-01/CourtScheduleGrid'
import ManualBookingModal from './cashier/ManualBookingModal'
import CourtManagerModal from './cashier/CourtManagerModal'
import { useCashier } from './cashier/hooks/useCashier'

export default function CashierPage() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'bookings' | 'schedule'>('schedule')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCourtManagerOpen, setIsCourtManagerOpen] = useState(false)
  const [manualModalDefaults, setManualModalDefaults] = useState<{
    courtId?: number
    date?: string
    hour?: string
  }>({})

  // Ambil state dan aksi riil Supabase dari custom hook useCashier
  const {
    filteredBookings,
    allBookings,
    courts,
    loading,
    searchKeyword,
    selectedStatus,
    isManualModalOpen,
    setSearchKeyword,
    setSelectedStatus,
    setIsManualModalOpen,
    handleLunasi,
    handleBatal,
    loadDataKasir,
  } = useCashier()

  const handleOpenManualWithSlot = (courtId: number, date: string, hour: string) => {
    setManualModalDefaults({ courtId, date, hour })
    setIsManualModalOpen(true)
  }

  const handleCloseManualModal = () => {
    setIsManualModalOpen(false)
    setManualModalDefaults({})
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#161616] text-[#fafafa] font-aeonik select-none antialiased">
      {/* 1. Sidebar Navigasi Kiri (Desktop Full Height) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenCourtManager={() => setIsCourtManagerOpen(true)}
      />

      {/* 2. Drawer Mobile Sederhana */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 bg-[#181818] border-r border-[#262626] flex flex-col justify-between h-full">
            <Sidebar
              currentTab={currentTab}
              onTabChange={(tab) => {
                setCurrentTab(tab)
                setIsMobileMenuOpen(false)
              }}
              onOpenCourtManager={() => {
                setIsCourtManagerOpen(true)
                setIsMobileMenuOpen(false)
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Area Konten Utama Kanan (Header + Scrollable Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          currentTab={currentTab}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          onToggleMobileSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'overview' ? (
            /* Tab 1: Ringkasan Analitik */
            <div className="p-6 max-w-7xl mx-auto">
              <DashboardOverview
                bookings={allBookings}
                courts={courts}
                loading={loading}
              />
            </div>
          ) : currentTab === 'schedule' ? (
            /* Tab 2: Visualisasi Matriks Kalender Lapangan Kasir */
            <CourtScheduleGrid
              bookings={allBookings}
              courts={courts}
              loading={loading}
              onLunasi={handleLunasi}
              onBatal={handleBatal}
              onRefresh={loadDataKasir}
              onOpenManualModalWithSlot={handleOpenManualWithSlot}
            />
          ) : (
            /* Tab 3: Tabel Operasional Linear (Work items) Full Width */
            <BookingsTable
              bookings={filteredBookings}
              courts={courts}
              loading={loading}
              searchKeyword={searchKeyword}
              selectedStatus={selectedStatus}
              onSearchChange={setSearchKeyword}
              onStatusChange={setSelectedStatus}
              onLunasi={handleLunasi}
              onBatal={handleBatal}
              onRefresh={loadDataKasir}
              onOpenManualModal={() => {
                setManualModalDefaults({})
                setIsManualModalOpen(true)
              }}
            />
          )}
        </main>
      </div>

      {/* 4. Modal Booking Manual (Walk-in) */}
      <ManualBookingModal
        courts={courts}
        isOpen={isManualModalOpen}
        onClose={handleCloseManualModal}
        onBookingCreated={loadDataKasir}
        initialCourtId={manualModalDefaults.courtId}
        initialDate={manualModalDefaults.date}
        initialHour={manualModalDefaults.hour}
      />

      {/* 5. Modal CRUD Master Data Lapangan (Poin 10, 11, 12 UKK) */}
      <CourtManagerModal
        courts={courts}
        isOpen={isCourtManagerOpen}
        onClose={() => setIsCourtManagerOpen(false)}
        onCourtsUpdated={loadDataKasir}
      />
    </div>
  )
}
