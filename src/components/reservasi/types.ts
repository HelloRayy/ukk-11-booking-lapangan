// PERAN FILE: Definisi tipe data & antarmuka untuk jadwal reservasi & panel inspektor (User POV)
export type PaymentType = 'dp' | 'lunas'
export type SlotStatus = 'available' | 'booked' | 'maintenance'

export interface Court {
  id: string
  name: string
  type: string
  image: string
  pricePerHour: number
}

export interface BookingItem {
  id: string
  courtId: string
  courtName: string
  customerName: string
  customerWhatsapp: string
  customerEmail: string
  date: string
  startTime: string
  endTime: string
  status: SlotStatus
  paymentType: PaymentType
  totalPrice: number
  paidAmount: number
  remainingAmount: number
  notes?: string
  avatarInitials?: string
}

export interface SlotRangeSelection {
  courtId: string
  courtName: string
  date: string
  startHour: number
  endHour: number
  startTime: string
  endTime: string
  selectedHours: string[]
  totalHours: number
  pricePerHour: number
  totalPrice: number
}

export type RightPanelMode = 'empty' | 'inspect' | 'create'
