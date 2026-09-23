// PERAN FILE: Halaman Utama Kasir Berbasis Shadcn Dashboard-01 (Overview & Operasional Tabel)
import { useState } from 'react'
import Sidebar from './cashier/dashboard-01/Sidebar'
import Header from './cashier/dashboard-01/Header'
import DashboardOverview from './cashier/dashboard-01/DashboardOverview'
import BookingsTable from './cashier/dashboard-01/BookingsTable'
import ManualBookingModal from './cashier/ManualBookingModal'
import { useCashier } from './cashier/hooks/useCashier'

export default function CashierPage() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'bookings'>('overview')
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
    <div className="min-h-screen bg-[#121212] text-[#fafafa] flex">
      {/* 1. Sidebar Navigasi Kiri (Desktop) */}
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
          <div className="relative z-10 w-64 bg-[#141414] border-r border-[#262626] p-4 flex flex-col justify-between">
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

      {/* 3. Area Konten Utama Kanan (Header + Content) */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onToggleMobileSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' ? (
              /* Tab 1: Ringkasan Analitik Shadcn Dashboard-01 */
              <DashboardOverview />
            ) : (
              /* Tab 2: Tabel Operasional Meja Kasir (Pelunasan DP & Batal) */
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
          </div>
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
