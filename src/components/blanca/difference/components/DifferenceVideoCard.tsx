// PERAN FILE: Pure UI Showcase Video Gameplay & Mini Card Coronado
import { useEffect, useRef } from 'react'

export default function DifferenceVideoCard() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Otomatis putar video hanya saat terlihat di layar, pause saat keluar viewport
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full h-auto aspect-[904/678] rounded-[8px] overflow-hidden mb-[40px] relative group/mini-product">
      <video
        ref={videoRef}
        playsInline
        muted
        loop
        className="w-full h-full object-cover object-center"
        poster="/assets/blanca/difference-poster.webp"
        preload="none"
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
          All-round control badminton racquet
        </span>

        {/* Racquet Image Overlay */}
        <div className="absolute -top-[10px] mdw:-top-[16px] bottom-0 right-0 w-[58px] mdw:w-[96px] px-[9px] mdw:px-[14px] overflow-hidden pointer-events-none">
          <img
            src="/assets/blanca/coronado-front.webp"
            alt="Coronado Badminton Racquet"
            loading="lazy"
            decoding="async"
            className="w-auto h-full scale-[150%] mdw:group-hover/mini-product:scale-[160%] translate-y-[10%] origin-center object-contain object-center transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  )
}
