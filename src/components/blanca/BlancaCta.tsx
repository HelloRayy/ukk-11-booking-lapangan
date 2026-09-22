// PERAN FILE: Komponen Final Call-to-Action (CTA) Banner penutup sebelum Footer
interface BlancaCtaProps {
  onOpenReservation?: () => void
}

export default function BlancaCta({ onOpenReservation }: BlancaCtaProps) {
  return (
    <section id="cta" className="mt-[64px] mdw:mt-[120px] relative text-[#fcfcfc] overflow-hidden">
      <div className="container">
        {/* Card CTA Utama dengan Glassmorphism Khas Blanca */}
        <div className="relative w-full rounded-[8px] bg-[#D9D9D9]/[0.12] border border-white/[0.08] backdrop-blur-[7px] py-[64px] px-[24px] md:px-[48px] mdw:py-[96px] text-center overflow-hidden">
          {/* Radial Glow di tengah card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white/[0.04] rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 max-w-[720px] mx-auto flex flex-col items-center gap-y-[20px] md:gap-y-[28px]">
            <span className="block preheading">Ready to play?</span>

            <h2 className="h2-mobile mdw:h2">
              Book your court slot in seconds.
            </h2>

            <p className="body text-[#bfbfbf] max-w-[540px] leading-relaxed">
              Experience tournament-grade badminton courts with 500+ lux anti-glare lighting,
              instant online confirmation, and flexible 50% down-payment booking.
            </p>

            {/* Tombol Aksi Utama (CTA) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-[16px] w-full sm:w-auto">
              {/* Tombol Kuning Blanca */}
              <a
                href="#courts"
                onClick={onOpenReservation}
                className="group icon-button icon-button--dark icon-button--right relative flex items-center justify-center px-6 bg-[#f2d953] text-[#161616] text-base text-center rounded-lg h-[56px] w-full sm:w-[220px] leading-normal transition-all duration-150 hover:bg-[#fcfbf6] active:scale-[0.98] cursor-pointer"
              >
                <span
                  className="icon-button__icon absolute right-2 top-2 bottom-2 flex items-center justify-center bg-[#fcfcfc] text-[#161616] group-hover:bg-[#1e1e1e] group-hover:text-[#f4f4f4] text-center rounded w-10 h-10 leading-normal transition-all duration-150"
                  aria-hidden="true"
                >
                  <svg
                    aria-hidden="true"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-200 group-hover:rotate-45 origin-center"
                  >
                    <path d="M1 11 11 1m0 0v10m0-10H1" stroke="currentColor" />
                  </svg>
                </span>
                <span className="icon-button__text pr-12 text-center leading-normal transition-all font-medium">
                  Reserve now
                </span>
              </a>

              {/* Tombol Hubungi Kasir via WhatsApp */}
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20ingin%20tanya%20jadwal%20lapangan%20badminton"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-6 h-[56px] w-full sm:w-[200px] rounded-lg border border-white/20 hover:border-white hover:bg-white/5 text-sm font-medium text-[#fcfcfc] transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>Chat Admin Kasir</span>
              </a>
            </div>
          </div>
        </div>

        {/* Garis Pembatas Bawah */}
        <div className="fancy-spacer mt-[64px] mdw:mt-[120px]" />
      </div>
    </section>
  )
}
