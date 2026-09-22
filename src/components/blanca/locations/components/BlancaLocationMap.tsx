// PERAN FILE: Pure UI Map Container untuk Leaflet Map Blanca
import type { RefObject } from 'react'

interface BlancaLocationMapProps {
  mapContainerRef: RefObject<HTMLDivElement | null>
  onFocusArena: () => void
}

export default function BlancaLocationMap({
  mapContainerRef,
  onFocusArena,
}: BlancaLocationMapProps) {
  return (
    <div className="bg-[#141517] border border-white/[0.08] grow w-full lg:w-[56%] h-[360px] lg:h-full rounded-[8px] overflow-hidden relative shadow-2xl">
      {/* Target Mount Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Tombol Cepat Fokus Arena di Peta */}
      <button
        type="button"
        onClick={onFocusArena}
        className="absolute top-4 left-4 z-[400] px-3.5 py-2 bg-[#1c1c1c]/90 hover:bg-[#2a2a2a] border border-white/10 rounded-md text-xs font-medium text-white flex items-center gap-2 backdrop-blur-md shadow-lg transition-all cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-[#f2d953]" />
        <span>Fokus Lokasi Arena</span>
      </button>

      {/* Watermark Leaflet / Carto Dark */}
      <div className="absolute left-4 bottom-4 z-[400] flex items-center gap-1.5 bg-[#141517]/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 pointer-events-none opacity-80">
        <span className="text-xs font-semibold tracking-wider text-white">Leaflet / Carto Dark</span>
      </div>
    </div>
  )
}
