// PERAN FILE: Pure UI Kolom Kiri Sticky Cerita Komunitas Blanca
import { COMMUNITY_STORY } from '../data/differenceData'

export default function DifferenceCommunityStory() {
  return (
    <div className="max-mdw:hidden col-start-1 col-span-4 mdw:sticky top-[80px] pb-[285px]">
      <div className="w-full h-auto aspect-[448/337] rounded-[8px] overflow-hidden mb-[40px] relative">
        <img
          src={COMMUNITY_STORY.image}
          alt={COMMUNITY_STORY.alt}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      <div className="body text-[#bfbfbf] w-full max-w-[334px]">
        {COMMUNITY_STORY.description}
      </div>
    </div>
  )
}
