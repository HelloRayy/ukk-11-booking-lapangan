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
      <div className="container mdw:site-grid items-start">
        {/* Spacer Pembatas Atas */}
        <div className="col-span-12 fancy-spacer mb-[64px] mdw:mb-[128px]" />

        {/* Section Heading & Preheading */}
        <div className="col-start-1 lg:col-start-5 col-span-12 lg:col-span-6 flex flex-col items-start gap-y-[24px] mdw:gap-y-[32px] mb-[32px] mdw:mb-[80px]">
          <span className="preheading">The Blanca difference</span>
          <h2 className="text-[40px] mdw:text-[64px] leading-[1.05] tracking-[-0.64px] font-normal text-[#fcfcfc]">
            Game. Set. Unmatched. Meet Blanca Padel.
          </h2>
        </div>

        {/* Left Column (Sticky di Desktop) */}
        <div className="max-mdw:hidden col-start-1 col-span-4 mdw:sticky top-[80px] pb-[285px]">
          <div className="w-full aspect-[448/337] rounded-[8px] overflow-hidden mb-[40px] relative">
            <img
              src="/assets/blanca/difference-people.png"
              alt="Blanca Padel Community"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          </div>
          <p className="body text-[#bfbfbf] w-full max-w-[334px]" ref={textRef}>
            Blanca Padel was born in 2022, in sunny ☀️🌴 San Diego, California. Built for a community
            of crazy padel friends (the best kind) who demanded high-performance padel gear that would
            fit their modern style and didn't break the bank.
          </p>
        </div>

        {/* Right Column: Big Video + Product Overlay + Feature Cards */}
        <div className="col-start-1 lg:col-start-5 col-span-12 lg:col-span-8 flex flex-col items-stretch" ref={columnRef}>
          {/* Big Video Container */}
          <div
            ref={videoRef}
            className="w-full aspect-[904/678] rounded-[8px] overflow-hidden mb-[40px] relative group/mini-product"
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
              <source src="/assets/blanca/difference-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />

            {/* Mini Product Card (Coronado Racquet) di kanan bawah video */}
            <div className="absolute bottom-[16px] mdw:bottom-[32px] right-[16px] mdw:right-[32px] min-h-[49px] mdw:min-h-[66px] flex flex-col items-start justify-center gap-y-[6px] p-[8px_58px_8px_14px] mdw:p-[16px_96px_16px_16px] bg-[#313131]/[0.8] mdw:hover:bg-[#444]/[0.8] backdrop-blur-[7px] rounded-[4px] text-white transition-colors duration-300 cursor-pointer">
              <a href="/products/coronado" className="flex flex-row items-center gap-x-[6px]">
                <span className="text-sm mdw:text-base font-normal">Coronado</span>
                <span className="flex items-center justify-center w-[14px] h-[14px] rounded-[4px] bg-[#f2d953] text-black">
                  <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.25 7.5 4.75 4 1.25.5" stroke="currentColor" />
                  </svg>
                </span>
              </a>
              <span className="font-light text-[12px] mdw:caption text-[#bfbfbf] leading-none">
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
          <h3 className="body mdw:h3 text-[#bfbfbf] mdw:text-white w-full max-w-[676px] mb-[40px]">
            Minimal design, top performance for all levels, and options to test drive before buying.
          </h3>

          {/* Fancy Spacer Garis Pemisah */}
          <div className="max-mdw:hidden fancy-spacer my-[40px]" />

          {/* 3 Fitur Unggulan (Minimal, All Levels, Quality) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-6 pb-[120px]">
            {/* 1. Minimal */}
            <div className="flex flex-col items-start gap-y-[24px] md:gap-y-[32px]">
              <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] md:mt-[8px] shrink-0">
                <img
                  src="/assets/blanca/icon-minimal.svg"
                  alt="Minimal"
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <p className="big-body font-medium text-[#fcfcfc]">Minimal</p>
                <p className="body text-[#bfbfbf] mdw:pr-[64px]">
                  Our racquets feature a sleek, minimal design, perfect for those who prefer performance
                  with subtle branding.
                </p>
              </div>
            </div>

            {/* 2. All Levels */}
            <div className="flex flex-col items-start gap-y-[24px] md:gap-y-[32px]">
              <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] md:mt-[8px] shrink-0">
                <img
                  src="/assets/blanca/icon-all-levels.svg"
                  alt="All Levels"
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <p className="big-body font-medium text-[#fcfcfc]">All Levels</p>
                <p className="body text-[#bfbfbf] mdw:pr-[64px]">
                  All our products are suitable for all levels and playstyles, from beginners to advanced
                  players.
                </p>
              </div>
            </div>

            {/* 3. Quality */}
            <div className="flex flex-col items-start gap-y-[24px] md:gap-y-[32px]">
              <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] md:mt-[8px] shrink-0">
                <img
                  src="/assets/blanca/icon-quality.svg"
                  alt="Quality"
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <p className="big-body font-medium text-[#fcfcfc]">Quality</p>
                <p className="body text-[#bfbfbf] mdw:pr-[64px]">
                  Our suite of racquets feature the same modern quality materials used in professional
                  grade paddles e.g. 3k-&gt;18k carbon, multi-eva foam and a reinforced carbon fiber tube
                  frame.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
