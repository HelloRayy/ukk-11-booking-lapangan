// jam operasional gor badminton (08:00 - 22:00)
export const JAM_BUKA = 8
export const JAM_TUTUP = 22

// generate list jam otomatis dari jam buka sampe tutup
export const DAFTAR_JAM = Array.from(
  { length: JAM_TUTUP - JAM_BUKA },
  (_, i) => `${(JAM_BUKA + i).toString().padStart(2, '0')}:00`
)
