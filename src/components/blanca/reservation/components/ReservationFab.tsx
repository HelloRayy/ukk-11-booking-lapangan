// PERAN FILE: Pure UI Floating Action Button (FAB) Pemicu Side Panel Reservasi
interface ReservationFabProps {
  onOpen: () => void
}

export default function ReservationFab({ onOpen }: ReservationFabProps) {
  return (
    <div className="fixed z-30 left-0 bottom-0 w-full flex flex-row items-center justify-center pointer-events-none font-aeonik">
      {/* Background Gradient Bawah */}
      <div className="absolute left-0 bottom-0 w-full h-[88px] md:h-[180px] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      {/* Tombol FAB Utama */}
      <div
        onClick={onOpen}
        className="pt-[4px] pb-[6px] pl-5 pr-[111.008px] bg-[#d9d9d9]/[0.12] hover:bg-[#d9d9d9]/[0.22] rounded-t-[8px] relative group backdrop-blur-md h-[60px] leading-normal transition-all duration-200 cursor-pointer pointer-events-auto select-none border-t border-x border-white/10"
        role="button"
        tabIndex={0}
        aria-label="Buka form data calon penyewa"
      >
        {/* Gambar Raket / Aksesoris di Sisi Kanan FAB */}
        <div className="absolute -top-[15px] right-[10px] bottom-0 w-[89px] h-auto pointer-events-none group-hover:scale-[1.075] transition-transform duration-300 origin-bottom">
          <img
            className="h-[67.0964px] w-[88.9974px] object-contain object-bottom leading-normal transition-all"
            alt="Reserve your court"
            src="/assets/blanca/quiz-button.png"
            width="191"
            height="144"
          />
        </div>

        {/* Label Teks FAB */}
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
  )
}
