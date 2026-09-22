// PERAN FILE: Custom Hook Logic untuk Akordeon FAQ Blanca
import { useState } from 'react'
import { FAQ_DATA } from '../data/faqData'

export function useFaqAccordion() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const isOpen = (index: number) => openItems.includes(index)

  return {
    faqList: FAQ_DATA,
    openItems,
    toggleItem,
    isOpen,
  }
}
