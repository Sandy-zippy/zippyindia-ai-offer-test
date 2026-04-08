import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedCounter from '../ui/AnimatedCounter'
import { trackEvent, trackCTAClick } from '../../lib/tracking'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const stats = [
  { target: 40, suffix: '%', label: 'Cost Reduction' },
  { target: 3, suffix: 'x', label: 'Revenue Growth' },
  { target: 10, suffix: 'x Output', label: 'Same Team' },
]

function getHeadline(): { main: string; sub: string } {
  const utmContent = new URLSearchParams(window.location.search).get('utm_content')
  switch (utmContent) {
    case 'unaware':
      return {
        main: 'Your Leads Are Dying in WhatsApp Groups and Excel Sheets.',
        sub: 'We find every rupee your manual processes are wasting.',
      }
    case 'problem-aware':
      return {
        main: 'Freelancers Didn\u2019t Fix It. In-House Tools Didn\u2019t Fix It. Systems Will.',
        sub: 'Same team. 10x output. No new headcount.',
      }
    case 'solution-aware':
      return {
        main: 'Free AI Automation Audit. We Map Your Entire Lead Flow in 48 Hours.',
        sub: 'Custom roadmap. Zero cost. Zero obligation.',
      }
    default:
      return {
        main: 'Your Team Wastes 20+ Hours a Week on Work AI Can Do in Seconds',
        sub: 'Get a free audit that shows exactly where you\'re bleeding time and money. Same team, 10x output.',
      }
  }
}

/* ── Hero Form (above the fold) — 3 phases: contact → qualify → done ── */

const automationOptions = [
  'Complete Lead Flow',
  'Invoice & Payment Processing',
  'Report Generation',
  'Email & WhatsApp Follow-ups',
  'Customer Retention',
  'AI Voice + Chat + Booking',
  'Inventory & Orders',
  'HR & Payroll',
  'Other',
]

const industryOptions = [
  'Manufacturing', 'IT/Software', 'Healthcare', 'Education',
  'Real Estate', 'Retail/E-commerce', 'Professional Services',
  'Construction', 'Hospitality', 'Other',
]

const API_URL = 'https://script.google.com/macros/s/AKfycbzzacqtwW_Wfk3EB-4WmCQrNFK92yeT2ziRNJvV4Ujy_468HHwCRHiGN0OkxTMLZyKJKQ/exec'

function HeroForm() {
  const [phase, setPhase] = useState<'contact' | 'qualify' | 'done'>('contact')

  // Contact fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [whatsappConsent, setWhatsappConsent] = useState(true)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Qualify fields
  const [selected, setSelected] = useState<string[]>([])
  const [industry, setIndustry] = useState('')
  const [qualifySubmitting, setQualifySubmitting] = useState(false)

  const validatePhone = (raw: string) => /^[6-9]\d{9}$/.test(raw.replace(/[\s\-+]/g, '').replace(/^91/, ''))
  const cleanPhone = (raw: string) => raw.replace(/[\s\-+]/g, '').replace(/^91/, '')

  function toggleOption(opt: string) {
    setSelected(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!name.trim()) { setFormError('Name is required'); return }
    if (!phone.trim() || !validatePhone(phone)) { setFormError('Valid 10-digit mobile number required'); return }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setFormError('Valid email required'); return }
    if (!businessName.trim()) { setFormError('Business name is required'); return }
    setSubmitting(true)

    const payload = {
      name: name.trim(), phone: cleanPhone(phone), email: email.trim(), business_name: businessName.trim(),
      whatsapp_consent: whatsappConsent, source: 'hero-form-v5',
      event_id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      client_user_agent: navigator.userAgent, page_url: window.location.href,
      visit_count: parseInt(localStorage.getItem('zippy_visit_count') || '1', 10),
      time_on_page: Math.round((Date.now() - ((window as any).__pageLoadTime || Date.now())) / 1000),
    }

    try { localStorage.setItem(`zippy_lead_${Date.now()}`, JSON.stringify(payload)) } catch {}

    // Fire API in background — don't wait for response
    fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {
      try { navigator.sendBeacon(API_URL, new Blob([JSON.stringify(payload)], { type: 'application/json' })) } catch {}
    })

    trackCTAClick('hero-form', 'Start My Free Audit')
    window.fbq?.('track', 'Lead', { content_name: 'Hero Form', content_category: 'hero_submission' })
    try { localStorage.setItem('zippy_hero_submitted', 'true') } catch {}
    try { localStorage.setItem('zippy_hero_phone', cleanPhone(phone)) } catch {}
    setSubmitting(false)
    setPhase('qualify')
  }

  async function handleQualifySubmit() {
    setQualifySubmitting(true)
    const enrichPayload = {
      phone: cleanPhone(phone), automate_areas: selected.join(', '), industry,
      source: 'hero-form-v5-enrich', event_id: `enrich_${Date.now()}`,
    }
    fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(enrichPayload) }).catch(() => {})
    setQualifySubmitting(false)
    setPhase('done')
  }

  // Phase 3: Done
  if (phase === 'done') {
    return (
      <div className="bg-white border border-[#E5E7EB] shadow-xl rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#D5EB4B] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><path d="M8 16L14 22L24 10" stroke="#0c0c10" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[#0A0A0F] mb-2">You're in!</h3>
        <p className="text-sm text-[#6B7280]">Check your WhatsApp. Custom roadmap within 48 hours.</p>
      </div>
    )
  }

  // Phase 2: Qualify (inline, right here in hero)
  if (phase === 'qualify') {
    return (
      <div className="bg-white border border-[#E5E7EB] shadow-xl rounded-2xl p-6">
        {/* Success banner */}
        <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-[rgba(213,235,75,0.1)] border border-[#D5EB4B]/30">
          <div className="w-5 h-5 rounded-full bg-[#D5EB4B] flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="#0c0c10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="text-sm text-[#0A0A0F] font-medium">Audit requested! Help us customize it.</p>
        </div>

        {/* Task selection */}
        <p className="text-sm font-semibold text-[#0A0A0F] mb-3">What eats the most time?</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {automationOptions.map(opt => {
            const active = selected.includes(opt)
            return (
              <button key={opt} type="button" onClick={() => toggleOption(opt)}
                className={`text-left rounded-lg p-2.5 border text-xs cursor-pointer transition-all ${
                  active ? 'border-[#B8CF2E] bg-[rgba(213,235,75,0.05)]' : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                }`}>
                <span className="text-[#0A0A0F]">{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Industry */}
        <p className="text-sm font-semibold text-[#0A0A0F] mb-2">Industry</p>
        <select value={industry} onChange={e => setIndustry(e.target.value)}
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[#0A0A0F] text-sm focus:border-[#B8CF2E] outline-none mb-4">
          <option value="">Select industry</option>
          {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setPhase('done')}
            className="text-xs text-[#6B7280] hover:text-[#0A0A0F] cursor-pointer bg-transparent border-none">
            Skip for now
          </button>
          <button type="button" onClick={handleQualifySubmit} disabled={qualifySubmitting}
            className="bg-[#D5EB4B] text-[#0c0c10] font-bold px-6 py-2.5 rounded-xl text-sm hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer">
            {qualifySubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>
    )
  }

  // Phase 1: Contact form
  return (
    <form onSubmit={handleContactSubmit} className="bg-white border border-[#E5E7EB] shadow-xl rounded-2xl p-6">
      <h3 className="text-lg font-bold text-[#0A0A0F] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Claim Your Free Automation Audit
      </h3>
      <p className="text-sm text-[#6B7280] mb-5">30 seconds. Custom roadmap on WhatsApp in 48 hours.</p>
      <div className="flex flex-col gap-3">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors" />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp number"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors" />
        <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name"
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors" />
      </div>
      <button type="button" onClick={() => setWhatsappConsent(!whatsappConsent)}
        className="flex items-center gap-2 mt-3 cursor-pointer bg-transparent border-none p-0">
        <span className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${whatsappConsent ? 'border-[#D5EB4B] bg-[#D5EB4B]' : 'border-[#D1D5DB]'}`}>
          {whatsappConsent && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#0c0c10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </span>
        <span className="text-xs text-[#6B7280]">Send my roadmap on WhatsApp</span>
      </button>
      {formError && <p className="mt-2 text-sm text-[#EF4444]">{formError}</p>}
      <button type="submit" disabled={submitting}
        className="w-full mt-4 bg-[#D5EB4B] text-[#0c0c10] font-bold py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer text-base">
        {submitting ? 'Submitting...' : 'Start My Free Audit'}
      </button>
      <p className="text-center text-xs text-[#6B7280] mt-3">No payment. No obligation. No spam.</p>
    </form>
  )
}

/* ── Hero Section ────────────────────────────────── */

export default function Hero() {
  useEffect(() => {
    const utmContent = new URLSearchParams(window.location.search).get('utm_content') || 'brand-aware'
    trackEvent('hero_view', { awareness_level: utmContent })
  }, [])

  const { main, sub } = getHeadline()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FFFDF7]">
      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #9CA3AF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content — 2 column on desktop */}
      <motion.div
        className="relative z-10 px-4 py-20 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT: Copy */}
        <div>
          {/* Badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[#B8CF2E] text-[#B8CF2E] bg-[rgba(184,207,46,0.08)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              For Growing Indian Businesses
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold max-w-xl leading-[1.1] text-[#0A0A0F]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {main}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-6 text-lg text-[#1F2937] max-w-lg"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {sub}
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-baseline gap-1.5">
                <span className="text-sm text-[#1F2937]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {stat.label}
                </span>
                <AnimatedCounter
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="text-2xl md:text-3xl font-bold text-[#B8CF2E]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Form */}
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <HeroForm />
        </motion.div>
      </motion.div>
    </section>
  )
}
