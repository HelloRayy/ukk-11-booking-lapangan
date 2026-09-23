import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mengubah array slot jam (misal: ['16:00', '17:00', '18:00', '19:00', '20:00'])
 * menjadi format rentang waktu yang ringkas dan alami (misal: '16:00 - 21:00').
 * Jika ada slot jam terpisah (non-contiguous), otomatis dipisahkan dengan koma.
 */
export function formatSlotRange(slots: string[] | undefined | null): string {
  if (!slots || slots.length === 0) return '-'

  // Urutkan slot jam berdasarkan jam mulai terkecil
  const sorted = [...slots].sort((a, b) => {
    const hourA = parseInt(a.split(':')[0], 10)
    const hourB = parseInt(b.split(':')[0], 10)
    return hourA - hourB
  })

  // Kelompokkan slot yang bersambung
  const groups: string[][] = []
  let currentGroup: string[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const prevH = parseInt(sorted[i - 1].split(':')[0], 10)
    const currH = parseInt(sorted[i].split(':')[0], 10)

    if (currH === prevH + 1) {
      currentGroup.push(sorted[i])
    } else {
      groups.push(currentGroup)
      currentGroup = [sorted[i]]
    }
  }
  groups.push(currentGroup)

  // Format setiap kelompok menjadi rentang jam "HH:00 - HH:00"
  return groups
    .map((grp) => {
      const startH = parseInt(grp[0].split(':')[0], 10)
      const lastSlotH = parseInt(grp[grp.length - 1].split(':')[0], 10)
      const endH = lastSlotH + 1

      const startStr = `${startH < 10 ? '0' : ''}${startH}:00`
      const endStr = `${endH < 10 ? '0' : ''}${endH}:00`
      return `${startStr} - ${endStr}`
    })
    .join(', ')
}

