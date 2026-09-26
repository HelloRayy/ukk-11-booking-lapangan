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
  onCreateBooking: (
    paymentType: PaymentType,
    notes?: string,
    customerData?: { nama: string; whatsapp: string; email?: string }
  ) => void | Promise<void>
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
  const [paymentType, setPaymentType] = useState<PaymentType>('DP')
  const [notes, setNotes] = useState('')
  const [bookingStep, setBookingStep] = useState<'details' | 'loading' | 'payment'>('details')
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null)
  const [isViewingReceipt, setIsViewingReceipt] = useState(false)
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)

  // State nama dan WhatsApp yang bisa diedit di form
  const [formName, setFormName] = useState(customerName || '')
  const [formWhatsapp, setFormWhatsapp] = useState(customerWhatsapp || '')

  useEffect(() => {
    if (customerName) setFormName(customerName)
  }, [customerName])

  useEffect(() => {
    if (customerWhatsapp) setFormWhatsapp(customerWhatsapp)
  }, [customerWhatsapp])

  // Reset step ketika slot baru dipilih
  const slotKey = selectedSlot ? `${selectedSlot.courtId}-${selectedSlot.startHour}-${selectedSlot.endHour}` : null
  useEffect(() => {
    setBookingStep('details')
    setExpiryTimestamp(null)
    setIsViewingReceipt(false)
    setIsVerifyingPayment(false)
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
      }, 700)
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

  const handleConfirmPayment = async () => {
    setIsVerifyingPayment(true)
    try {
      // Transisi loading state realistis saat perpindahan QR ke struk (~1100ms)
      await new Promise((resolve) => setTimeout(resolve, 1100))
      await onCreateBooking(paymentType, notes, {
        nama: formName.trim() || 'Raditya Rayhan',
        whatsapp: formWhatsapp.trim() || '085799799857',
        email: customerEmail,
      })
    } finally {
      setIsVerifyingPayment(false)
      setBookingStep('details')
      setExpiryTimestamp(null)
    }
  }

  // Jika kondisi kosong (idle), di layar HP sembunyikan agar kalender bisa dilihat 100% penuh
  if (panelMode === 'empty') {
    return (
      <aside
        aria-label="Panel Reservasi Lapangan"
        className="hidden lg:flex lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-6 flex-col justify-between overflow-y-auto select-none font-aeonik shrink-0"
      >
        <EmptyInspectorView />
      </aside>
    )
  }

  return (
    <>
      {/* Mobile Backdrop Overlay saat panel form/struk terbuka */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        onClick={() => onClose()}
      />

      <aside
        aria-label="Panel Reservasi Lapangan"
        className="fixed inset-x-0 bottom-0 max-h-[90vh] z-50 rounded-t-2xl border-t border-[#2e2e2e] shadow-2xl bg-[#1a1a1a] p-5 sm:p-6 lg:static lg:inset-auto lg:max-h-none lg:z-auto lg:rounded-none lg:border-t-0 lg:border-l lg:border-[#262626] lg:shadow-none w-full lg:w-[380px] xl:w-[420px] flex flex-col justify-between overflow-y-auto select-none font-aeonik shrink-0"
      >
        {/* Mobile Pull/Drag Indicator Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3 lg:hidden shrink-0" />

        {/* Loading State saat Verifikasi Pembayaran (Transisi QR -> Struk) */}
        {isVerifyingPayment ? (
          <PaymentLoadingView
            title="Memverifikasi Pembayaran"
            subtitle="Mengonfirmasi transaksi QRIS dan menerbitkan bukti booking..."
          />
        ) : (
          <>
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
                {/* Sub-Step A: Loading animasi (~700ms) */}
                {bookingStep === 'loading' && (
                  <PaymentLoadingView
                    title="Menyiapkan Pembayaran"
                    subtitle="Menghubungkan ke sistem QRIS Dinamis..."
                  />
                )}

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
                    customerName={formName}
                    customerWhatsapp={formWhatsapp}
                    customerEmail={customerEmail || ''}
                    onPaymentTypeChange={setPaymentType}
                    onNotesChange={setNotes}
                    onCustomerNameChange={setFormName}
                    onCustomerWhatsappChange={setFormWhatsapp}
                    onClose={() => onClose()}
                    onProceedToPayment={handleProceedToPayment}
                  />
                )}
              </div>
            )}
          </>
        )}
      </aside>
    </>
  )
}
