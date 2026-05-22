import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Lock, Eye, EyeOff, Phone, Gift,
  ArrowRight, Loader2, HelpCircle, Apple,
  ShieldCheck, Sparkles, CreditCard, Wifi, Receipt,
  TrendingUp, Star, CheckCircle2, Globe, ChevronDown, Search, Check,
} from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'
import useRegister from '../hooks/useRegister'

const FLOATERS = [
  { Icon: Gift,        title: 'Gift card sold',   meta: 'Amazon · ₦82,400 received',  cls: 'vrx-float-1' },
  { Icon: CreditCard,  title: 'Virtual card top-up', meta: '$200 · Instantly funded', cls: 'vrx-float-2' },
  { Icon: Wifi,        title: 'Airtime delivered', meta: 'MTN · ₦5,000 in 2.1s',      cls: 'vrx-float-3' },
]

const STATS = [
  { num: '500K',   suffix: '+', label: 'Active users' },
  { num: '₦12B',   suffix: '+', label: 'Processed' },
  { num: '4.9',    suffix: '★', label: 'App rating' },
]

export default function Register() {
  const {
    first, setFirst,
    last,  setLast,
    email, setEmail,
    phone, onPhoneChange,
    password, setPassword,
    referral, onReferralChange,
    show, toggleShow,
    agree, setAgree,
    score, strengthHint,
    loading, error,
    handleSubmit,
    countryPicker: {
      country, selectCountry,
      filtered: filteredCountries,
      pickerOpen, togglePicker,
      query, setQuery,
      pickerRef,
      flagUrl, flagSrcSet,
    },
  } = useRegister()

  return (
    <div className="vrx-stage">
      
      <div className="vrx-aurora vrx-aurora-a" aria-hidden />
      <div className="vrx-aurora vrx-aurora-b" aria-hidden />
      <div className="vrx-aurora vrx-aurora-c" aria-hidden />
      <div className="vrx-grain" aria-hidden />
      <div className="vrx-mark"  aria-hidden>VELOXZAP</div>

      
      <header className="vrx-top">
        <Link to="/" className="vrx-brand">
          <img src="/logo-2.png" alt="VeloxZap" className="vrx-brand-logo" />
        </Link>
        <Link to="/help" className="vrx-help" aria-label="Help center">
          <HelpCircle size={14} /> <span>Help center</span>
        </Link>
      </header>

      
      <div className="vrx-shell">

        
        <motion.aside
          className="vrx-showcase"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="vrx-show-eyebrow">
            <Sparkles size={12} /> Join the movement
          </span>

          <h2 className="vrx-show-title">
            Money at the speed of <span className="vrx-show-title-grad">light.</span>
          </h2>

          <p className="vrx-show-sub">
            Africa's most loved platform for gift cards, virtual cards, bills, and airtime.
            Built for the bold. Trusted by half a million Nigerians.
          </p>

          {/* Floating glass cards */}
          <div className="vrx-float-stack" aria-hidden>
            {FLOATERS.map(({ Icon, title, meta, cls }) => (
              <div key={cls} className={`vrx-float-card ${cls}`}>
                <span className="vrx-float-card-icon"><Icon size={18} /></span>
                <div>
                  <div className="vrx-float-card-title">{title}</div>
                  <div className="vrx-float-card-meta">{meta}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="vrx-stats">
            {STATS.map(({ num, suffix, label }) => (
              <div key={label}>
                <div className="vrx-stat-num">{num}<span>{suffix}</span></div>
                <div className="vrx-stat-lbl">{label}</div>
              </div>
            ))}
          </div>

          {/* Avatar pile */}
          <div className="vrx-pile">
            <div className="vrx-pile-avs">
              {['A', 'O', 'C', 'M'].map(letter => (
                <span key={letter} className="vrx-pile-av">{letter}</span>
              ))}
            </div>
            <div className="vrx-pile-text">
              <strong>+1,240 joined</strong> this week
            </div>
          </div>
        </motion.aside>

        {/* ═══ RIGHT: Form card ═══ */}
        <motion.div
          className="vrx-form-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="vrx-form-halo" aria-hidden />

          <div className="vrx-card">
            <span className="vrx-card-eyebrow">
              <TrendingUp size={11} /> Free forever · No card required
            </span>

            <h1 className="vrx-card-title">
              Create your <span>account</span>
            </h1>
            <p className="vrx-card-sub">
              Already have one?{' '}
              <Link to="/auth/login" className="text-brand-gold-soft font-semibold hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="vrx-field">
                  <User size={16} className="vrx-icon" />
                  <input
                    id="first"
                    type="text"
                    autoComplete="given-name"
                    placeholder=" "
                    value={first}
                    onChange={e => setFirst(e.target.value)}
                    className="vrx-input"
                  />
                  <label htmlFor="first" className="vrx-label">First name</label>
                </div>
                <div className="vrx-field">
                  <User size={16} className="vrx-icon" />
                  <input
                    id="last"
                    type="text"
                    autoComplete="family-name"
                    placeholder=" "
                    value={last}
                    onChange={e => setLast(e.target.value)}
                    className="vrx-input"
                  />
                  <label htmlFor="last" className="vrx-label">Last name</label>
                </div>
              </div>

              {/* Email */}
              <div className="vrx-field">
                <Mail size={16} className="vrx-icon" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder=" "
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="vrx-input"
                />
                <label htmlFor="email" className="vrx-label">Email address</label>
              </div>

              {/* Country picker */}
              <div className="vrx-field" ref={pickerRef}>
                <Globe size={16} className="vrx-icon" />
                <button
                  type="button"
                  onClick={togglePicker}
                  aria-haspopup="listbox"
                  aria-expanded={pickerOpen}
                  className="vrx-input flex items-center justify-between text-left"
                  style={{ paddingTop: 22, paddingBottom: 6 }}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <img
                      src={flagUrl(country.code, 40)}
                      srcSet={flagSrcSet(country.code, 40)}
                      alt=""
                      width={20}
                      height={15}
                      className="shrink-0 rounded-[2px] object-cover"
                      style={{ width: 20, height: 15 }}
                    />
                    <span className="truncate">{country.name}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-text-muted transition-transform shrink-0 ${pickerOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <span className="vrx-label" style={{ top: 5, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-brand-gold-soft)', fontWeight: 600 }}>
                  Country
                </span>

                <AnimatePresence>
                  {pickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      role="listbox"
                      className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border overflow-hidden"
                      style={{
                        background: 'color-mix(in srgb, var(--color-brand-primary) 92%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--color-text) 12%, transparent)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 40px -12px rgba(0,0,0,0.45), 0 0 0 1px color-mix(in srgb, var(--color-brand-accent) 8%, transparent)',
                      }}
                    >
                      <div className="relative p-2 border-b" style={{ borderColor: 'color-mix(in srgb, var(--color-text) 8%, transparent)' }}>
                        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          autoFocus
                          type="text"
                          value={query}
                          onChange={e => setQuery(e.target.value)}
                          placeholder="Search country or dial code…"
                          className="w-full rounded-lg pl-8 pr-3 py-2 text-sm outline-none border"
                          style={{
                            background: 'color-mix(in srgb, var(--color-brand-primary) 60%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--color-text) 8%, transparent)',
                            color: 'var(--color-text)',
                          }}
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto py-1">
                        {filteredCountries.length === 0 && (
                          <div className="px-4 py-6 text-center text-xs text-text-muted">No countries match "{query}"</div>
                        )}
                        {filteredCountries.map(c => {
                          const selected = c.code === country.code
                          return (
                            <button
                              key={c.code}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              onClick={() => selectCountry(c)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-white/5"
                              style={selected ? { background: 'color-mix(in srgb, var(--color-brand-accent) 12%, transparent)' } : undefined}
                            >
                              <img
                                src={flagUrl(c.code, 40)}
                                srcSet={flagSrcSet(c.code, 40)}
                                alt=""
                                width={22}
                                height={16}
                                loading="lazy"
                                className="shrink-0 rounded-[2px] object-cover"
                                style={{ width: 22, height: 16 }}
                              />
                              <span className="flex-1 text-left truncate">{c.name}</span>
                              <span className="text-xs text-text-muted shrink-0">{c.dial}</span>
                              {selected && <Check size={14} className="text-brand-gold-soft shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Phone with dynamic dial-code prefix */}
              <div className={`vrx-field vrx-field-tel ${phone ? 'vrx-filled' : ''}`}>
                <Phone size={16} className="vrx-icon" />
                <span className="vrx-prefix">{country.dial}</span>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel-national"
                  placeholder=" "
                  value={phone}
                  onChange={onPhoneChange}
                  className="vrx-input vrx-input-tel"
                />
                <label htmlFor="phone" className="vrx-label">Phone number</label>
              </div>

              {/* Password */}
              <div>
                <div className="vrx-field">
                  <Lock size={16} className="vrx-icon" />
                  <input
                    id="password"
                    type={show ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder=" "
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="vrx-input pr-12"
                  />
                  <label htmlFor="password" className="vrx-label">Password</label>
                  <button
                    type="button"
                    onClick={toggleShow}
                    className="vrx-eye"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="vrx-strength" aria-hidden={!password}>
                  <div className="vrx-strength-track">
                    {[0, 1, 2, 3].map(i => (
                      <span
                        key={i}
                        className="vrx-strength-seg"
                        data-on={i < score}
                        data-level={score}
                      />
                    ))}
                  </div>
                  <span className="vrx-strength-label" data-level={score}>
                    {strengthHint}
                  </span>
                </div>
              </div>

              {/* Referral */}
              <div className="vrx-field">
                <Gift size={16} className="vrx-icon" />
                <input
                  id="referral"
                  type="text"
                  placeholder=" "
                  value={referral}
                  onChange={onReferralChange}
                  className="vrx-input"
                  maxLength={12}
                />
                <label htmlFor="referral" className="vrx-label">Referral code (optional)</label>
              </div>

              {/* Terms */}
              <label className="vrx-check-wrap">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                />
                <span className="vrx-check-box" />
                <span className="vrx-check-text">
                  I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                  <Link to="/privacy">Privacy Policy</Link>.
                </span>
              </label>

              {error && (
                <div className="vrx-err" role="alert">
                  <CheckCircle2 size={14} className="rotate-45" /> {error}
                </div>
              )}

              {/* CTA */}
              <button type="submit" className="vrx-cta" disabled={loading}>
                <span className="vrx-cta-shimmer" aria-hidden />
                {loading ? 'Creating account…' : 'Create free account'}
                {loading
                  ? <Loader2 size={16} className="vrx-spin" />
                  : <ArrowRight size={16} />}
              </button>

              {/* Divider */}
              <div className="vrx-divider"><span>or sign up with</span></div>

              {/* OAuth */}
              <div className="vrx-oauth">
                <button type="button" className="vrx-oauth-btn">
                  <FaGoogle size={15} /> Google
                </button>
                <button type="button" className="vrx-oauth-btn">
                  <Apple size={15} /> Apple
                </button>
              </div>

              <p className="vrx-secure justify-center mt-2">
                <ShieldCheck size={12} /> Bank-grade encryption · Your data is never sold
              </p>
            </form>
          </div>

          {/* Mobile-only quick stats below form */}
          <div className="lg:hidden flex items-center justify-center gap-5 mt-6 text-xs text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Star size={11} className="text-brand-accent" /> 4.9 rating
            </span>
            <span className="opacity-30">·</span>
            <span>500K+ users</span>
            <span className="opacity-30">·</span>
            <span>CAC Approval</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="vrx-foot pb-8 px-6 lg:pb-10">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-xs">© {new Date().getFullYear()} VeloxZap Technologies Ltd.</span>
          <Link to="/terms" className="text-xs">Terms</Link>
          <Link to="/privacy" className="text-xs">Privacy</Link>
          <Link to="/aml" className="text-xs">AML</Link>
        </div>
      </footer>
    </div>
  )
}
