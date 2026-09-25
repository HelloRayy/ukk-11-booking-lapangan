// PERAN FILE: Custom Hook Logic untuk Section Lokasi (Leaflet Map Controller & Contact Filter)
import { useEffect, useRef, useState, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { VENUE_DATA, CONTACT_ITEMS } from '../data/venueData'
import type { ContactCardItem } from '../types'

export function useBlancaLocations() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMapVisible, setIsMapVisible] = useState(false)

  // Lazy-load Leaflet hanya saat section lokasi mendekati layar (rootMargin 300px)
  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsMapVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Inisialisasi Peta Leaflet dengan Dark Matter Tiles secara bertahap
  useEffect(() => {
    if (!isMapVisible || !mapContainerRef.current) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Inisialisasi peta berpusat pada koordinat arena
    const map = L.map(mapContainerRef.current, {
      center: [VENUE_DATA.lat, VENUE_DATA.lng],
      zoom: 14,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    })

    // Pasang Dark Matter Tiles CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Custom Icon Marker Khas Blanca dengan Badge Kuning
    const customIcon = L.divIcon({
      className: 'custom-blanca-marker',
      html: `
        <div class="relative group cursor-pointer flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <div class="w-10 h-10 rounded-full bg-[#f2d953] text-black shadow-2xl flex items-center justify-center font-bold text-sm border-2 border-white ring-4 ring-[#f2d953]/30 animate-pulse">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#f2d953" />
              <circle cx="12" cy="9" r="2.5" fill="#161616" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })

    const marker = L.marker([VENUE_DATA.lat, VENUE_DATA.lng], { icon: customIcon }).addTo(map)

    marker.bindPopup(`
      <div style="min-width: 220px; font-family: 'Aeonik Pro', -apple-system, sans-serif; color: #fcfcfc; background: #1a1a1a; padding: 4px;">
        <h4 style="font-weight: 700; font-size: 14px; margin: 0 0 4px 0; color: #f2d953;">${VENUE_DATA.name}</h4>
        <p style="font-size: 12px; color: #bfbfbf; margin: 0 0 8px 0; line-height: 1.4;">${VENUE_DATA.address}</p>
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px; font-size: 11px; color: #a3a3a3;">
          <span>6 Lapangan BWF</span> • <span>500+ Lux LED</span>
        </div>
        <a href="${VENUE_DATA.googleMapsUrl}" target="_blank" rel="noreferrer" style="display: inline-block; background: #f2d953; color: #161616; padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; text-decoration: none;">Buka di Google Maps &rarr;</a>
      </div>
    `)

    markerRef.current = marker
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [isMapVisible])

  // Fungsi aksi flyTo peta
  const focusOnMap = () => {
    if (!isMapVisible) {
      setIsMapVisible(true)
    }
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([VENUE_DATA.lat, VENUE_DATA.lng], 16, { duration: 1.2 })
      markerRef.current.openPopup()
    }
  }

  // Filter kontak berdasarkan query pencarian
  const filteredContacts: ContactCardItem[] = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return CONTACT_ITEMS
    return CONTACT_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.address.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return {
    mapContainerRef,
    searchQuery,
    setSearchQuery,
    filteredContacts,
    focusOnMap,
    venueData: VENUE_DATA,
  }
}
