// PERAN FILE: Komponen Footer 1:1 Blanca Padel dengan navigasi, kontak, dan back to top
export default function BlancaFooter() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full pb-[40px] md:pb-[64px] text-[#fcfcfc] text-sm font-light">
      <div className="container">
        <div className="flex flex-col md:grid md:grid-cols-5 gap-y-12 md:gap-y-0 md:gap-x-8 items-start">
          {/* Kolom 1: Explore */}
          <div className="flex flex-col gap-y-4">
            <h4 className="text-base font-medium text-white">Explore</h4>
            <ul className="flex flex-col gap-y-2.5 text-[#bfbfbf]">
              <li>
                <a href="#courts" className="hover:text-white transition-colors">
                  Arena & Courts
                </a>
              </li>
              <li>
                <a href="#shopify-section-template--17894129991737__common_slider_x8NN4j" className="hover:text-white transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#locations" className="hover:text-white transition-colors">
                  Locations & Clubs
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Contact */}
          <div className="flex flex-col gap-y-4">
            <h4 className="text-base font-medium text-white">Contact</h4>
            <ul className="flex flex-col gap-y-2.5 text-[#bfbfbf]">
              <li>
                <a href="mailto:hola@blancapadel.com" className="hover:text-white transition-colors">
                  hola@blancapadel.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +62 812-3456-7890
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram: @blanca.arena
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Legal / UKK RPL */}
          <div className="flex flex-col gap-y-4">
            <h4 className="text-base font-medium text-white">UKK Project</h4>
            <ul className="flex flex-col gap-y-2.5 text-[#bfbfbf]">
              <li>
                <span className="text-[#8e8e8e]">Aplikasi Booking Lapangan</span>
              </li>
              <li>
                <span className="text-[#8e8e8e]">SMK RPL / PPLG 2026</span>
              </li>
              <li>
                <a href="/" className="text-[#f2d953] hover:underline font-normal">
                  Buka Panel Kasir & Pemesan →
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Back to top button */}
          <div className="md:col-start-5 flex md:justify-end items-start w-full">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 text-[#bfbfbf] hover:text-white transition-colors cursor-pointer group"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <span className="w-8 h-8 rounded border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Baris Bawah: Copyright */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8e8e]">
          <p>© {new Date().getFullYear()} Blanca Arena. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="font-mono">React 19 • Vite • Tailwind CSS v4 • Supabase</p>
        </div>
      </div>
    </footer>
  )
}
