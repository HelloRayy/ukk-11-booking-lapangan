// PERAN FILE: Pure UI Side Panel Drawer dari Kanan dengan Motion Halus & Staggered Reveal
import { useState, useEffect } from 'react'
import type { CustomerInfo } from '../types'
import { Checkbox } from '../../../ui/checkbox'

interface ReservationSidePanelProps {
  isOpen: boolean
  onClose: () => void
  customerInfo: CustomerInfo
  onUpdateField: <K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) => void
  isFormValid: boolean
  isSubmitted: boolean
  onSubmit: (e: React.FormEvent) => void
  onReset: () => void
}

export default function ReservationSidePanel({
  isOpen,
  onClose,
  customerInfo,
  onUpdateField,
  isFormValid,
  isSubmitted,
  onSubmit,
  onReset,
}: ReservationSidePanelProps) {
  const [isRendered, setIsRendered] = useState(isOpen)
  const [isActive, setIsActive] = useState(false)

  // Sinkronisasi motion buka & tutup dengan transisi CSS halus
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (isOpen) {
      setIsRendered(true)
      // Jalankan state aktif setelah frame browser siap
      const rafId = requestAnimationFrame(() => {
        setIsActive(true)
      })
      document.body.style.overflow = 'hidden'
      return () => cancelAnimationFrame(rafId)
    } else {
      setIsActive(false)
      document.body.style.overflow = ''
      // Tunggu durasi animasi selesai (450ms) sebelum melepaskan dari DOM
      timeoutId = setTimeout(() => {
        setIsRendered(false)
      }, 450)
    }
    return () => {
      clearTimeout(timeoutId)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const [isWaTouched, setIsWaTouched] = useState(false)

  // Validasi real-time input WhatsApp
  const getWaValidation = (wa: string, touched: boolean) => {
    if (!touched && wa.length === 0) return { error: '', isValid: false }
    if (wa.length === 0) return { error: 'Nomor WhatsApp wajib diisi.', isValid: false }
    if (wa.length === 1 && wa !== '0') return { error: 'Nomor WhatsApp wajib diawali "08" (contoh: 08123456789).', isValid: false }
    if (wa.length >= 2 && !wa.startsWith('08')) return { error: 'Nomor WhatsApp wajib diawali "08". Ketik 08... bukan 62 atau +62.', isValid: false }
    if (wa.length < 10) return { error: `Nomor masih kurang ${10 - wa.length} digit (minimal 10 digit).`, isValid: false }
    if (wa.length > 13) return { error: 'Nomor maksimal 13 digit.', isValid: false }
    return { error: '', isValid: true }
  }

  const waValidation = getWaValidation(customerInfo.whatsapp, isWaTouched)

  const handleWaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsWaTouched(true)
    let cleaned = e.target.value.replace(/\D/g, '')
    // Auto-convert jika pengguna paste format internasional (+628 / 628)
    if (cleaned.startsWith('628')) {
      cleaned = '0' + cleaned.slice(2)
    }
    // Batasi maksimal 13 digit sesuai standar nomor seluler Indonesia
    cleaned = cleaned.slice(0, 13)
    onUpdateField('whatsapp', cleaned)
  }

  const handleReset = () => {
    setIsWaTouched(false)
    onReset()
  }

  // Dukungan aksesibilitas tombol keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isRendered) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden font-aeonik select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="side-panel-title"
    >
      {/* Backdrop Gelap dengan Transisi Fade & Soft Blur (Cubic Deceleration) */}
      <div
        className={`fixed inset-0 bg-black/60 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'opacity-100 backdrop-blur-[8px]' : 'opacity-0 backdrop-blur-none pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Kontainer Drawer Samping Kanan (Smooth Slide-in & Slide-out Transition) */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-[540px] mdw:max-w-[580px] bg-[#161616] text-[#f5f5f5] border-l border-white/10 rounded-none sm:rounded-l-[24px] flex flex-col z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isActive
            ? 'translate-x-0 shadow-[-24px_0_60px_rgba(0,0,0,0.7)]'
            : 'translate-x-full shadow-none pointer-events-none'
        }`}
      >
        {/* Top Bar Navigasi (Back Button, Dashes Indicator, Close Button) */}
        <div
          className={`p-6 md:px-10 md:pt-8 md:pb-6 flex items-center justify-between shrink-0 transition-all duration-500 ease-out ${
            isActive ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 -translate-y-2'
          }`}
        >
          {/* Tombol Back di Kiri */}
          <button
            type="button"
            onClick={isSubmitted ? handleReset : onClose}
            className="w-10 h-10 rounded-[8px] border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 flex items-center justify-center text-[#f5f5f5] transition-colors cursor-pointer"
            aria-label="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Body Area Formulir (Spacious & Clean Typography) */}
        <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto px-6 md:px-10 pb-8 flex flex-col justify-between">
          {!isSubmitted ? (
            <form onSubmit={onSubmit} className="flex flex-col justify-between h-full min-h-[460px]">
              <div>
                {/* Subtitle / Step Indicator & Big Headline (Staggered Entrance) */}
                <div
                  className={`transition-all duration-500 ease-out ${
                    isActive ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-3'
                  }`}
                >
                  <span className="text-[13px] text-[#8e8e8e] font-light block mb-2">
                    Question 1 • Personal details
                  </span>

                  <h2
                    id="side-panel-title"
                    className="text-[34px] sm:text-[40px] font-normal leading-[1.08] tracking-[-1px] text-[#f5f5f5] mb-8"
                  >
                    What’s your contact info?
                  </h2>
                </div>

                {/* 3 Parameter Input Utama (Staggered Entrance) */}
                <div
                  className={`flex flex-col gap-6 transition-all duration-500 ease-out ${
                    isActive ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {/* 1. Nama Lengkap */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="nama_penyewa" className="text-sm font-normal text-[#d4d4d4]">
                      Full name
                    </label>
                    <input
                      id="nama_penyewa"
                      type="text"
                      value={customerInfo.nama}
                      onChange={(e) => onUpdateField('nama', e.target.value)}
                      placeholder="e.g. Budi Santoso"
                      className="w-full h-[64px] px-5 rounded-[12px] bg-[#222222] border border-white/15 text-[17px] text-[#f5f5f5] placeholder:text-[#666666] font-light focus:outline-none focus:border-[#f2d953] transition-colors"
                      required
                    />
                  </div>

                  {/* 2. Nomor WhatsApp / HP dengan Validasi Strict 08 & Error State */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="whatsapp_penyewa" className="text-sm font-normal text-[#d4d4d4]">
                      WhatsApp number
                    </label>

                    <div className="relative">
                      <input
                        id="whatsapp_penyewa"
                        type="tel"
                        inputMode="numeric"
                        value={customerInfo.whatsapp}
                        onChange={handleWaChange}
                        onBlur={() => setIsWaTouched(true)}
                        placeholder="e.g. 08123456789"
                        className={`w-full h-[64px] px-5 ${
                          waValidation.error ? 'pr-12' : ''
                        } rounded-[12px] bg-[#222222] text-[17px] text-[#f5f5f5] placeholder:text-[#666666] font-light transition-all focus:outline-none ${
                          waValidation.error
                            ? 'border-2 border-rose-500/80 bg-rose-500/5 focus:border-rose-500 text-rose-100'
                            : 'border border-white/15 focus:border-[#f2d953]'
                        }`}
                        required
                      />

                      {waValidation.error && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center pointer-events-none">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </span>
                      )}
                    </div>

                    {/* Feedback Pesan Error */}
                    {waValidation.error && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-0.5 animate-in fade-in duration-150">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{waValidation.error}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Alamat Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email_penyewa" className="text-sm font-normal text-[#d4d4d4]">
                      Email
                    </label>
                    <input
                      id="email_penyewa"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => onUpdateField('email', e.target.value)}
                      placeholder="e.g. budi@gmail.com"
                      className="w-full h-[64px] px-5 rounded-[12px] bg-[#222222] border border-white/15 text-[17px] text-[#f5f5f5] placeholder:text-[#666666] font-light focus:outline-none focus:border-[#f2d953] transition-colors"
                      required
                    />
                  </div>

                  {/* Checkbox Konfirmasi Kebenaran Data (shadcn UI Checkbox) */}
                  <div className="flex items-center gap-3 pt-2 select-none group">
                    <Checkbox
                      id="confirm_checkbox"
                      checked={customerInfo.isConfirmed}
                      onCheckedChange={(checked) => onUpdateField('isConfirmed', checked === true)}
                      className="border-white/30 data-[state=checked]:bg-[#f2d953] data-[state=checked]:border-[#f2d953] data-[state=checked]:text-[#161616] focus-visible:ring-[#f2d953]"
                    />
                    <label
                      htmlFor="confirm_checkbox"
                      className="text-sm text-[#a3a3a3] group-hover:text-[#f5f5f5] transition-colors leading-tight cursor-pointer"
                    >
                      Saya menyatakan data yang diisi sudah benar dan bersedia dihubungi arena.
                    </label>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button dengan Motion Unlock Khas Blanca (WCAG Compliant) */}
              <div
                className={`pt-8 pb-2 mt-auto transition-all duration-500 ease-out [transform:translateZ(0)] ${
                  isActive ? 'opacity-100 translate-y-0 delay-250' : 'opacity-0 translate-y-4'
                }`}
              >
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`group relative w-full h-[64px] rounded-[12px] flex items-center justify-center overflow-hidden transition-all duration-300 select-none antialiased [font-synthesis:none] [transform:translateZ(0)] [backface-visibility:hidden] ${
                    isFormValid
                      ? 'bg-[#f2d953] hover:bg-[#e4cb34] active:bg-[#d6bc28] text-[#161616] cursor-pointer shadow-[0_6px_24px_rgba(242,217,83,0.3)] hover:shadow-[0_8px_28px_rgba(228,203,52,0.4)] border border-[#f2d953]/30 active:scale-[0.98]'
                      : 'bg-[#222222] border border-white/10 text-[#666666] cursor-not-allowed'
                  }`}
                  aria-label={isFormValid ? 'Submit form data' : 'Form belum lengkap'}
                >
                  {/* Kotak Ikon yang Meluncur dari Kiri ke Kanan Saat Ter-unlock */}
                  <span
                    className={`absolute top-2 w-[48px] h-[48px] rounded-[8px] flex items-center justify-center shadow-sm transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isFormValid
                        ? 'left-[calc(100%-56px)] scale-100 bg-[#161616] text-[#f2d953] border border-black/20 shadow-md'
                        : 'left-2 scale-95 opacity-60 bg-[#2c2c2c] text-[#737373] border border-white/5'
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-500 ease-out ${
                        isFormValid ? 'rotate-45 scale-110' : 'rotate-0 scale-100'
                      }`}
                    >
                      <path
                        d="M3.5 11.5L11.5 3.5M11.5 3.5H5.5M11.5 3.5V9.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  {/* Teks Label yang Bergeser Halus Tanpa Glitch Perubahan Font-Weight */}
                  <span
                    className={`text-[16px] tracking-tight font-normal antialiased [font-synthesis:none] transition-[padding,color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isFormValid
                        ? 'pr-[56px] pl-4 text-[#161616]'
                        : 'pl-[56px] pr-4 text-[#666666]'
                    }`}
                  >
                    See our recommendations
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Tampilan Review / Konfirmasi Setelah Data Diisi */
            <div className="flex flex-col justify-between h-full min-h-[460px] py-6">
              <div>
                <span className="text-[13px] text-emerald-400 font-medium block mb-2">
                  Completed • Ready for next step
                </span>
                <h3 className="text-[34px] font-normal tracking-[-1px] text-[#f5f5f5] mb-6">
                  Customer verified
                </h3>

                <div className="p-6 rounded-[14px] bg-[#222222] border border-white/10 flex flex-col gap-4">
                  <div>
                    <span className="text-xs text-[#8e8e8e] block font-light">NAMA PEMESAN</span>
                    <span className="text-base text-[#f5f5f5] font-medium">{customerInfo.nama}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8e8e8e] block font-light">WHATSAPP</span>
                    <span className="text-base text-[#f5f5f5] font-medium">{customerInfo.whatsapp}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8e8e8e] block font-light">EMAIL</span>
                    <span className="text-base text-[#f5f5f5] font-medium">{customerInfo.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full h-[56px] rounded-[10px] border border-white/20 hover:border-white text-sm font-medium text-[#f5f5f5] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Edit information
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
