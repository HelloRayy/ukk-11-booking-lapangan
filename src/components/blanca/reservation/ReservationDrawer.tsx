// PERAN FILE: Root Coordinator Side Panel Reservasi Blanca (Modular Feature-Folder)
import { useReservationDrawer } from './hooks/useReservationDrawer'
import ReservationFab from './components/ReservationFab'
import ReservationSidePanel from './components/ReservationSidePanel'

interface ReservationDrawerProps {
  drawer?: ReturnType<typeof useReservationDrawer>
}

export default function ReservationDrawer({ drawer: customDrawer }: ReservationDrawerProps = {}) {
  const defaultDrawer = useReservationDrawer()
  const drawer = customDrawer || defaultDrawer

  const {
    isOpen,
    openDrawer,
    closeDrawer,
    customerInfo,
    updateField,
    isFormValid,
    isSubmitted,
    handleSubmit,
    resetForm,
  } = drawer

  return (
    <>
      {/* 1. Floating Action Button (FAB) di Bawah Layar */}
      <ReservationFab onOpen={openDrawer} />

      {/* 2. Side Panel Drawer yang Muncul dari Kanan */}
      <ReservationSidePanel
        isOpen={isOpen}
        onClose={closeDrawer}
        customerInfo={customerInfo}
        onUpdateField={updateField}
        isFormValid={isFormValid}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />
    </>
  )
}
