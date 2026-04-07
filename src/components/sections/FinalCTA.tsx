import ScrollReveal from '../ui/ScrollReveal'
import { trackCTAClick } from '../../lib/tracking'

export default function FinalCTA() {
  return (
    <section className="relative py-20 px-4 overflow-hidden" style={{ background: '#FFFDF7' }}>
      <ScrollReveal>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1A1A2E] leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your Competitors Already Automated This Quarter. Did You?
          </h2>

          <p className="mt-6 text-lg text-[#6B7280] max-w-2xl mx-auto">
            10 businesses get a free, custom AI automation audit this quarter.
            We review your operations, identify every rupee you're wasting,
            and deliver a roadmap to fix it. Zero cost. Zero obligation.
          </p>

          <div className="mt-10">
            <a
              href="#quiz"
              onClick={() => trackCTAClick('final-cta', 'Claim Your Free Audit')}
              className="inline-block font-bold rounded-xl px-10 py-5 text-lg bg-[#D5EB4B] text-[#0c0c10] shadow-[0_0_30px_rgba(213,235,75,0.2)] hover:shadow-[0_0_50px_rgba(213,235,75,0.35)] transition-shadow"
            >
              Claim Your Free Audit
            </a>
          </div>

          <p className="mt-4 text-sm text-[#6B7280]">
            2-minute quiz. Results in 48 hours. No payment needed.
          </p>
        </div>
      </ScrollReveal>

    </section>
  )
}
