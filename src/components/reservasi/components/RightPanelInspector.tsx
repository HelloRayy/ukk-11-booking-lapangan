// PERAN FILE: Orkestrator Panel Kanan (Menghubungkan Empty State, Form, Layar QRIS, dan Struk)
import { useState, useEffect } from 'react'
import type { BookingItem, SlotRangeSelection, PaymentType, RightPanelMode } from '../types'
import EmptyInspectorView from './inspector/EmptyInspectorView'
import InspectBookingView from './inspector/InspectBookingView'
import PaymentLoadingView from './inspector/PaymentLoadingView'
import BookingDetailsForm from './inspector/BookingDetailsForm'
import QrisPaymentView from './QrisPaymentView'
import BookingReceiptView from './BookingReceiptView'

interface RightPanelInspectorProps {
  panelMode: RightPanelMode
  selectedBooking: BookingItem | null
  selectedSlot: SlotRangeSelection | null
  customerName?: string
  customerWhatsapp?: string
  customerEmail?: string
  onClose: (expiredMessage?: string) => void
  onCreateBooking: (paymentType: PaymentType, notes?: string) => void
}

export default function RightPanelInspector({
  panelMode,
  selectedBooking,
  selectedSlot,
  customerName,
  customerWhatsapp,
  customerEmail,
  onClose,
  onCreateBooking,
}: RightPanelInspectorProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>('dp')
  const [notes, setNotes] = useState('')
  const [bookingStep, setBookingStep] = useState<'details' | 'loading' | 'payment'>('details')
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null)
  const [isViewingReceipt, setIsViewingReceipt] = useState(false)

  // Reset step ketika slot baru dipilih
  const slotKey = selectedSlot ? `${selectedSlot.courtId}-${selectedSlot.startHour}-${selectedSlot.endHour}` : null
  useEffect(() => {
    setBookingStep('details')
    setExpiryTimestamp(null)
    setIsViewingReceipt(false)
  }, [slotKey, selectedBooking])

  // Shortcut tombol Escape untuk membatalkan pemilihan slot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panelMode !== 'empty') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [panelMode, onClose])

  const handleProceedToPayment = () => {
    if (!expiryTimestamp) {
      setBookingStep('loading')
      setTimeout(() => {
        setExpiryTimestamp(Date.now() + 15 * 60 * 1000) // 15 Menit
        setBookingStep('payment')
      }, 800)
    } else {
      setBookingStep('payment')
    }
  }

  const handleCancelPayment = (isExpired?: boolean) => {
    setBookingStep('details')
    setExpiryTimestamp(null)
    if (isExpired) {
      onClose('Waktu pembayaran QRIS telah habis (15 menit). Pilihan slot otomatis dibatalkan.')
    } else {
      onClose()
    }
  }

  const handleConfirmPayment = () => {
    setBookingStep('details')
    setExpiryTimestamp(null)
    onCreateBooking(paymentType, notes)
  }

  const finalCustomerName = customerName || 'Raditya Rayhan'
  const finalWhatsapp = customerWhatsapp || '085799799857'
  const finalEmail = customerEmail || 'raditya.rayhan@gmail.com'

  return (
    <aside
      aria-label="Panel Reservasi Lapangan"
      className="w-full lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-6 flex flex-col justify-between overflow-y-auto select-none font-aeonik shrink-0"
    >
      {/* 1. KONTEN EMPTY STATE (Saat Idle / Belum Pilih Slot) */}
      {panelMode === 'empty' && <EmptyInspectorView />}

      {/* 2. KONTEN INSPEKSI JADWAL TERISI */}
      {panelMode === 'inspect' && selectedBooking && (
        isViewingReceipt ? (
          <BookingReceiptView
            booking={selectedBooking}
            onClose={() => setIsViewingReceipt(false)}
          />
        ) : (
          <InspectBookingView
            selectedBooking={selectedBooking}
            onClose={() => onClose()}
            onViewReceipt={() => setIsViewingReceipt(true)}
          />
        )
      )}

      {/* 3. KONTEN BUKTI STRUK DIGITAL RESMI */}
      {panelMode === 'receipt' && selectedBooking && (
        <BookingReceiptView
          booking={selectedBooking}
          onClose={() => onClose()}
        />
      )}

      {/* 4. KONTEN PEMESANAN BARU (Create Flow) */}
      {panelMode === 'create' && selectedSlot && (
        <div className="flex flex-col justify-between h-full">
          {/* Sub-Step A: Loading animasi (~800ms) */}
          {bookingStep === 'loading' && <PaymentLoadingView />}

          {/* Sub-Step B: Layar Pembayaran QRIS Dinamis */}
          {bookingStep === 'payment' && expiryTimestamp && (
            <QrisPaymentView
              selectedSlot={selectedSlot}
              paymentType={paymentType}
              notes={notes}
              expiryTimestamp={expiryTimestamp}
              onBackToDetails={() => setBookingStep('details')}
              onConfirmPayment={handleConfirmPayment}
              onCancelPayment={handleCancelPayment}
            />
          )}

          {/* Sub-Step C: Formulir Konfirmasi Rincian */}
          {bookingStep === 'details' && (
            <BookingDetailsForm
              selectedSlot={selectedSlot}
              paymentType={paymentType}
              notes={notes}
              customerName={finalCustomerName}
              customerWhatsapp={finalWhatsapp}
              customerEmail={finalEmail}
              onPaymentTypeChange={setPaymentType}
              onNotesChange={setNotes}
              onClose={() => onClose()}
              onProceedToPayment={handleProceedToPayment}
            />
          )}
        </div>
      )}
    </aside>
  )
}
