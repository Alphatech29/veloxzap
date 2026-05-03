

import {
  Gift, Receipt, Smartphone, CreditCard, ShieldCheck, Zap, BarChart3,
  Lock, Clock, Star, Users, CheckCircle,
} from 'lucide-react'
import { colors } from './theme'

export const liveRates = [
  { name: 'Amazon GC', price: '₦945 / USD', color: colors.gold,      change: '+0.8%' },
  { name: 'iTunes GC', price: '₦930 / USD', color: colors.champagne, change: '+0.5%' },
  { name: 'Steam GC',  price: '₦904 / USD', color: colors.gold,      change: '+0.3%' },
]

export const quickActions = [
  { icon: Gift,       label: 'Gift Cards' },
  { icon: Receipt,    label: 'Bills'      },
  { icon: Smartphone, label: 'Airtime'    },
  { icon: CreditCard, label: 'Visa Card'  },
]

export const tickerItems = [
  { label: 'Amazon $100',    value: '→ ₦94,500',  change: '+0.8%' },
  { label: 'iTunes $50',     value: '→ ₦46,500',  change: '+0.5%' },
  { label: 'Steam $50',      value: '→ ₦45,200',  change: ''       },
  { label: 'Google Play $50', value: '→ ₦45,500', change: ''       },
  { label: 'DSTV Compact',   value: '₦11,800',     change: ''       },
  { label: 'GOTV Max',       value: '₦5,500',      change: ''       },
  { label: 'MTN 1GB Data',   value: '₦350',        change: ''       },
  { label: 'Airtel Airtime', value: '5% bonus',    change: '+5%'    },
  { label: 'IKEDC Prepaid',  value: '₦5,000',      change: ''       },
  { label: 'Netflix $50',    value: '→ ₦46,000',   change: ''       },
  { label: 'Visa Card',      value: 'Instant USD', change: ''       },
  { label: 'Spotify $25',    value: '→ ₦23,000',   change: ''       },
]

export const floatingChips = [
  { icon: Gift,       title: 'Amazon', value: '₦945 / USD',    color: colors.gold,      position: { left: 'calc(50% - 460px)', top: 30 },    delay: 0.25, drift: 14 },
  { icon: Receipt,    title: 'DSTV',   value: '₦11,800',       color: colors.champagne, position: { left: 'calc(50% + 280px)', top: 60 },    delay: 0.5,  drift: 16 },
  { icon: Smartphone, title: 'MTN',    value: 'Airtime/Data',  color: colors.gold,      position: { left: 'calc(50% - 480px)', bottom: 60 }, delay: 0.4,  drift: 12 },
  { icon: CreditCard, title: 'Visa',   value: 'Spend Globally', color: colors.champagne, position: { left: 'calc(50% + 260px)', bottom: 40 }, delay: 0.6,  drift: 18 },
]

export const trustItems = [
  { icon: ShieldCheck, label: 'CBN Licensed' },
  { icon: Lock,        label: 'SSL Encrypted' },
  { icon: Clock,       label: 'Instant Payouts' },
  { icon: Star,        label: '4.9★ Rating' },
]

export const stats = [
  { end: 500000, prefix: '',  suffix: '+',  label: 'Active Users'    },
  { end: 50,     prefix: '₦', suffix: 'B+', label: 'Naira Processed' },
  { end: 200,    prefix: '',  suffix: '+',  label: 'Gift Card Brands' },
  { end: 99.9,   prefix: '',  suffix: '%',  label: 'Uptime', decimals: 1 },
]

export const services = [
  {
    icon: Gift,
    title: 'Buy & Sell Gift Cards',
    desc: 'Trade Amazon, iTunes, Steam, Google Play and 200+ other brands at the best naira rates in Nigeria.',
    highlights: ['200+ brands accepted', 'Verified in 15 seconds', 'Instant naira credit'],
    accent: colors.gold,
    href: '/gift-cards',
  },
  {
    icon: Receipt,
    title: 'Pay Bills',
    desc: 'Settle DSTV, GOTV, electricity, internet, school fees and government levies — all in one app.',
    highlights: ['100+ billers supported', 'Paid in under 5 seconds', 'Auto-receipt for every payment'],
    accent: colors.champagne,
    href: '/bills',
  },
  {
    icon: Smartphone,
    title: 'Airtime & Data',
    desc: 'Top up MTN, Airtel, Glo, and 9mobile airtime or data bundles instantly. Earn cashback on every recharge.',
    highlights: ['All four networks', '5% cashback on data', 'One-tap repeat top-ups'],
    accent: colors.gold,
    href: '/airtime',
  },
  {
    icon: CreditCard,
    title: 'Virtual Card · Spend Globally',
    desc: 'Create a Visa virtual card in seconds. Fund in naira, spend in dollars — anywhere Visa is accepted.',
    highlights: ['Instant card creation', 'Works on Amazon, Netflix, Fiverr', 'Freeze or delete anytime'],
    accent: colors.champagne,
    href: '/virtual-card',
  },
]

export const steps = [
  { number: 1, icon: Users,       title: 'Create account',     desc: 'Sign up with email or phone in 60 seconds. No paperwork.',          color: colors.gold      },
  { number: 2, icon: Gift,        title: 'Pick a service',     desc: 'Sell a card, pay a bill, top up airtime, or fund a card.',          color: colors.champagne },
  { number: 3, icon: Zap,         title: 'Confirm in seconds', desc: 'Our system verifies and processes your request instantly.',         color: colors.gold      },
  { number: 4, icon: CheckCircle, title: 'Get paid in naira',  desc: 'Funds hit your wallet — withdraw to any Nigerian bank.',            color: colors.champagne },
]

export const pillars = [
  { icon: ShieldCheck, title: 'Bank-grade security',    desc: '256-bit SSL, biometric auth, and AI fraud detection on every transaction.', metric: '256-bit', metricLabel: 'Encryption' },
  { icon: Zap,         title: 'Lightning-fast payouts', desc: 'Most transactions complete in under 2 seconds — every day, around the clock.', metric: '< 2s',   metricLabel: 'Avg payout' },
  { icon: BarChart3,   title: 'Always the best rates',  desc: 'Live rates aggregated from 50+ sources to guarantee the best naira value.',     metric: '50+',     metricLabel: 'Rate sources' },
]

export const testimonials = [
  { name: 'Emeka O.', role: 'Freelancer',    stars: 5, quote: 'Sold my $100 Amazon card in 20 seconds and got ₦94,500. Best rate I have ever seen on any platform.' },
  { name: 'Amina K.', role: 'Student',        stars: 5, quote: 'I top up MTN data and pay my DSTV from one app. The 5% data bonus alone saves me thousands every month.' },
  { name: 'Chidi M.', role: 'Business owner', stars: 5, quote: 'My virtual card pays for Shopify, Fiverr and Adobe. Funded in naira, billed in dollars. It just works.' },
]

export const faqs = [
  { question: 'How long does a gift card payout take?',        answer: 'Most payouts complete in 15–30 seconds. Once the card is verified, naira is credited to your wallet immediately and you can withdraw to any Nigerian bank instantly.' },
  { question: 'Which gift card brands do you accept?',          answer: 'We accept 200+ brands including Amazon, iTunes, Google Play, Steam, Xbox, Netflix, Spotify, eBay, Walmart and many more.' },
  { question: 'Are there any platform fees?',                   answer: 'Zero platform fees. The rate you see is exactly what you receive — no hidden charges and no deductions, ever.' },
  { question: 'Is VeloxZap regulated and safe?',                answer: 'Yes. VeloxZap is CBN licensed, ISO 27001 certified and PCI DSS compliant. All transactions are end-to-end encrypted.' },
  { question: 'Can the virtual card be used internationally?',  answer: 'Absolutely. Your VeloxZap Visa virtual card works on any Visa-enabled platform globally — Amazon, Netflix, Shopify, Fiverr, Adobe and more.' },
]
