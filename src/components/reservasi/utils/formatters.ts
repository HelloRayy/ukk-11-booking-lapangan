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
