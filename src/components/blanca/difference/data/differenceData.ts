// PERAN FILE: Data Statis Fitur Arena & Cerita Komunitas The Blanca Difference
import type { CourtFeature } from '../types'

export const COMMUNITY_STORY = {
  image: '/assets/orang-1.webp',
  alt: 'Blanca Badminton Community',
  description:
    'Blanca Arena was founded by a passionate community of players who wanted premium, tournament-grade courts with seamless booking and an inclusive atmosphere for everyone from beginners to competitive athletes.',
}

export const COURT_FEATURES: CourtFeature[] = [
  {
    id: 'tournament-grade',
    title: 'Tournament Grade',
    description:
      'Certified shock-absorption court turf with 500+ lux anti-glare LED lighting built for tournament-level gameplay.',
    iconSrc: '/assets/blanca/icon-minimal.svg',
  },
  {
    id: 'all-levels',
    title: 'All Levels',
    description:
      'Designed for all playstyles, whether you’re booking a casual friendly match or training for competitive leagues.',
    iconSrc: '/assets/blanca/icon-all-levels.svg',
  },
  {
    id: 'full-amenities',
    title: 'Full Amenities',
    description:
      'Includes secure lockers, clean hot shower facilities, equipment rental, and a players lounge to relax post-match.',
    iconSrc: '/assets/blanca/icon-quality.svg',
  },
]
