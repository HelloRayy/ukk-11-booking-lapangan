// PERAN FILE: Halaman Utama Kasir Linear Full-Page (Bebas Margin Box Sesuai Instruksi User)
import { useState } from 'react'
import Sidebar from './cashier/dashboard-01/Sidebar'
import Header from './cashier/dashboard-01/Header'
import DashboardOverview from './cashier/dashboard-01/DashboardOverview'
import BookingsTable from './cashier/dashboard-01/BookingsTable'
import ManualBookingModal from './cashier/ManualBookingModal'
import { useCashier } from './cashier/hooks/useCashier'

export default function CashierPage() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'bookings'>('bookings')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Ambil state dan aksi riil Supabase dari custom hook useCashier
  const {
    filteredBookings,
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

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[oklch(0.1932_0.002_230.81)] text-[oklch(0.9235_0.001733_230.685)] font-['Inter_Variable',sans-serif] select-none antialiased">
      {/* 1. Sidebar Navigasi Kiri (Desktop Full Height) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* 2. Drawer Mobile Sederhana */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 bg-[oklch(0.1932_0.002_230.81)] border-r border-[oklch(0.2593_0.0033_230.84)] flex flex-col justify-between h-full">
            <Sidebar
              currentTab={currentTab}
              onTabChange={(tab) => {
                setCurrentTab(tab)
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
          onToggleMobileSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'overview' ? (
            /* Tab 1: Ringkasan Analitik */
            <div className="p-6 max-w-7xl mx-auto">
              <DashboardOverview />
            </div>
          ) : (
            /* Tab 2: Tabel Operasional Linear (Work items) Full Width */
            <BookingsTable
              bookings={filteredBookings}
              loading={loading}
              searchKeyword={searchKeyword}
              selectedStatus={selectedStatus}
              onSearchChange={setSearchKeyword}
              onStatusChange={setSelectedStatus}
              onLunasi={handleLunasi}
              onBatal={handleBatal}
              onRefresh={loadDataKasir}
              onOpenManualModal={() => setIsManualModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* 4. Modal Booking Manual (Walk-in) */}
      <ManualBookingModal
        courts={courts}
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onBookingCreated={loadDataKasir}
      />
    </div>
  )
}
