// PERAN FILE: Pure UI Kartu Kontak Arena Blanca Badminton
import type { ContactCardItem } from '../types'

interface BlancaContactCardProps {
  item: ContactCardItem
  onFocusMap: () => void
}

export default function BlancaContactCard({ item, onFocusMap }: BlancaContactCardProps) {
  const isExternal = item.href.startsWith('http') || item.href.startsWith('mailto')

  return (
    <li className="flex items-center gap-x-4 sm:gap-x-6 py-6 px-5 sm:py-8 sm:px-8 text-[#fcfcfc] text-base border-b border-[#444444] last:border-b-0 leading-normal transition-all hover:bg-white/[0.02]">
      {/* Thumbnail 96x96 rounded-lg */}
      <div className="rounded-lg h-[84px] w-[84px] sm:h-[96px] sm:w-[96px] overflow-hidden shrink-0 bg-[#242424] leading-normal transition-all">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover rounded-lg leading-normal transition-all"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Tengah: Judul & Alamat / Deskripsi */}
      <div className="flex-1 flex flex-col items-start gap-y-2 leading-normal transition-all min-w-0">
        <h3 className="leading-normal transition-all w-full truncate">
          {item.isMapAction ? (
            <button
              type="button"
              onClick={onFocusMap}
              className="inline-block text-left font-medium text-white text-base leading-normal hover:text-[#f2d953] transition-colors cursor-pointer truncate"
            >
              {item.title}
            </button>
          ) : (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-left font-medium text-white text-base leading-normal hover:text-[#f2d953] transition-colors cursor-pointer truncate"
            >
              {item.title}
            </a>
          )}
        </h3>
        <address className="text-[#bfbfbf] font-light leading-snug transition-all not-italic text-xs sm:text-sm line-clamp-2">
          {item.address}
        </address>

        {/* Tombol Go versi Mobile */}
        <a
          href={item.href}
          target={isExternal ? '_blank' : undefined}
          rel="noreferrer"
          onClick={item.isMapAction ? onFocusMap : undefined}
          className="flex sm:hidden items-center justify-center px-4 bg-[#f2d953] text-[#161616] text-center rounded h-9 text-xs font-semibold leading-normal transition-all duration-150 hover:bg-[#e1ca4d] active:scale-[0.98] mt-1 cursor-pointer"
        >
          Go
        </a>
      </div>

      {/* Tombol Go Khas Blanca di Sisi Kanan (Desktop) */}
      <a
        href={item.href}
        target={isExternal ? '_blank' : undefined}
        rel="noreferrer"
        onClick={item.isMapAction ? onFocusMap : undefined}
        className="hidden sm:flex shrink-0 items-center justify-center px-4 bg-[#f2d953] text-[#161616] text-center rounded h-10 w-[78px] leading-normal transition-all duration-150 hover:bg-[#e1ca4d] active:scale-[0.98] font-semibold text-sm cursor-pointer ml-auto"
      >
        <span className="text-center leading-normal transition-all">Go</span>
      </a>
    </li>
  )
}
