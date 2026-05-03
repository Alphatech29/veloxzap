

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
