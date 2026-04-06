import { trackCTAClick } from '../../lib/tracking'

export default function MidPageCTA() {
  return (
    <div className="bg-[#2A2A35] py-10 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-white font-semibold text-lg mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Ready to see what you can automate?
        </p>
        <a
          href="#quiz"
          onClick={() => trackCTAClick('mid-page-cta', 'Get Your Free Audit')}
          className="inline-block font-bold rounded-xl px-8 py-4 text-base bg-[#D5EB4B] text-[#0c0c10] hover:brightness-110 transition-all"
        >
          Get Your Free Audit
        </a>
        <p className="text-[#6B7280] text-xs mt-3">
          Takes 60 seconds. No payment. No obligation.
        </p>
      </div>
    </div>
  )
}
