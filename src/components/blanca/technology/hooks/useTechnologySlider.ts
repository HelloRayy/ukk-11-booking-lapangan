// PERAN FILE: Custom Hook Logic untuk Slider Section Our Technology Blanca
import { useState } from 'react'
import { TECHNOLOGY_SLIDES } from '../data/technologyData'

export function useTechnologySlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = TECHNOLOGY_SLIDES.length

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index)
    }
  }

  return {
    currentSlide,
    activeSlide: TECHNOLOGY_SLIDES[currentSlide],
    slides: TECHNOLOGY_SLIDES,
    handlePrev,
    handleNext,
    goToSlide,
  }
}
