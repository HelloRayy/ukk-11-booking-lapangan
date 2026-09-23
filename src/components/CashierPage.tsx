// PERAN FILE: Halaman Utama Kasir & Pengelola Lapangan (Root Coordinator)
import { useState } from 'react'
import { useCashier } from './cashier/hooks/useCashier'
import CashierHeader from './cashier/CashierHeader'
import CashierStats from './cashier/CashierStats'
import CashierFilterBar from './cashier/CashierFilterBar'
import CashierTable from './cashier/CashierTable'
import ManualBookingModal from './cashier/ManualBookingModal'
import CourtManagerModal from './cashier/CourtManagerModal'
import OverviewPanel from './cashier/overview/OverviewPanel'
import type { TodoItem } from './cashier/overview/types'

export default function CashierPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings'>('dashboard')

  const {
    daftarBooking,
    filteredBookings,
    courts,
    loading,
    searchKeyword,
    selectedStatus,
    isManualModalOpen,
    isCourtModalOpen,
    setSearchKeyword,
    setSelectedStatus,
    setIsManualModalOpen,
    setIsCourtModalOpen,
    handleLunasi,
    handleBatal,
    loadDataKasir,
  } = useCashier()

  // Handler saat kartu TodoList diklik
  const handleSelectTodo = (item: TodoItem) => {
    if (item.badgeVariant === 'unpaid') {
      setSelectedStatus('dp')
      setActiveTab('bookings')
    } else {
      setActiveTab('bookings')
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Navigasi & Tab Switcher */}
      <CashierHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onOpenCourtModal={() => setIsCourtModalOpen(true)}
        onRefresh={loadDataKasir}
      />

      {/* 2. Konten Dinamis Berdasarkan Tab Aktif */}
      {activeTab === 'dashboard' ? (
        /* Tab 1: Overview Panel (Jaya Padel Modern Analytics) */
        <OverviewPanel
          onManageCourts={() => setIsCourtModalOpen(true)}
          onSelectTodo={handleSelectTodo}
        />
      ) : (
        /* Tab 2: Bookings (Meja Kasir, Finansial, Filter & Tabel Transaksi) */
        <div className="space-y-6 animate-fadeIn">
          {/* Kartu Ringkasan Finansial (Uang Masuk & Piutang) */}
          <CashierStats daftarBooking={daftarBooking} />

          {/* Bar Kontrol: Search Bar & Filter Status */}
          <CashierFilterBar
            searchKeyword={searchKeyword}
            selectedStatus={selectedStatus}
            onSearchChange={setSearchKeyword}
            onStatusChange={setSelectedStatus}
          />

          {/* Tabel Daftar Transaksi */}
          <CashierTable
            daftarBooking={filteredBookings}
            loading={loading}
            onLunasi={handleLunasi}
            onBatal={handleBatal}
          />
        </div>
      )}

      {/* 3. Modal Dialog (Dapat dibuka dari tab mana saja) */}
      <ManualBookingModal
        courts={courts}
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onBookingCreated={loadDataKasir}
      />

      <CourtManagerModal
        courts={courts}
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        onCourtsUpdated={loadDataKasir}
      />
    </div>
  )
}
