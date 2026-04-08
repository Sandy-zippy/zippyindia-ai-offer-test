import ScrollReveal from '../ui/ScrollReveal'
import AnimatedCounter from '../ui/AnimatedCounter'

const stats = [
  { target: 1.6, prefix: '₹', suffix: ' Cr+', label: 'Saved across clients', decimals: 1 },
  { target: 8000, prefix: '', suffix: '+', label: 'Manual hours saved across 23 clients in 6 months', decimals: 0 },
  { target: 23, prefix: '', suffix: '+', label: '23 businesses across 8 industries', decimals: 0 },
  { target: 10, prefix: '', suffix: 'x', label: 'Output without new hires', decimals: 0 },
]

export default function ProofOfWork() {
  return (
    <section className="bg-[#FFFDF7] py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <ScrollReveal>
          <p className="font-mono text-xs uppercase tracking-widest text-[#B8CF2E] mb-4">
            Our Track Record
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-[#0A0A0F] mb-12">
            Results From the Last 6 Months
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div className="h-full bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8 text-center shadow-sm transition-all duration-300 hover:border-[#B8CF2E]/40 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[140px]">
                <AnimatedCounter
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  className="font-mono font-bold text-3xl md:text-4xl text-[#B8CF2E]"
                  duration={2}
                />
                <p className="font-sans text-sm text-[#1F2937] mt-3">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
