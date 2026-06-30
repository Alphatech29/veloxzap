

import SEO from '../components/SEO'
import Background      from '../components/landing/Background'
import Hero            from '../components/landing/Hero'
import Stage3D         from '../components/landing/Stage3D'
import ServicesSection from '../components/landing/ServicesSection'
import HowItWorks      from '../components/landing/HowItWorks'
import WhyVeloxZap     from '../components/landing/WhyVeloxZap'
import Testimonials    from '../components/landing/Testimonials'
import FinalCTA        from '../components/landing/FinalCTA'
import Ticker          from '../components/landing/Ticker'

export default function HomePage() {
  return (
    <main className="main-offset" style={{ position: 'relative' }}>
      <SEO
        title="Nigeria's Fastest Digital Wallet"
        description="VeloxZap is Nigeria's fastest digital wallet. Trade gift cards, buy airtime & data, pay bills, exchange crypto, and spend globally with your virtual dollar card. Zero fees, instant payouts."
        path="/"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "VeloxZap",
              "url": "https://veloxzap.com",
              "logo": "https://veloxzap.com/logo-2.png",
              "sameAs": ["https://twitter.com/veloxzap", "https://instagram.com/veloxzap", "https://facebook.com/veloxzap", "https://linkedin.com/company/veloxzap"],
              "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "availableLanguage": ["English", "Yoruba", "Igbo", "Hausa"] }
            },
            {
              "@type": "WebSite",
              "name": "VeloxZap",
              "url": "https://veloxzap.com",
              "potentialAction": { "@type": "SearchAction", "target": "https://veloxzap.com/blog?q={search_term_string}", "query-input": "required name=search_term_string" }
            }
          ]
        }}
      />
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <Background />

        
        <Ticker />
        
        
        <Hero />

        
        <Stage3D />

        
        <ServicesSection />

        
        <HowItWorks />

        
        <WhyVeloxZap />

        
        <Testimonials />


        <FinalCTA />

      </section>
    </main>
  )
}
