import { useState } from 'react'

export default function ReservationModal() {
  const [quizOpen, setQuizOpen] = useState(false)

  return (
    <>
      {/* Bottom Floating Action Button (FAB): Reservation Popup */}
      <div className="fixed z-30 left-0 bottom-0 w-full flex flex-row items-center justify-center pointer-events-none">
        <div className="absolute left-0 bottom-0 w-full h-[88px] md:h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div
          onClick={() => setQuizOpen(true)}
          className="pt-[4px] pb-[6px] pl-5 pr-[111.008px] bg-[#d9d9d9]/[0.12] hover:bg-[#d9d9d9]/[0.22] rounded-t-[8px] relative group backdrop-blur-md h-[60px] leading-normal transition-all duration-200 cursor-pointer pointer-events-auto select-none"
        >
          <div className="absolute -top-[15px] right-[10px] bottom-0 w-[89px] h-auto pointer-events-none group-hover:scale-[1.075] transition-transform duration-300 origin-bottom">
            <img
              className="h-[67.0964px] w-[88.9974px] object-contain object-bottom leading-normal transition-all"
              alt="Reserve your court"
              src="/assets/blanca/quiz-button.png"
              width="191"
              height="144"
            />
          </div>
          <div className="flex flex-col items-start h-auto my-[2px] gap-[4px] w-auto leading-tight transition-all">
            <button
              type="button"
              className="text-left text-[20px] text-[#fcfcfc] font-normal leading-tight transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              Reserve your court
            </button>
            <span className="text-[#bfbfbf] text-sm font-light leading-tight transition-all whitespace-nowrap">
              check available slots
            </span>
          </div>
        </div>
      </div>

      {/* Reservation Modal Dialog */}
      {quizOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-end md:items-center justify-center p-0 md:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-[#161616]/[0.6] backdrop-blur-[7px] transition-opacity duration-300"
            onClick={() => setQuizOpen(false)}
          />
          <div className="relative w-full md:max-w-[586px] max-md:rounded-t-[8px] md:rounded-[8px] bg-[#fcfcfc] text-[#161616] p-6 md:p-8 z-10 shadow-2xl transition-all duration-300">
            <button
              type="button"
              onClick={() => setQuizOpen(false)}
              className="absolute top-4 md:top-6 right-4 md:right-6 w-10 h-10 flex items-center justify-center rounded-[8px] border border-neutral-300 hover:border-black hover:bg-neutral-100 transition-colors text-neutral-800 cursor-pointer"
              aria-label="Close modal"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m6 6 12 12M6 18 18 6" />
              </svg>
            </button>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Reservation
              </span>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Reserve your court now</h2>
              <p className="text-neutral-600 text-sm md:text-base">
                Check real-time schedule availability and book your preferred court in minutes.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="/#reservation"
                  onClick={() => setQuizOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#161616] text-[#fcfcfc] rounded-md font-normal hover:bg-neutral-800 transition-colors text-center"
                >
                  Start booking
                </a>
                <button
                  type="button"
                  onClick={() => setQuizOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-md font-normal hover:bg-neutral-100 transition-colors text-neutral-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
