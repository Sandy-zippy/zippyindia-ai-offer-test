import { useState, useEffect } from 'react'

function getLocalCounter(): number {
  try {
    return parseInt(localStorage.getItem('zippy_waitlist_counter') || '11', 10)
  } catch {
    return 11
  }
}

export default function ScarcityBanner() {
  const [visible, setVisible] = useState(
    () => sessionStorage.getItem('scarcity_dismissed') !== 'true'
  )
  const [counter, setCounter] = useState(getLocalCounter)

  useEffect(() => {
    // Try to fetch real count from API
    fetch('https://zippyscale-3ajsaibi1-sandys-projects-60666aac.vercel.app/api/waitlist-count')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.count) {
          setCounter(data.count)
          localStorage.setItem('zippy_waitlist_counter', String(data.count))
        }
      })
      .catch(() => { /* use localStorage fallback */ })
  }, [])

  useEffect(() => {
    const onUpdate = () => setCounter(getLocalCounter())
    window.addEventListener('waitlist-updated', onUpdate)
    return () => window.removeEventListener('waitlist-updated', onUpdate)
  }, [])

  if (!visible) return null

  const dismiss = () => {
    sessionStorage.setItem('scarcity_dismissed', 'true')
    setVisible(false)
    window.dispatchEvent(new Event('scarcity-dismissed'))
  }

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center h-12 bg-[#D5EB4B] px-4">
      <p className="font-['Space_Grotesk'] font-semibold text-sm text-[#0c0c10] text-center">
        {Math.max(10 - Math.min(counter, 9), 1)} spots remaining this quarter &middot; <span className="font-bold text-base">{counter}</span> businesses already applied
      </p>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#0c0c10]/70 hover:text-[#0c0c10] transition-colors"
        aria-label="Dismiss banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
