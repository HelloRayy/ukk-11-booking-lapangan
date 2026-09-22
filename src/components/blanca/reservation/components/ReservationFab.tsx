// PERAN FILE: Pure UI FAB Pemicu Side Panel (Pill Bawah & Circular FAB Kanan Bawah Persis Mockup)
interface ReservationFabProps {
  onOpen: () => void
}

export default function ReservationFab({ onOpen }: ReservationFabProps) {
  return (
    <>
      {/* 1. Bottom-Centered Pill Button */}
      <div className="fixed z-30 left-0 bottom-0 w-full flex flex-row items-center justify-center pointer-events-none font-aeonik">
        {/* Background Gradient Bawah */}
        <div className="absolute left-0 bottom-0 w-full h-[88px] md:h-[180px] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* Tombol Pill Tengah */}
        <div
          onClick={onOpen}
          className="pt-[4px] pb-[6px] pl-5 pr-[111.008px] bg-[#d9d9d9]/[0.12] hover:bg-[#d9d9d9]/[0.22] rounded-t-[8px] relative group backdrop-blur-md h-[60px] leading-normal transition-all duration-200 cursor-pointer pointer-events-auto select-none border-t border-x border-white/10"
          role="button"
          tabIndex={0}
          aria-label="Buka form data calon penyewa"
        >
          {/* Gambar Raket / Aksesoris */}
          <div className="absolute -top-[15px] right-[10px] bottom-0 w-[89px] h-auto pointer-events-none group-hover:scale-[1.075] transition-transform duration-300 origin-bottom">
            <img
              className="h-[67.0964px] w-[88.9974px] object-contain object-bottom leading-normal transition-all"
              alt="Reserve your court"
              src="/assets/blanca/quiz-button.png"
              width="191"
              height="144"
            />
          </div>

          {/* Label Teks */}
          <div className="flex flex-col items-start h-auto my-[2px] gap-[4px] w-auto leading-tight transition-all">
            <span className="text-left text-[20px] text-[#fcfcfc] font-normal leading-tight transition-all duration-150 whitespace-nowrap">
              Reserve your court
            </span>
            <span className="text-[#bfbfbf] text-sm font-light leading-tight transition-all whitespace-nowrap">
              check available slots
            </span>
          </div>
        </div>
      </div>

      {/* 2. Bottom-Right Circular Floating Action Button (Persis di Screenshot) */}
      <button
        type="button"
        onClick={onOpen}
        className="fixed z-40 right-4 sm:right-6 bottom-4 sm:bottom-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1c1c1c] hover:bg-[#252525] text-white shadow-2xl flex items-center justify-center border border-white/15 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label="Open recommendation side panel"
      >
        {/* Indikator Titik Biru di Kanan Atas FAB */}
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#0091ff] ring-2 ring-[#1c1c1c]" />

        {/* Ikon Kuis / Raket Minimalist */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:rotate-12 text-[#fcfcfc]"
        >
          <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
          <path d="M11 3 8 9l4 12 4-12-3-6" />
          <path d="M2 9h20" />
        </svg>
      </button>
    </>
  )
}
