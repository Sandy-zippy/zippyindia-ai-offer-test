import { trackCTAClick } from '../../lib/tracking'

interface MidPageCTAProps {
  variant?: 'pain' | 'process' | 'roi'
}

export default function MidPageCTA({ variant = 'pain' }: MidPageCTAProps) {
  const copy = {
    pain: {
      headline: 'Every day you wait, manual work costs you money.',
      sub: 'Takes 2 minutes. No payment. No obligation.',
    },
    process: {
      headline: '2 weeks to live automations. Start with the quiz.',
      sub: 'Free audit. Custom roadmap in 48 hours.',
    },
    roi: {
      headline: 'Those savings are real. Claim your free audit.',
      sub: '2-minute quiz. Results in 48 hours.',
    },
  }
  const { headline, sub } = copy[variant]

  return (
    <div className="bg-[#2A2A35] py-10 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-white font-semibold text-lg mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {headline}
        </p>
        <a
          href="#quiz"
          onClick={() => trackCTAClick('mid-page-cta', 'Get Your Free Audit')}
          className="inline-block font-bold rounded-xl px-8 py-4 text-base bg-[#D5EB4B] text-[#0c0c10] hover:brightness-110 transition-all"
        >
          Get Your Free Audit
        </a>
        <p className="text-[#6B7280] text-xs mt-3">{sub}</p>
      </div>
    </div>
  )
}
