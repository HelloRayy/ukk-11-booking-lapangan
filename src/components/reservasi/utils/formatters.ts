// PERAN FILE: Kumpulan fungsi pembantu (helper) pemformatan rupiah, inisial, dan teks
export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export function formatTarifK(pricePerHour: number): string {
  return `Rp ${(pricePerHour / 1000).toLocaleString('id-ID')}k/jam`
}

export function getInitials(name: string): string {
  if (!name) return 'BS'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return ''
  try {
    const d = new Date(isoDate.includes('T') ? isoDate : `${isoDate}T00:00:00`)
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

export function getTodayISODate(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
