interface HeroTitleProps {
  titleRef: React.RefObject<HTMLHeadingElement | null>
  wordsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>
  outroRef: React.RefObject<HTMLDivElement | null>
}

export default function HeroTitle({ titleRef, wordsRef, outroRef }: HeroTitleProps) {
  return (
    <div className="container h-full flex flex-col gap-[64px] z-10">
      {/* Spacer Atas */}
      <div className="grow basis-0 sm:block hidden" />

      {/* Title Hero dengan Split-Words Mask Reveal */}
      <div className="relative overflow-visible">
        <h1
          ref={titleRef}
          className="h1 w-full max-w-[1052px] mx-auto text-center opacity-0 !leading-[0.95]"
        >
          <div className="inline-block">
            <div className="overflow-hidden inline-block align-top">
              <span
                ref={(el) => {
                  wordsRef.current[0] = el
                }}
                className="word inline-block"
                data-word="Minimal."
              >
                Minimal.
              </span>
            </div>
          </div>
          <span className="hidden lg:inline-block w-4 sm:w-6">&nbsp;</span>
          <br className="lg:hidden" />
          <div className="inline-block">
            <div className="overflow-hidden inline-block align-top">
              <span
                ref={(el) => {
                  wordsRef.current[1] = el
                }}
                className="word inline-block"
                data-word="Powerful."
              >
                Powerful.
              </span>
            </div>
          </div>
          <br />
          <div className="inline-block">
            <div className="overflow-hidden inline-block align-top">
              <span
                ref={(el) => {
                  wordsRef.current[2] = el
                }}
                className="word inline-block"
                data-word="Intentional."
              >
                Intentional.
              </span>
            </div>
          </div>
        </h1>
      </div>

      {/* Outro Bawah: Deskripsi & CTA Button */}
      <div className="flex items-end grow basis-0 sm:pb-[40px] pb-[20px]">
        <div
          ref={outroRef}
          className="w-full mt-auto flex md:flex-row flex-col items-center justify-between gap-5 text-[#fcfcfc] text-base leading-normal transition-all opacity-0"
        >
          <p className="body text-[#bfbfbf] font-light leading-snug transition-all w-full max-w-[524px] max-md:text-center">
            At Blanca Arena, premium tournament-grade badminton courts meet effortless online booking.
            Designed for players who value speed, quality, and an unmatched playing experience.
          </p>

          <div>
            <a
              className="group icon-button icon-button--dark icon-button--right relative flex items-center justify-center px-6 bg-[#f2d953] text-[#161616] text-base text-center rounded-lg h-[55.9896px] w-[227.93px] leading-normal transition-all duration-150 hover:bg-[#fcfbf6] active:scale-[0.98] w-full md:w-[227.93px] max-md:justify-center cursor-pointer"
              href="#courts"
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
              <span className="icon-button__text pr-12 text-center leading-normal transition-all">
                Book your court
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
