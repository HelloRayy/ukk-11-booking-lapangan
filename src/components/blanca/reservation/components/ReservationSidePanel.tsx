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
    let timeoutId: NodeJS.Timeout
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
        className={`fixed inset-y-0 right-0 w-full max-w-[540px] mdw:max-w-[580px] bg-white text-[#161616] rounded-none sm:rounded-l-[24px] flex flex-col z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isActive
            ? 'translate-x-0 shadow-[-24px_0_60px_rgba(0,0,0,0.35)]'
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
            onClick={isSubmitted ? onReset : onClose}
            className="w-10 h-10 rounded-[8px] border border-[#e5e5e5] hover:border-black flex items-center justify-center text-[#161616] transition-colors cursor-pointer"
            aria-label="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Indikator Dashes Tengah (Khas Typeform Mockup Blanca) */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-5 h-[2.5px] rounded-full bg-[#161616]" />
            <span className="w-5 h-[2.5px] rounded-full bg-[#e5e5e5]" />
            <span className="w-5 h-[2.5px] rounded-full bg-[#e5e5e5]" />
            <span className="w-5 h-[2.5px] rounded-full bg-[#e5e5e5]" />
          </div>

          {/* Tombol Close X di Kanan */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-[8px] border border-[#e5e5e5] hover:border-black flex items-center justify-center text-[#161616] transition-colors cursor-pointer"
            aria-label="Tutup panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Body Area Formulir (Spacious & Clean Typography) */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-8 flex flex-col justify-between">
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
                    className="text-[34px] sm:text-[40px] font-normal leading-[1.08] tracking-[-1px] text-[#161616] mb-8"
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
                    <label htmlFor="nama_penyewa" className="text-sm font-normal text-[#161616]">
                      Full name
                    </label>
                    <input
                      id="nama_penyewa"
                      type="text"
                      value={customerInfo.nama}
                      onChange={(e) => onUpdateField('nama', e.target.value)}
                      placeholder="e.g. Budi Santoso"
                      className="w-full h-[64px] px-5 rounded-[12px] border border-[#d1d1d1] text-[17px] text-[#161616] placeholder:text-[#a3a3a3] font-light focus:outline-none focus:border-[#161616] transition-colors"
                      required
                    />
                  </div>

                  {/* 2. Nomor WhatsApp / HP */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="whatsapp_penyewa" className="text-sm font-normal text-[#161616]">
                      WhatsApp number
                    </label>
                    <input
                      id="whatsapp_penyewa"
                      type="tel"
                      value={customerInfo.whatsapp}
                      onChange={(e) => onUpdateField('whatsapp', e.target.value)}
                      placeholder="e.g. 08123456789"
                      className="w-full h-[64px] px-5 rounded-[12px] border border-[#d1d1d1] text-[17px] text-[#161616] placeholder:text-[#a3a3a3] font-light focus:outline-none focus:border-[#161616] transition-colors"
                      required
                    />
                  </div>

                  {/* 3. Alamat Email */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email_penyewa" className="text-sm font-normal text-[#161616]">
                      Email
                    </label>
                    <input
                      id="email_penyewa"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => onUpdateField('email', e.target.value)}
                      placeholder="e.g. budi@gmail.com"
                      className="w-full h-[64px] px-5 rounded-[12px] border border-[#d1d1d1] text-[17px] text-[#161616] placeholder:text-[#a3a3a3] font-light focus:outline-none focus:border-[#161616] transition-colors"
                      required
                    />
                  </div>

                  {/* Checkbox Konfirmasi Kebenaran Data (shadcn UI Checkbox) */}
                  <div className="flex items-center gap-3 pt-2 select-none group">
                    <Checkbox
                      id="confirm_checkbox"
                      checked={customerInfo.isConfirmed}
                      onCheckedChange={(checked) => onUpdateField('isConfirmed', checked === true)}
                    />
                    <label
                      htmlFor="confirm_checkbox"
                      className="text-sm text-[#4a4a4a] group-hover:text-[#161616] transition-colors leading-tight cursor-pointer"
                    >
                      Saya menyatakan data yang diisi sudah benar dan bersedia dihubungi arena.
                    </label>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button dengan Motion Unlock Khas Blanca (WCAG Compliant) */}
              <div
                className={`pt-8 pb-2 mt-auto transition-all duration-500 ease-out ${
                  isActive ? 'opacity-100 translate-y-0 delay-250' : 'opacity-0 translate-y-4'
                }`}
              >
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`group relative w-full h-[64px] rounded-[12px] flex items-center justify-center overflow-hidden transition-all duration-300 select-none ${
                    isFormValid
                      ? 'bg-[#f2d953] hover:bg-[#e4cb34] active:bg-[#d6bc28] text-[#161616] cursor-pointer shadow-[0_6px_24px_rgba(242,217,83,0.35)] hover:shadow-[0_8px_28px_rgba(228,203,52,0.45)] border border-black/10 active:scale-[0.98]'
                      : 'bg-[#f0f0f0] border border-[#e5e5e5] text-[#737373] cursor-not-allowed'
                  }`}
                  aria-label={isFormValid ? 'Submit form data' : 'Form belum lengkap'}
                >
                  {/* Kotak Ikon yang Meluncur dari Kiri ke Kanan Saat Ter-unlock */}
                  <span
                    className={`absolute top-2 w-[48px] h-[48px] rounded-[8px] bg-white border border-black/10 flex items-center justify-center text-[#161616] shadow-sm transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isFormValid
                        ? 'left-[calc(100%-56px)] scale-100 shadow-md'
                        : 'left-2 scale-95 opacity-80'
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

                  {/* Teks Label yang Bergeser Halus Menyesuaikan Posisi Ikon */}
                  <span
                    className={`text-[16px] tracking-tight transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isFormValid
                        ? 'pr-[56px] pl-4 font-medium text-[#161616]'
                        : 'pl-[56px] pr-4 font-normal text-[#737373]'
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
                <span className="text-[13px] text-emerald-600 font-medium block mb-2">
                  Completed • Ready for next step
                </span>
                <h3 className="text-[34px] font-normal tracking-[-1px] text-[#161616] mb-6">
                  Customer verified
                </h3>

                <div className="p-6 rounded-[14px] bg-[#f8f8f8] border border-[#e5e5e5] flex flex-col gap-4">
                  <div>
                    <span className="text-xs text-[#8e8e8e] block font-light">NAMA PEMESAN</span>
                    <span className="text-base text-[#161616] font-medium">{customerInfo.nama}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8e8e8e] block font-light">WHATSAPP</span>
                    <span className="text-base text-[#161616] font-medium font-mono">{customerInfo.whatsapp}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8e8e8e] block font-light">EMAIL</span>
                    <span className="text-base text-[#161616] font-medium">{customerInfo.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="w-full h-[56px] rounded-[10px] border border-[#d1d1d1] hover:border-black text-sm font-medium text-[#161616] transition-colors cursor-pointer"
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
