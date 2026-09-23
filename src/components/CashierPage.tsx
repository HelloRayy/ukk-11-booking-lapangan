// PERAN FILE: Halaman Utama Kasir Linear-Style (Sesuai Bounding Box & Styling Referensi OKLCH)
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
    <div className="min-h-screen bg-[oklch(0.14_0.002_230.81)] p-2 sm:p-3 text-[oklch(0.9235_0.001733_230.685)] text-base leading-normal transition-all font-['Inter_Variable',sans-serif]">
      {/* Container Kotak Fisik Sesuai Referensi Linear */}
      <div className="flex flex-col rounded-lg border border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.1932_0.002_230.81)] shadow-2xl leading-normal transition-all min-h-[calc(100vh-1.5rem)] overflow-hidden max-w-[1486px] mx-auto">
        <div className="flex flex-1 leading-normal transition-all min-h-0">
          {/* 1. Sidebar Navigasi Kiri (Desktop) */}
          <div className="bg-[oklch(0.1932_0.002_230.81)] border-r border-[oklch(0.2593_0.0033_230.84)] leading-normal transition-all">
            <Sidebar
              currentTab={currentTab}
              onTabChange={(tab) => setCurrentTab(tab)}
            />
          </div>

          {/* 2. Drawer Mobile Sederhana */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="relative z-10 w-64 bg-[oklch(0.1932_0.002_230.81)] border-r border-[oklch(0.2593_0.0033_230.84)] p-4 flex flex-col justify-between">
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

          {/* 3. Area Konten Utama Kanan (Header + Main Table) */}
          <main className="flex-1 flex flex-col bg-[oklch(0.1932_0.002_230.81)] leading-normal transition-all min-w-0">
            <Header
              currentTab={currentTab}
              onToggleMobileSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            <div className="flex-1 overflow-y-auto leading-normal transition-all">
              {currentTab === 'overview' ? (
                /* Tab 1: Ringkasan Analitik */
                <div className="p-4 sm:p-6">
                  <DashboardOverview />
                </div>
              ) : (
                /* Tab 2: Tabel Operasional Linear (Work items) */
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
