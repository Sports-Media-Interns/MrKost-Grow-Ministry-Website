
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Consultation from './components/Consultation';
import AIStrategyTool from './components/AIStrategyTool';
import ExperienceSection from './components/ExperienceSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SupportAgent from './components/SupportAgent';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar scrolled={scrolled} />
      <main className="flex-grow">
        <Hero />
        <ExperienceSection />
        <Services />
        <Pricing />
        <Consultation />
        <AIStrategyTool />
        <Contact />
      </main>
      <Footer />
      <SupportAgent />
    </div>
  );
};

export default App;
