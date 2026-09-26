export function formatRupiah(amount: number): string {
  return `Rp ${(amount || 0).toLocaleString('id-ID')}`
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
