// PERAN FILE: Data dummy / fixtures untuk simulasi demo & pengujian lokal UKK
import type { Court, BookingItem } from '../types'

export const FIXTURE_COURTS: Court[] = [
  {
    id: 1,
    name: 'Court 1',
    type: 'Panoramic Glass',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
    pricePerHour: 150000,
  },
  {
    id: 2,
    name: 'Court 2',
    type: 'Pro Championship',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
    pricePerHour: 150000,
  },
  {
    id: 3,
    name: 'Court 3',
    type: 'VIP Indoor AC',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    pricePerHour: 200000,
  },
  {
    id: 4,
    name: 'Court 4',
    type: 'Training Ground',
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fedc2a?auto=format&fit=crop&w=600&q=80',
    pricePerHour: 120000,
  },
]

export const FIXTURE_BOOKINGS: BookingItem[] = [
  {
    id: 'fixture-1',
    courtId: 1,
    courtName: 'Court 1',
    customerName: 'Budi Santoso',
    customerWhatsapp: '081234567890',
    customerEmail: 'budi@gmail.com',
    date: '2026-09-22',
    startTime: '10:00',
    endTime: '11:00',
    status: 'booked',
    paymentType: 'DP',
    totalPrice: 150000,
    paidAmount: 75000,
    remainingAmount: 75000,
    notes: 'Latihan tim ganda persiapan turnamen UKK.',
    avatarInitials: 'BS',
  },
  {
    id: 'fixture-2',
    courtId: 2,
    courtName: 'Court 2',
    customerName: 'Brooklyn Simmons',
    customerWhatsapp: '081987654321',
    customerEmail: 'brooklyn@example.com',
    date: '2026-09-22',
    startTime: '10:00',
    endTime: '11:00',
    status: 'booked',
    paymentType: 'Lunas',
    totalPrice: 150000,
    paidAmount: 150000,
    remainingAmount: 0,
    notes: 'Sewa reguler perorangan.',
    avatarInitials: 'BS',
  },
]
