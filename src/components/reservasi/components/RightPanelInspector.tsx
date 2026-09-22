// PERAN FILE: Floating Slide-Over Drawer Tanpa Empty State (Muncul Mulus dari Kanan saat Slot Aktif)
import { useState, useEffect } from 'react'
import type { BookingItem, SlotRangeSelection, PaymentType, RightPanelMode } from '../types'
import QrisPaymentView from './QrisPaymentView'

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState<'details' | 'loading' | 'payment'>('details')
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null)

  // Reset step ketika slot baru dipilih
  const slotKey = selectedSlot ? `${selectedSlot.courtId}-${selectedSlot.startHour}-${selectedSlot.endHour}` : null
  useEffect(() => {
    setBookingStep('details')
    setExpiryTimestamp(null)
  }, [slotKey])

  // Cache data terakhir agar saat transisi slide-out konten tidak menghilang tiba-tiba
  const [cachedSlot, setCachedSlot] = useState(selectedSlot)
  const [cachedBooking, setCachedBooking] = useState(selectedBooking)
  const [cachedMode, setCachedMode] = useState<RightPanelMode>(panelMode)

  useEffect(() => {
    if (panelMode !== 'empty') {
      setCachedMode(panelMode)
      if (selectedSlot) setCachedSlot(selectedSlot)
      if (selectedBooking) setCachedBooking(selectedBooking)
    }
  }, [panelMode, selectedSlot, selectedBooking])

  const isOpen = panelMode !== 'empty' && (Boolean(selectedSlot) || Boolean(selectedBooking))

  // Shortcut tombol Escape untuk menutup drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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

  const currentMode = isOpen ? panelMode : cachedMode
  const activeSlot = isOpen ? selectedSlot : (cachedSlot || selectedSlot)
  const activeBooking = isOpen ? selectedBooking : (cachedBooking || selectedBooking)

  const finalCustomerName = customerName || 'Raditya Rayhan'
  const finalWhatsapp = customerWhatsapp || '085799799857'
  const finalEmail = customerEmail || 'raditya.rayhan@gmail.com'
  const dpAmount = activeSlot ? activeSlot.totalPrice * 0.5 : 0

  return (
    <aside
      aria-label="Panel Detail Reservasi"
      className={`bg-[#1a1a1a] flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-aeonik transition-all duration-300 ease-in-out shrink-0 ${
        isOpen
          ? 'w-[380px] xl:w-[420px] p-6 border-l border-[#262626] opacity-100'
          : 'w-0 p-0 border-0 opacity-0 pointer-events-none'
      }`}
    >
      {/* KONTEN 1: INSPECT EXISTING BOOKING */}
      {currentMode === 'inspect' && activeBooking && (
        <div className="w-[332px] xl:w-[372px] flex flex-col justify-between h-full shrink-0">
          <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup panel"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <span className="text-xs text-[#8e8e8e]">
                {activeBooking.status === 'maintenance' ? 'Maintenance' : 'Terisi'}
              </span>
            </div>

            {/* Banner Lapangan */}
            <div className="relative h-[150px] rounded-[14px] overflow-hidden mb-6 border border-white/10 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80"
                alt={activeBooking.courtName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs px-2.5 py-1 rounded-[6px] bg-black/70 backdrop-blur-md text-white font-medium border border-white/15">
                {activeBooking.courtName}
              </span>
            </div>

            {/* Detail Pemesan */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-xs text-[#a3a3a3] block mb-1">
                  Jadwal Tidak Tersedia
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                  {activeBooking.customerName}
                </h2>
                <p className="text-sm text-[#8e8e8e]">
                  {activeBooking.date}, {activeBooking.startTime}–{activeBooking.endTime}
                </p>
              </div>

              <div className="w-12 h-12 rounded-[12px] bg-[#2a2a2a] border border-white/15 text-white flex items-center justify-center text-lg font-bold shrink-0">
                {activeBooking.avatarInitials || 'BS'}
              </div>
            </div>

            <div className="p-4 rounded-[12px] bg-white/[0.03] border border-white/10 mb-6 text-sm text-[#a3a3a3] leading-relaxed">
              Slot pada jam ini telah dipesan. Silakan pilih slot lain yang masih berstatus kosong pada tabel kalender.
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-semibold transition-colors cursor-pointer shadow-md"
            >
              Cari Slot Kosong Lain
            </button>
          </div>
        </div>
      )}

      {/* KONTEN 2: CREATE NEW BOOKING */}
      {currentMode === 'create' && activeSlot && (
        <div className="w-[332px] xl:w-[372px] flex flex-col justify-between h-full shrink-0">
          {/* SUB-STEP A: LOADING GENERATE PAYMENT (~800ms) */}
          {bookingStep === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#f2d953] animate-spin mb-4" />
              <h3 className="text-base font-bold text-white mb-1.5">
                Menyiapkan Kanal Pembayaran
              </h3>
              <p className="text-xs text-[#8e8e8e] max-w-[240px] leading-relaxed">
                Menghubungkan ke gateway dan mengunci slot {activeSlot.courtName}...
              </p>
            </div>
          )}

          {/* SUB-STEP B: QRIS PAYMENT SCREEN */}
          {bookingStep === 'payment' && expiryTimestamp && (
            <QrisPaymentView
              selectedSlot={activeSlot}
              paymentType={paymentType}
              notes={notes}
              expiryTimestamp={expiryTimestamp}
              onBackToDetails={() => setBookingStep('details')}
              onConfirmPayment={handleConfirmPayment}
              onCancelPayment={handleCancelPayment}
            />
          )}

          {/* SUB-STEP C: DETAILS CONFIRMATION FORM */}
          {bookingStep === 'details' && (
            <div className="flex flex-col justify-between h-full animate-in fade-in duration-150">
              <div>
                {/* Top Bar: Navigasi & Judul */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Batal pemilihan"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                  <span className="text-xs text-[#8e8e8e] font-medium">
                    Rincian Pembayaran
                  </span>
                </div>

                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Konfirmasi Reservasi
                  </h2>
                  <p className="text-xs text-[#8e8e8e] mt-0.5">
                    {activeSlot.date} • {activeSlot.courtName}
                  </p>
                </div>

                {/* 1. Ringkasan Jadwal & Waktu Main */}
                <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#8e8e8e]">Waktu Bermain</span>
                    <span className="text-xs text-white font-medium">
                      {activeSlot.totalHours} Jam
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">
                      {activeSlot.startTime} - {activeSlot.endTime}
                    </span>
                    <span className="text-xs text-[#8e8e8e]">
                      Rp {activeSlot.pricePerHour.toLocaleString('id-ID')} / jam
                    </span>
                  </div>
                </div>

                {/* 2. Rincian Tagihan Transparan */}
                <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] mb-3">
                  <div className="flex justify-between text-xs text-[#8e8e8e] mb-2">
                    <span>Sewa {activeSlot.courtName} ({activeSlot.totalHours} jam)</span>
                    <span className="text-white font-medium">
                      Rp {activeSlot.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                    <span>Total Tagihan</span>
                    <span className="text-base text-[#f2d953]">
                      Rp {activeSlot.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* 3. Metode Pembayaran: Dropdown Standar Ringkas */}
                <div className="relative mb-3.5">
                  <label className="text-xs text-[#8e8e8e] block mb-1.5 font-medium">
                    Metode Pembayaran
                  </label>

                  {/* Dropdown Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-11 px-3.5 rounded-[10px] bg-[#222222] border border-[#333333] hover:border-[#555555] flex items-center justify-between transition-colors text-left cursor-pointer focus:outline-none focus:border-[#f2d953]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${paymentType === 'dp' ? 'bg-[#f2d953]' : 'bg-emerald-400'}`} />
                      <span className="text-xs font-semibold text-white">
                        {paymentType === 'dp' ? 'Bayar DP 50%' : 'Bayar Lunas 100%'}
                      </span>
                      <span className="text-xs text-[#8e8e8e]">
                        • Rp {(paymentType === 'dp' ? dpAmount : activeSlot.totalPrice).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`text-[#8e8e8e] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown Popover Menu */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-30 p-1.5 rounded-[10px] bg-[#1e1e1e] border border-[#333333] shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-100">
                      {/* Opsi 1: DP 50% */}
                      <div
                        onClick={() => {
                          setPaymentType('dp')
                          setIsDropdownOpen(false)
                        }}
                        className={`px-3 py-2.5 rounded-[8px] transition-colors cursor-pointer flex items-center justify-between ${
                          paymentType === 'dp'
                            ? 'bg-[#f2d953]/15 text-white'
                            : 'hover:bg-white/5 text-[#d4d4d4]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            paymentType === 'dp' ? 'border-[#f2d953] bg-[#f2d953]' : 'border-white/20'
                          }`}>
                            {paymentType === 'dp' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white block">Bayar DP 50%</span>
                            <span className="text-[11px] text-[#8e8e8e] block">
                              Sisa Rp {dpAmount.toLocaleString('id-ID')} di arena
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#f2d953]">
                          Rp {dpAmount.toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Opsi 2: Lunas 100% */}
                      <div
                        onClick={() => {
                          setPaymentType('lunas')
                          setIsDropdownOpen(false)
                        }}
                        className={`px-3 py-2.5 rounded-[8px] transition-colors cursor-pointer flex items-center justify-between ${
                          paymentType === 'lunas'
                            ? 'bg-emerald-500/15 text-white'
                            : 'hover:bg-white/5 text-[#d4d4d4]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            paymentType === 'lunas' ? 'border-emerald-400 bg-emerald-400' : 'border-white/20'
                          }`}>
                            {paymentType === 'lunas' && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white block">Bayar Lunas 100%</span>
                            <span className="text-[11px] text-[#8e8e8e] block">
                              Langsung masuk lapangan
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">
                          Rp {activeSlot.totalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Data Pemesan Lengkap */}
                <div className="p-3.5 rounded-[12px] bg-[#222222] border border-[#2e2e2e] mb-3.5 space-y-2.5">
                  <div className="pb-2 border-b border-white/5">
                    <span className="text-xs font-semibold text-[#8e8e8e]">Informasi Pemesan</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8e8e8e]">Nama Lengkap</span>
                      <span className="font-semibold text-white">{finalCustomerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8e8e8e]">No. WhatsApp</span>
                      <span className="font-medium text-white">{finalWhatsapp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8e8e8e]">Alamat Email</span>
                      <span className="font-medium text-[#d4d4d4]">{finalEmail}</span>
                    </div>
                  </div>
                </div>

                {/* 5. Catatan Opsional */}
                <div className="mb-2">
                  <label htmlFor="user_booking_notes" className="text-xs text-[#8e8e8e] block mb-1.5 font-medium">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    id="user_booking_notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Siapkan raket sewa / shuttlecock tambahan..."
                    className="w-full h-24 p-3 rounded-[10px] bg-[#222222] border border-[#333333] text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#f2d953] transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 6. Sticky Footer: Detail Jumlah Bayar Sekarang & Tombol CTA */}
              <div className="pt-3 border-t border-[#262626]">
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-xs text-[#8e8e8e]">
                    {paymentType === 'dp' ? 'Wajib Bayar Sekarang (DP 50%)' : 'Wajib Bayar Sekarang (Lunas)'}:
                  </span>
                  <span className="text-sm font-bold text-[#f2d953]">
                    Rp {(paymentType === 'dp' ? dpAmount : activeSlot.totalPrice).toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full h-12 rounded-[10px] bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-sm font-bold transition-all cursor-pointer shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
