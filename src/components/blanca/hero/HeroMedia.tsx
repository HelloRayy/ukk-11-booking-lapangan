import heroVideo from '../../../assets/hero-video.webm'

interface HeroMediaProps {
  videoRef: React.RefObject<HTMLDivElement | null>
}

export default function HeroMedia({ videoRef }: HeroMediaProps) {
  return (
    <div
      ref={videoRef}
      className="absolute isolate sm:top-0 top-[33vh] left-1/2 -translate-x-1/2 w-full sm:h-full h-[40vh] opacity-0 scale-110 pointer-events-none before:absolute before:z-[10] before:bottom-0 before:left-0 before:w-full before:h-[100px] before:bg-gradient-to-t before:from-[#161616] before:via-[#161616]/40 before:to-transparent after:absolute after:z-[10] after:top-0 after:left-0 after:w-full after:h-[100px] after:bg-gradient-to-b after:from-[#161616] after:via-[#161616]/40 after:to-transparent"
    >
      {/* Spotlight Ambient (Sorot Tengah Statis) */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.04) 50%, transparent 80%)',
        }}
      />


      {/* Hero Video (Seamless Loop 24fps) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="relative z-[1] w-full h-full object-contain sm:object-cover mix-blend-screen opacity-90 select-none pointer-events-none"
      >
        <source src={heroVideo} type="video/webm" />
      </video>
    </div>
  )
}
