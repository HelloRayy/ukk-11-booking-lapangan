// PERAN FILE: Pure UI Header untuk Section Lokasi & Kontak Blanca
export default function BlancaLocationHeader() {
  return (
    <>
      {/* Header Sisi Kiri: Judul Utama */}
      <div className="col-span-12 mdw:col-span-8">
        <span className="block preheading mb-[16px] md:mb-[24px]">Location & Contact</span>
        <h2 className="w-full max-w-[818px] text-[44px] sm:text-[56px] mdw:text-[76px] lg:text-[88px] font-normal leading-[1.02] tracking-[-1px] text-[#fcfcfc]">
          Blanca is much closer than you think
        </h2>
      </div>

      {/* Header Sisi Kanan: Paragraf Penjelas */}
      <div className="col-span-12 mdw:col-span-4 mdw:col-start-9 flex flex-col justify-end">
        <p className="text-[18px] mdw:text-[24px] text-[#bfbfbf] font-light leading-snug">
          Kunjungi arena kami langsung atau hubungi kontak person resmi untuk reservasi jadwal,
          sparing komunitas, dan kerja sama acara.
        </p>
      </div>
    </>
  )
}
