import React from 'react';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const LOGO_URL = "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/ysdCFupPEEPdGlWw2bqR/media/67efff89544d821e861dd115.jpeg";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <a href="#home" className="flex items-center space-x-3 group cursor-pointer">
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all group-hover:scale-105 ${scrolled ? 'border-indigo-900/10' : 'border-white/20'}`}>
              <img src={LOGO_URL} alt="Grow Ministry Logo" className="w-full h-full object-cover" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-indigo-900' : 'text-white'}`}>
              GROW<span className="text-amber-500">MINISTRY</span>
            </span>
          </a>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#home" className={`${scrolled ? 'text-slate-600' : 'text-white/90'} hover:text-amber-500 transition-colors font-medium`}>Home</a>
            <a href="#services" className={`${scrolled ? 'text-slate-600' : 'text-white/90'} hover:text-amber-500 transition-colors font-medium`}>Services</a>
            <a href="#pricing" className={`${scrolled ? 'text-slate-600' : 'text-white/90'} hover:text-amber-500 transition-colors font-medium`}>Pricing</a>
            <a href="#ai-tool" className={`${scrolled ? 'text-slate-600' : 'text-white/90'} hover:text-amber-500 transition-colors font-medium`}>AI Growth Lab</a>
            <a href="#contact" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;