// PERAN FILE: Komponen Section 'Find a Club' / Locations Blanca Padel dengan Real Interactive Dark Map (Leaflet)
import { useState, useMemo, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Location {
  id: string
  slug: string
  title: string
  address: string
  city: string
  state: string
  country: string
  lat: number
  lng: number
  image: string
  url: string
}

const LOCATIONS: Location[] = [
  {
    id: 'location-2',
    slug: 'addison-reserve-country-club',
    title: 'Addison Reserve Country Club',
    address: '7201 Addison Reserve Blvd, Delray Beach, FL 33446',
    city: 'Delray Beach',
    state: 'FL',
    country: 'USA',
    lat: 26.436523,
    lng: -80.15706,
    image: 'https://blancapadel.com/cdn/shop/files/2020-10-23.jpg?v=1755628483',
    url: 'https://www.google.com/maps/search/?api=1&query=7201+Addison+Reserve+Blvd+Delray+Beach+FL+33446',
  },
  {
    id: 'location-3',
    slug: 'aronimonk-golf-club',
    title: 'Aronimonk Golf Club',
    address: '3600 St Davids Rd, Newtown Square, PA 19073',
    city: 'Newtown Square',
    state: 'PA',
    country: 'USA',
    lat: 40.011759,
    lng: -75.409013,
    image: 'https://blancapadel.com/cdn/shop/files/Aronimonk.jpg?v=1744122144',
    url: 'https://www.google.com/maps/search/?api=1&query=3600+St+Davids+Rd+Newtown+Square+PA+19073',
  },
  {
    id: 'location-4',
    slug: 'ballers-philly',
    title: 'Ballers - Philly',
    address: '1325 N Beach St, Philadelphia, PA 19125',
    city: 'Philadelphia',
    state: 'PA',
    country: 'USA',
    lat: 39.967578,
    lng: -75.126159,
    image: 'https://blancapadel.com/cdn/shop/files/1748617415783.jpg?v=1754586857',
    url: 'https://www.google.com/maps/search/?api=1&query=1325+N+Beach+St+Philadelphia+PA+19125',
  },
  {
    id: 'location-1',
    slug: '40forty-padel-club',
    title: '40Forty Padel Club',
    address: '15 Jenkins Ct Suite B, Mauldin, SC 29662',
    city: 'Mauldin',
    state: 'SC',
    country: 'USA',
    lat: 34.782003,
    lng: -82.309133,
    image: 'https://blancapadel.com/cdn/shop/files/40Forty.jpg?v=1788900607',
    url: 'https://www.google.com/maps/search/?api=1&query=15+Jenkins+Ct+Suite+B+Mauldin+SC+29662',
  },
  {
    id: 'location-11',
    slug: 'taktika-padel',
    title: 'Taktika Padel',
    address: '4490 W Point Loma Blvd, San Diego, CA 92107',
    city: 'San Diego',
    state: 'CA',
    country: 'USA',
    lat: 32.7533,
    lng: -117.2346,
    image: 'https://blancapadel.com/cdn/shop/files/2024-07-22.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=4490+W+Point+Loma+Blvd+San+Diego+CA+92107',
  },
  {
    id: 'location-12',
    slug: 'the-king-of-padel',
    title: 'The King of Padel',
    address: '4370 Jutland Dr, San Diego, CA 92117',
    city: 'San Diego',
    state: 'CA',
    country: 'USA',
    lat: 32.8229,
    lng: -117.2023,
    image: 'https://blancapadel.com/cdn/shop/files/2024-08-01.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=4370+Jutland+Dr+San+Diego+CA+92117',
  },
  {
    id: 'location-15',
    slug: 'the-padel-courts',
    title: 'The Padel Courts',
    address: '5115 W Sunset Blvd, Los Angeles, CA 90027',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    lat: 34.098,
    lng: -118.3005,
    image: 'https://blancapadel.com/cdn/shop/files/2024-02-14.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=5115+W+Sunset+Blvd+Los+Angeles+CA+90027',
  },
  {
    id: 'location-9',
    slug: 'spin-padel',
    title: 'Spin Padel',
    address: 'Vía Rápida Ote. 11942-2, Buena Vista, Sepanal, 22415 Tijuana, B.C., Mexico',
    city: 'Tijuana',
    state: 'B.C.',
    country: 'Mexico',
    lat: 32.518075,
    lng: -117.015705,
    image: 'https://blancapadel.com/cdn/shop/files/2024-08-29.jpg?v=1733940003',
    url: 'https://www.google.com/maps/search/?api=1&query=Spin+Padel+Tijuana',
  },
  {
    id: 'location-14',
    slug: 'the-padel-club-georgetown',
    title: 'The Padel Club Georgetown',
    address: 'Lot 36 First Avenue Subryanville, Georgetown, Guyana',
    city: 'Georgetown',
    state: 'Demerara',
    country: 'Guyana',
    lat: 6.8164,
    lng: -58.1408,
    image: 'https://blancapadel.com/cdn/shop/files/2024-09-05.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=The+Padel+Club+Georgetown+Guyana',
  },
  {
    id: 'location-8',
    slug: 'sensa-padel-boston',
    title: 'Sensa Padel - Boston',
    address: '1 Westinghouse Plaza Building G, Boston, MA 02136',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    lat: 42.2472,
    lng: -71.1303,
    image: 'https://blancapadel.com/cdn/shop/files/2024-05-15.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=1+Westinghouse+Plaza+Boston+MA+02136',
  },
  {
    id: 'location-10',
    slug: 'st-pete-athletic',
    title: 'St. Pete Athletic',
    address: '680 28th St S, St. Petersburg, FL 33712',
    city: 'St. Petersburg',
    state: 'FL',
    country: 'USA',
    lat: 27.7621,
    lng: -82.6713,
    image: 'https://blancapadel.com/cdn/shop/files/2024-06-18.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=680+28th+St+S+St+Petersburg+FL+33712',
  },
  {
    id: 'location-13',
    slug: 'the-pad-sarasota',
    title: 'The Pad Sarasota',
    address: '1660 Bio Tech Way, Sarasota, FL 34243',
    city: 'Sarasota',
    state: 'FL',
    country: 'USA',
    lat: 27.3879,
    lng: -82.5516,
    image: 'https://blancapadel.com/cdn/shop/files/2024-04-10.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=1660+Bio+Tech+Way+Sarasota+FL+34243',
  },
  {
    id: 'location-5',
    slug: 'costa-padel',
    title: 'Costa Padel',
    address: 'Jl. Arteri Klp. Gading, RT.1/RW.1, Pegangsaan Dua, Jakarta Utara',
    city: 'Jakarta',
    state: 'DKI Jakarta',
    country: 'Indonesia',
    lat: -6.17702,
    lng: 106.913326,
    image: 'https://blancapadel.com/cdn/shop/files/Costa_Padel.jpg?v=1788898937',
    url: 'https://www.google.com/maps/search/?api=1&query=Costa+Padel+Kelapa+Gading+Jakarta',
  },
  {
    id: 'location-7',
    slug: 'reset-social-club',
    title: 'Reset Social Club',
    address: 'SCBD Park, Jl. Jend. Sudirman kav 52-53 Lot 8, Senayan, Jakarta Selatan',
    city: 'Jakarta',
    state: 'DKI Jakarta',
    country: 'Indonesia',
    lat: -6.2255,
    lng: 106.8088,
    image: 'https://blancapadel.com/cdn/shop/files/2024-01-23.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=Reset+Social+Club+SCBD+Park+Jakarta',
  },
]

export default function BlancaLocations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLocationId, setActiveLocationId] = useState<string>('location-2')
  const [mobileView, setMobileView] = useState<'map' | 'list'>('list')
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [id: string]: L.Marker }>({})

  // Filter lokasi berdasarkan query input
  const filteredLocations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return LOCATIONS
    return LOCATIONS.filter(
      (loc) =>
        loc.title.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q),
    )
  }, [searchQuery])

  // Inisialisasi Real Interactive Dark Map (Leaflet + CartoDB Dark Matter Tiles)
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Bersihkan instance lama jika ada
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Inisialisasi Leaflet map dengan koordinat global
    const map = L.map(mapContainerRef.current, {
      center: [28, -50],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    })

    // Pasang Dark Matter Tiles Real Map (Free, no API key needed, sleek dark aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Zoom controls di pojok kanan bawah
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Buat markers untuk setiap lokasi klub
    const markers: { [id: string]: L.Marker } = {}

    LOCATIONS.forEach((loc) => {
      // Custom HTML Marker khas Blanca (Icon lingkaran dengan badge)
      const isSelected = loc.id === activeLocationId

      const customIcon = L.divIcon({
        className: 'custom-blanca-marker',
        html: `
          <div class="relative group cursor-pointer flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125">
            <div class="w-8 h-8 rounded-full ${
              isSelected
                ? 'bg-[#f2d953] text-black ring-4 ring-[#f2d953]/40'
                : 'bg-white text-black hover:bg-[#f2d953]'
            } shadow-2xl flex items-center justify-center font-bold text-xs border border-black/10">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none" />
                <line x1="3" y1="13" x2="13" y2="3" stroke="currentColor" stroke-width="1.5" />
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map)

      // Popup detail informasi klub saat marker di klik
      marker.bindPopup(`
        <div style="min-width: 200px; font-family: 'Aeonik Pro', sans-serif;">
          <div style="width: 100%; height: 100px; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
            <img src="${loc.image}" alt="${loc.title}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <h4 style="font-weight: 600; font-size: 14px; margin: 0 0 4px 0; color: #fcfcfc;">${loc.title}</h4>
          <p style="font-size: 12px; color: #bfbfbf; margin: 0 0 8px 0; line-height: 1.3;">${loc.address}</p>
          <a href="${loc.url}" target="_blank" rel="noreferrer" style="display: inline-block; background: #f2d953; color: #161616; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; text-decoration: none;">Directions &rarr;</a>
        </div>
      `)

      marker.on('click', () => {
        setActiveLocationId(loc.id)
      })

      markers[loc.id] = marker
    })

    markersRef.current = markers
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Saat lokasi aktif berubah, buat map flyTo ke titik tersebut
  const handleSelectLocation = (loc: Location) => {
    setActiveLocationId(loc.id)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 12, {
        duration: 1.2,
      })

      const marker = markersRef.current[loc.id]
      if (marker) {
        marker.openPopup()
      }
    }
  }

  // Handle GPS location click (Simulasi geolokasi ke San Diego Padel hub)
  const handleUseLocation = () => {
    setSearchQuery('San Diego')
    const sdLoc = LOCATIONS.find((l) => l.city === 'San Diego')
    if (sdLoc && mapInstanceRef.current) {
      handleSelectLocation(sdLoc)
    }
  }

  return (
    <section
      id="find-a-club"
      className="locations relative w-full bg-[#161616] text-[#fcfcfc] overflow-hidden pt-[64px] mdw:pt-[110px] pb-[80px] mdw:pb-[140px] font-aeonik"
    >
      <div className="container site-grid gap-y-[40px] mdw:gap-y-[80px] overflow-hidden">
        {/* Header Sisi Kiri: Judul Utama */}
        <div className="col-span-12 mdw:col-span-8">
          <h2 className="w-full max-w-[818px] text-[44px] sm:text-[56px] mdw:text-[76px] lg:text-[88px] font-normal leading-[1.02] tracking-[-1px] text-[#fcfcfc]">
            Blanca is much closer than you think
          </h2>
        </div>

        {/* Header Sisi Kanan: Paragraf Penjelas (32px font size) */}
        <div className="col-span-12 mdw:col-span-3 mdw:col-start-10 flex flex-col justify-end">
          <p className="text-[22px] mdw:text-[32px] text-[#bfbfbf] font-light leading-snug">
            Made from the highest quality materials and latest technology used by the big brand padel companies for a fraction of the price.
          </p>
        </div>

        {/* Layout Kontainer Utama (Real Map di Kiri, Search & List di Kanan) */}
        <div className="col-span-12 flex flex-col md:flex-row gap-[12px] mdw:gap-[16px] h-auto md:h-[647px] items-stretch">
          {/* Sisi Kiri: Real Interactive Map Embed Container */}
          <div
            className={`bg-[#141517] border border-white/[0.08] grow w-full md:max-w-[calc(100%-380px)] mdw:max-w-[calc(100%-510px)] h-[440px] md:h-full rounded-[8px] overflow-hidden relative shadow-2xl ${
              mobileView === 'list' ? 'max-md:hidden' : 'max-md:block'
            }`}
          >
            {/* Leaflet Map DOM Target */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Mapbox Style Watermark di Kiri Bawah */}
            <div className="absolute left-4 bottom-4 z-[400] flex items-center gap-1.5 bg-[#141517]/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 pointer-events-none opacity-80">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="#fcfcfc"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="#fcfcfc"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="#fcfcfc"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-semibold tracking-wider text-white">mapbox / carto</span>
            </div>
          </div>

          {/* Sisi Kanan: Panel Pencarian & Scrollable List Lokasi */}
          <div
            className={`w-full md:max-w-[380px] mdw:max-w-[504px] shrink-0 h-[560px] md:h-full flex flex-col bg-[#1c1c1c]/90 border border-white/[0.08] backdrop-blur-[7px] rounded-[8px] overflow-hidden shadow-2xl ${
              mobileView === 'map' ? 'max-md:hidden' : 'max-md:flex'
            }`}
          >
            {/* Header Form Pencarian */}
            <div className="p-4 sm:p-6 mdw:p-8 border-b border-white/[0.08]">
              <h3 className="text-xl mdw:text-2xl font-normal text-white">
                Find a club or store near me
              </h3>

              {/* Input Pencarian dengan Icon Magnifier */}
              <div className="relative mt-4 w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8e8e]">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter city, ZIP, or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#262626] border border-white/[0.1] focus:border-white/40 focus:outline-none rounded-md py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#8e8e8e] transition-colors"
                />
              </div>

              {/* Status Jumlah Lokasi & Tombol GPS Current Location */}
              <div className="flex flex-row items-center justify-between mt-3 text-xs text-[#8e8e8e]">
                <span>{filteredLocations.length} locations found</span>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="flex items-center gap-1 text-[#bfbfbf] hover:text-white transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <circle cx="10" cy="10" r="7" strokeWidth="1.5" />
                    <circle cx="10" cy="10" r="2.5" fill="currentColor" />
                    <line x1="10" y1="1" x2="10" y2="4" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10" y1="16" x2="10" y2="19" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="1" y1="10" x2="4" y2="10" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="10" x2="19" y2="10" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>Use my current location</span>
                </button>
              </div>
            </div>

            {/* Mobile View Toggle Buttons */}
            <div className="md:hidden flex border-b border-white/[0.08] text-sm">
              <button
                type="button"
                onClick={() => setMobileView('map')}
                className={`flex-1 py-3 text-center transition-colors ${
                  mobileView === 'map'
                    ? 'text-white border-b-2 border-[#f2d953] font-medium'
                    : 'text-[#8e8e8e]'
                }`}
              >
                Map view
              </button>
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className={`flex-1 py-3 text-center transition-colors ${
                  mobileView === 'list'
                    ? 'text-white border-b-2 border-[#f2d953] font-medium'
                    : 'text-[#8e8e8e]'
                }`}
              >
                List view
              </button>
            </div>

            {/* Scrollable List Lokasi Klub */}
            <ul className="flex-1 overflow-y-auto divide-y divide-white/[0.06] p-0 m-0 list-none">
              {filteredLocations.map((loc) => {
                const isActive = loc.id === activeLocationId
                return (
                  <li
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className={`flex flex-row items-center gap-x-4 p-4 mdw:p-6 transition-colors duration-150 cursor-pointer ${
                      isActive ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Thumbnail Foto Klub */}
                    <div className="shrink-0 w-[72px] h-[72px] mdw:w-[88px] mdw:h-[88px] rounded-[6px] overflow-hidden bg-neutral-800 border border-white/10">
                      <img
                        src={loc.image}
                        alt={loc.title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                    </div>

                    {/* Informasi Teks Klub */}
                    <div className="flex-1 min-w-0 flex flex-col items-start">
                      <h4 className="text-sm mdw:text-base font-normal text-white truncate w-full">
                        {loc.title}
                      </h4>
                      <p className="text-xs text-[#bfbfbf] font-light leading-snug mt-1 line-clamp-2">
                        {loc.address}
                      </p>
                      <a
                        href={loc.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-[#8e8e8e] hover:text-white transition-colors mt-2 inline-flex items-center gap-1"
                      >
                        <span>Go to website</span>
                        <span>&rarr;</span>
                      </a>
                    </div>

                    {/* Tombol Kuning 'Go >' Khas Blanca */}
                    <div className="shrink-0 pl-1">
                      <a
                        href={loc.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#f2d953] hover:bg-[#ffe769] text-black font-medium text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow-sm"
                      >
                        <span>Go</span>
                        <span className="text-[10px] font-bold">&gt;</span>
                      </a>
                    </div>
                  </li>
                )
              })}

              {filteredLocations.length === 0 && (
                <li className="p-8 text-center text-sm text-neutral-400">
                  No locations found matching &quot;{searchQuery}&quot;
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
