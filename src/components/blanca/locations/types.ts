// PERAN FILE: Definisi Type & Interface untuk Section Lokasi dan Kontak Blanca
export interface ArenaVenue {
  id: string
  name: string
  address: string
  city: string
  district: string
  lat: number
  lng: number
  courtsCount: number
  phone: string
  whatsapp: string
  email: string
  instagram: string
  hours: string
  googleMapsUrl: string
}

export interface ContactCardItem {
  id: string
  title: string
  address: string
  image: string
  href: string
  isMapAction?: boolean
}
