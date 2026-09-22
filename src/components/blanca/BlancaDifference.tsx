// PERAN FILE: Komponen Section 1:1 'The Blanca difference' Blanca Padel
import { useRef } from 'react'

export default function BlancaDifference() {
  const columnRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="shopify-section-template--17894129991737__common_large_card_6W9JdB"
      className="relative w-full bg-[#161616] text-[#fcfcfc] overflow-hidden"
    >
      {/* Background Glow Circle */}
      <div className="absolute inset-0 size-full overflow-hidden pointer-events-none">
        <div className="background-circle top-[92px] mdw:top-[-23px] right-[-300px] mdw:right-[-340px] w-[491px] mdw:w-[841px] h-[497px] mdw:h-[1278px] mdw:rotate-[-20.43deg]" />
      </div>

      <div className="container mdw:site-grid items-start">
        {/* Spacer Pembatas Atas */}
        <div className="col-span-12 fancy-spacer mb-[64px] mdw:mb-[128px]" />

        {/* Section Heading & Preheading */}
        <div className="col-start-5 col-span-6 flex flex-col items-start gap-y-[24px] mdw:gap-y-[32px] mb-[32px] mdw:mb-[80px]">
          <span className="block preheading">The Blanca difference</span>
          <h2 className="h2-mobile mdw:h2">
            Game. Set. Unmatched. Meet Blanca Padel.
          </h2>
        </div>

        {/* Left Column (Sticky di Desktop) */}
        <div className="max-mdw:hidden col-start-1 col-span-4 mdw:sticky top-[80px] pb-[285px]">
          <div className="w-full h-auto aspect-[448/337] rounded-[8px] overflow-hidden mb-[40px] relative">
            <img
              src="/assets/blanca/difference-people.png"
              alt="Blanca Padel Community"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
          <div className="body text-[#bfbfbf] w-full max-w-[334px]" ref={textRef}>
            Blanca Arena was founded by a passionate community of players who wanted premium,
            tournament-grade courts with seamless booking and an inclusive atmosphere for everyone
            from beginners to competitive athletes.
          </div>
        </div>

        {/* Right Column: Big Video + Product Overlay + Feature Cards */}
        <div className="col-start-5 col-span-8 flex flex-col items-stretch" ref={columnRef}>
          {/* Big Video Container */}
          <div
            ref={videoRef}
            className="w-full h-auto aspect-[904/678] rounded-[8px] overflow-hidden mb-[40px] relative group/mini-product"
          >
            <video
              playsInline
              autoPlay
              muted
              loop
              className="w-full h-full object-cover object-center"
              poster="/assets/blanca/difference-poster.jpg"
              preload="metadata"
            >
              <source src="/assets/blanca/difference-video.webm" type="video/webm" />
              <source src="/assets/blanca/difference-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />

            {/* Mini Product Card (Coronado Racquet) di kanan bawah video */}
            <div
              className="absolute bottom-[16px] mdw:bottom-[32px] right-[16px] mdw:right-[32px] min-h-[49px] mdw:min-h-[66px] leading-[1] flex flex-col items-start justify-center gap-y-[6px] p-[8px_58px_8px_14px] mdw:p-[16px_96px_16px_16px] bg-[#313131]/[0.8] mdw:hover:bg-[#444]/[0.8] backdrop-blur-[7px] rounded-[4px] text-white transition-colors duration-300 cursor-pointer"
              data-product-card-tracked="true"
            >
              <a href="/products/coronado" className="flex flex-row items-center gap-x-[6px]">
                <span className="text-sm mdw:text-base font-normal">Coronado</span>
                <span className="flex items-center justify-center w-[14px] h-[14px] rounded-[4px] bg-[#f2d953] text-black">
                  <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.25 7.5 4.75 4 1.25.5" stroke="currentColor" />
                  </svg>
                </span>
              </a>
              <span className="font-light text-[12px] mdw:caption text-[#bfbfbf] !leading-[1]">
                Control round shape racquet
              </span>

              {/* Racquet Image Overlay */}
              <div className="absolute -top-[10px] mdw:-top-[16px] bottom-0 right-0 w-[58px] mdw:w-[96px] px-[9px] mdw:px-[14px] overflow-hidden pointer-events-none">
                <img
                  src="/assets/blanca/coronado-front.png"
                  alt="Coronado Racquet"
                  className="w-auto h-full scale-[150%] mdw:group-hover/mini-product:scale-[160%] translate-y-[10%] origin-center object-contain object-center transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Subheading teks di bawah video */}
          <h3 className="body mdw:h3 text-[#bfbfbf] mdw:text-white w-full max-w-[676px] max-mdw:mb-[40px]">
            Minimal design, top performance for all levels, and options to test drive before buying.
          </h3>

          {/* Fancy Spacer Garis Pemisah */}
          <div className="max-mdw:hidden fancy-spacer my-[40px]" />

          {/* 3 Fitur Unggulan Lapangan (Tournament Grade, All Levels, Full Amenities) */}
          <div className="flex flex-col md:flex-row items-stretch">
            {/* 1. Tournament Grade */}
            <div className="flex-1 flex flex-col items-start gap-y-[24px] md:gap-y-[32px] max-mdw:mb-[32px]">
              <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] md:mt-[8px] shrink-0">
                <img
                  src="/assets/blanca/icon-minimal.svg"
                  alt="Tournament Grade"
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <p className="big-body font-medium text-[#fcfcfc]">Tournament Grade</p>
                <div className="flex-1 flex flex-row items-stretch gap-x-[24px]">
                  <div className="body text-[#bfbfbf] mdw:pr-[64px]">
                    Certified shock-absorption court turf with 500+ lux anti-glare LED lighting
                    built for tournament-level gameplay.
                  </div>
                </div>
              </div>
            </div>

            {/* 2. All Levels */}
            <div className="flex-1 flex flex-col items-start gap-y-[24px] md:gap-y-[32px] max-mdw:mb-[32px]">
              <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] md:mt-[8px] shrink-0">
                <img
                  src="/assets/blanca/icon-all-levels.svg"
                  alt="All Levels"
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <p className="big-body font-medium text-[#fcfcfc]">All Levels</p>
                <div className="flex-1 flex flex-row items-stretch gap-x-[24px]">
                  <div className="body text-[#bfbfbf] mdw:pr-[64px]">
                    Designed for all playstyles, whether you’re booking a casual friendly match
                    or training for competitive leagues.
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Full Amenities */}
            <div className="flex-1 flex flex-col items-start gap-y-[24px] md:gap-y-[32px]">
              <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] md:mt-[8px] shrink-0">
                <img
                  src="/assets/blanca/icon-quality.svg"
                  alt="Full Amenities"
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <p className="big-body font-medium text-[#fcfcfc]">Full Amenities</p>
                <div className="flex-1 flex flex-row items-stretch gap-x-[24px]">
                  <div className="body text-[#bfbfbf] mdw:pr-[64px]">
                    Includes secure lockers, clean hot shower facilities, equipment rental,
                    and a players lounge to relax post-match.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
