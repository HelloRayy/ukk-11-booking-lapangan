// PERAN FILE: Halaman Utama Kasir & Pengelola Lapangan (Root Coordinator)
import { useCashier } from './cashier/hooks/useCashier'
import CashierHeader from './cashier/CashierHeader'
import CashierStats from './cashier/CashierStats'
import CashierFilterBar from './cashier/CashierFilterBar'
import CashierTable from './cashier/CashierTable'
import ManualBookingModal from './cashier/ManualBookingModal'
import CourtManagerModal from './cashier/CourtManagerModal'

export default function CashierPage() {
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

  return (
    <div className="space-y-6">
      {/* 1. Header Navigasi & Tombol Aksi Utama */}
      <CashierHeader
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onOpenCourtModal={() => setIsCourtModalOpen(true)}
        onRefresh={loadDataKasir}
      />

      {/* 2. Kartu Ringkasan Finansial (Uang Masuk & Piutang) */}
      <CashierStats daftarBooking={daftarBooking} />

      {/* 3. Bar Kontrol: Search Bar (Poin 13) & Filter Status */}
      <CashierFilterBar
        searchKeyword={searchKeyword}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchKeyword}
        onStatusChange={setSelectedStatus}
      />

      {/* 4. Tabel Daftar Transaksi */}
      <CashierTable
        daftarBooking={filteredBookings}
        loading={loading}
        onLunasi={handleLunasi}
        onBatal={handleBatal}
      />

      {/* 5. Modal Booking Manual (Walk-in) */}
      <ManualBookingModal
        courts={courts}
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onBookingCreated={loadDataKasir}
      />

      {/* 6. Modal Kelola Master Lapangan (CRUD) */}
      <CourtManagerModal
        courts={courts}
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        onCourtsUpdated={loadDataKasir}
      />
    </div>
  )
}
