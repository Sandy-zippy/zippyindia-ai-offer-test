import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import { getUTMParams, getFbcParam, getFbpParam } from '../../lib/analytics'
import { trackQuizStart, trackQuizSubmit } from '../../lib/tracking'

/* ── data ─────────────────────────────────────────── */

const automationOptions = [
  'Complete Lead Flow',
  'Invoice & Payment Processing',
  'Daily, Weekly & Monthly Report Generation',
  'Email & WhatsApp Follow-ups',
  'Customer Engagement & Retention Automation',
  'AI Voice Agent + AI Messaging Agent + Appointment Scheduling',
  'Inventory & Order Management',
  'HR & Payroll Processing',
  'Special Internal Operations',
  'Others',
]

const industryOptions = [
  'Manufacturing',
  'IT/Software',
  'Healthcare',
  'Education',
  'Real Estate',
  'Retail/E-commerce',
  'Professional Services',
  'Construction',
  'Hospitality',
  'Other',
]

/* ── helpers ──────────────────────────────────────── */

function validatePhone(raw: string): boolean {
  const cleaned = raw.replace(/[\s\-+]/g, '').replace(/^91/, '')
  return /^[6-9]\d{9}$/.test(cleaned)
}

function cleanPhone(raw: string): string {
  return raw.replace(/[\s\-+]/g, '').replace(/^91/, '')
}

async function getWaitlistNumber(): Promise<number> {
  try {
    const key = 'zippy_waitlist_counter'
    const current = parseInt(localStorage.getItem(key) || '11', 10)
    const next = current + 1
    localStorage.setItem(key, String(next))
    return next
  } catch { return 12 }
}

/* ── slide variants ───────────────────────────────── */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
}

/* ── sub-components ───────────────────────────────── */

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {[1, 2].map((s) => (
        <div
          key={s}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            s <= step ? 'bg-[#D5EB4B]' : 'bg-[#E5E7EB]'
          }`}
        />
      ))}
    </div>
  )
}

/* Step 1: Contact info (THE LEAD CAPTURE) */
function StepContact({
  name,
  phone,
  email,
  businessName,
  whatsappConsent,
  formError,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onBusinessNameChange,
  onConsentChange,
}: {
  name: string
  phone: string
  email: string
  businessName: string
  whatsappConsent: boolean
  formError: string
  onNameChange: (val: string) => void
  onPhoneChange: (val: string) => void
  onEmailChange: (val: string) => void
  onBusinessNameChange: (val: string) => void
  onConsentChange: (val: boolean) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#0A0A0F] mb-1">
        Get Your Free AI Automation Audit
      </h3>
      <p className="text-sm text-[#6B7280] mb-6">Enter your details. We'll send your custom roadmap on WhatsApp.</p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-[#6B7280] mb-1">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Full name"
            className="w-full bg-white border border-[#E5E7EB] rounded-lg p-4 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#6B7280] mb-1">WhatsApp Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="98765 43210"
            className="w-full bg-white border border-[#E5E7EB] rounded-lg p-4 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#6B7280] mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email address"
            className="w-full bg-white border border-[#E5E7EB] rounded-lg p-4 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-[#6B7280] mb-1">Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
            placeholder="Your company name"
            className="w-full bg-white border border-[#E5E7EB] rounded-lg p-4 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors"
          />
        </div>

        {/* WhatsApp consent */}
        <button
          type="button"
          onClick={() => onConsentChange(!whatsappConsent)}
          className="flex items-start gap-3 text-left mt-1 cursor-pointer bg-transparent border-none p-0"
        >
          <span
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              whatsappConsent ? 'border-[#D5EB4B] bg-[#D5EB4B]' : 'border-[#D1D5DB]'
            }`}
          >
            {whatsappConsent && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#0c0c10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-sm text-[#6B7280]">
            Send me my automation roadmap on WhatsApp
          </span>
        </button>
      </div>

      {formError && (
        <p className="mt-3 text-sm text-[#EF4444]">{formError}</p>
      )}

      <p className="mt-6 text-xs text-[#6B7280] text-center">
        Takes 30 seconds. No payment. No obligation.
      </p>
    </div>
  )
}

/* Step 2: Qualifying questions (OPTIONAL ENRICHMENT) */
function StepQualify({
  selected,
  othersText,
  industry,
  onToggle,
  onOthersChange,
  onIndustryChange,
}: {
  selected: string[]
  othersText: string
  industry: string
  onToggle: (opt: string) => void
  onOthersChange: (val: string) => void
  onIndustryChange: (val: string) => void
}) {
  return (
    <div>
      {/* Success indicator */}
      <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-[rgba(213,235,75,0.1)] border border-[#D5EB4B]/30">
        <div className="w-6 h-6 rounded-full bg-[#D5EB4B] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7L6 10L11 4" stroke="#0c0c10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm text-[#0A0A0F] font-medium">Your audit request is in! Help us customize it.</p>
      </div>

      {/* Automation areas */}
      <h3 className="text-lg font-semibold text-[#0A0A0F] mb-1">
        Which tasks eat the most time?
      </h3>
      <p className="text-sm text-[#6B7280] mb-4">Pick all that apply. No wrong answers.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {automationOptions.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`flex items-start gap-3 text-left rounded-xl p-4 border cursor-pointer transition-all duration-200 ${
                active
                  ? 'border-[#B8CF2E] bg-[rgba(213,235,75,0.05)]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
              }`}
            >
              <span
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  active ? 'border-[#D5EB4B] bg-[#D5EB4B]' : 'border-[#D1D5DB]'
                }`}
              >
                {active && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#0c0c10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-[#0A0A0F]">{opt}</span>
            </button>
          )
        })}
      </div>
      {selected.includes('Others') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <input
            type="text"
            value={othersText}
            onChange={(e) => onOthersChange(e.target.value)}
            placeholder="Describe what you want to automate..."
            className="w-full bg-white border border-[#E5E7EB] rounded-lg p-4 text-[#0A0A0F] text-sm placeholder:text-[#9CA3AF] focus:border-[#B8CF2E] focus:ring-1 focus:ring-[#B8CF2E] outline-none transition-colors"
          />
        </motion.div>
      )}

      {/* Industry */}
      <label className="block text-sm text-[#6B7280] mb-3">What's your industry?</label>
      <div className="grid grid-cols-2 gap-2">
        {industryOptions.map((opt) => {
          const active = industry === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onIndustryChange(opt)}
              className={`text-left rounded-xl p-3 border cursor-pointer transition-all duration-200 ${
                active
                  ? 'border-[#B8CF2E] bg-[rgba(213,235,75,0.05)]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
              }`}
            >
              <span className="text-sm text-[#0A0A0F]">{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ThankYou({ waitlistNum }: { waitlistNum: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#D5EB4B] flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 16L14 22L24 10" stroke="#0c0c10" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#0A0A0F] mb-2">You're In!</h3>
      <p className="text-4xl font-bold text-[#B8CF2E] mb-3">#{waitlistNum}</p>
      <p className="text-sm text-[#6B7280] mb-6">
        Check your WhatsApp. Your automation roadmap is on its way.
      </p>

      <div className="bg-[rgba(213,235,75,0.05)] border border-[#E5E7EB] rounded-2xl p-6 text-left">
        <h4 className="text-lg font-bold text-[#0A0A0F] mb-4">What happens next?</h4>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D5EB4B] text-[#0c0c10] font-bold flex items-center justify-center text-sm">1</span>
            <div>
              <p className="text-sm font-medium text-[#0A0A0F]">WhatsApp confirmation</p>
              <p className="text-xs text-[#6B7280]">You'll get a message within minutes</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D5EB4B] text-[#0c0c10] font-bold flex items-center justify-center text-sm">2</span>
            <div>
              <p className="text-sm font-medium text-[#0A0A0F]">We audit your operations</p>
              <p className="text-xs text-[#6B7280]">Manual review by our team within 48 hours</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D5EB4B] text-[#0c0c10] font-bold flex items-center justify-center text-sm">3</span>
            <div>
              <p className="text-sm font-medium text-[#0A0A0F]">Custom roadmap on WhatsApp</p>
              <p className="text-xs text-[#6B7280]">Exactly what to automate, how much it saves, and how fast</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── main component ──────────────────────────────── */

export default function QuizForm() {
  // If hero form already submitted, skip to qualify
  const heroAlreadySubmitted = typeof window !== 'undefined' && localStorage.getItem('zippy_hero_submitted') === 'true'
  const [phase, setPhase] = useState<'contact' | 'qualify' | 'done'>(heroAlreadySubmitted ? 'qualify' : 'contact')
  const [direction, setDirection] = useState(1)

  // Contact fields (step 1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [whatsappConsent, setWhatsappConsent] = useState(true)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Qualifying fields (step 2)
  const [selected, setSelected] = useState<string[]>([])
  const [othersText, setOthersText] = useState('')
  const [industry, setIndustry] = useState('')
  const [qualifySubmitting, setQualifySubmitting] = useState(false)

  const [waitlistNum, setWaitlistNum] = useState(0)

  // track quiz start (once)
  const quizStarted = useRef(false)
  useEffect(() => {
    if (!quizStarted.current) {
      quizStarted.current = true
      trackQuizStart()
    }
  }, [])

  /* toggle helpers */
  function toggleOption(opt: string) {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    )
  }

  /* Step 1 submit: capture lead immediately */
  async function handleContactSubmit() {
    setFormError('')
    if (!name.trim()) { setFormError('Name is required'); return }
    if (!phone.trim() || !validatePhone(phone)) { setFormError('Enter a valid 10-digit Indian mobile number'); return }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setFormError('Valid email address required'); return }
    if (!businessName.trim()) { setFormError('Business name is required'); return }

    setSubmitting(true)

    const payload = {
      name: name.trim(),
      phone: cleanPhone(phone),
      email: email.trim(),
      business_name: businessName.trim(),
      whatsapp_consent: whatsappConsent,
      source: 'automation-lp-v5',
      event_id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      client_user_agent: navigator.userAgent,
      page_url: window.location.href,
      fbp: getFbpParam(),
      fbc: getFbcParam(),
      visit_count: parseInt(localStorage.getItem('zippy_visit_count') || '1', 10),
      time_on_page: Math.round((Date.now() - ((window as any).__pageLoadTime || Date.now())) / 1000),
      ...getUTMParams(),
    }

    // localStorage backup
    try { localStorage.setItem(`zippy_lead_${Date.now()}`, JSON.stringify(payload)) } catch {}

    // Push to API
    const url = 'https://script.google.com/macros/s/AKfycbzzacqtwW_Wfk3EB-4WmCQrNFK92yeT2ziRNJvV4Ujy_468HHwCRHiGN0OkxTMLZyKJKQ/exec'
    try {
      await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } catch {
      try { navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], { type: 'application/json' })) } catch {}
    }

    trackQuizSubmit({ lead_source: 'automation-lp-v5', event_id: payload.event_id, step: 'contact' })
    trackQuizProgress(1, { step_name: 'contact_captured' })
    const num = await getWaitlistNumber()
    setWaitlistNum(num)
    window.dispatchEvent(new Event('waitlist-updated'))
    setSubmitting(false)
    setDirection(1)
    setPhase('qualify')
  }

  /* Step 2 submit: enrich the lead */
  async function handleQualifySubmit() {
    setQualifySubmitting(true)

    const areas = selected.map((s) => (s === 'Others' ? `Others: ${othersText}` : s))
    const enrichPayload = {
      phone: cleanPhone(phone) || localStorage.getItem('zippy_hero_phone') || '',
      automate_areas: areas.join(', '),
      industry,
      source: 'automation-lp-v5-enrich',
      event_id: `enrich_${Date.now()}`,
    }

    const url = 'https://script.google.com/macros/s/AKfycbzzacqtwW_Wfk3EB-4WmCQrNFK92yeT2ziRNJvV4Ujy_468HHwCRHiGN0OkxTMLZyKJKQ/exec'
    try {
      await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(enrichPayload) })
    } catch {}

    trackQuizProgress(2, { step_name: 'qualifying_complete', areas_count: selected.length, industry })
    setQualifySubmitting(false)
    setDirection(1)
    setPhase('done')
  }

  /* Skip step 2 */
  function skipQualify() {
    setDirection(1)
    setPhase('done')
  }

  const currentStep = phase === 'contact' ? 1 : 2

  /* ── main render ────────────────────────────────── */
  return (
    <section id="quiz" className="bg-gradient-to-b from-[#1A1A2E] via-[#2A2A35] to-[#1A1A2E] py-20 px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <ScrollReveal>
          <span className="text-center font-mono text-xs uppercase tracking-widest mb-4 text-[#D5EB4B] inline-block">
            Start Here
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Find Out What You Can Automate
          </h2>
          <p className="text-[#9CA3AF]">
            2 quick steps. Get a custom automation audit for your business.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <div className="max-w-2xl mx-auto relative">
          {/* Lime glow behind card */}
          <div className="absolute -inset-6 bg-[#D5EB4B]/15 rounded-[2rem] blur-3xl pointer-events-none" />
          {/* Card */}
          <div className="relative bg-white border-2 border-[#D5EB4B]/30 shadow-2xl shadow-[#D5EB4B]/10 rounded-2xl p-6 sm:p-8">
          {phase === 'done' ? (
            <ThankYou waitlistNum={waitlistNum} />
          ) : (
            <>
              <ProgressBar step={currentStep} />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={phase}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {phase === 'contact' && (
                    <StepContact
                      name={name}
                      phone={phone}
                      email={email}
                      businessName={businessName}
                      whatsappConsent={whatsappConsent}
                      formError={formError}
                      onNameChange={setName}
                      onPhoneChange={setPhone}
                      onEmailChange={setEmail}
                      onBusinessNameChange={setBusinessName}
                      onConsentChange={setWhatsappConsent}
                    />
                  )}
                  {phase === 'qualify' && (
                    <StepQualify
                      selected={selected}
                      othersText={othersText}
                      industry={industry}
                      onToggle={toggleOption}
                      onOthersChange={setOthersText}
                      onIndustryChange={setIndustry}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                {phase === 'contact' ? (
                  <>
                    <span />
                    <button
                      type="button"
                      onClick={handleContactSubmit}
                      disabled={submitting}
                      className="flex-1 bg-[#D5EB4B] text-[#0c0c10] font-bold py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {submitting ? 'Submitting...' : 'Send Me My Roadmap'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={skipQualify}
                      className="text-sm text-[#6B7280] hover:text-[#0A0A0F] transition-colors cursor-pointer"
                    >
                      Skip for now
                    </button>
                    <button
                      type="button"
                      onClick={handleQualifySubmit}
                      disabled={qualifySubmitting}
                      className="bg-[#D5EB4B] text-[#0c0c10] font-bold px-8 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {qualifySubmitting ? 'Submitting...' : 'Submit Details'}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
