import React from 'react';

const Hero: React.FC = () => {
  const SCHEDULING_LINK = "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-6a757c77-b1e8-4f09-9814-f9256b2213ed";

  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden gradient-bg">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Nearly 20 Years of Faithful Digital Stewardship</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Expanding Your <br />
              <span className="text-amber-500">Kingdom Impact</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-xl mx-auto lg:mx-0">
              We empower churches and ministries to reach more souls through intentional Search Visibility, Electronic Evangelism, and Pastoral Care Systems. Your calling deserves a global stage.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <a 
                href={SCHEDULING_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl shadow-amber-500/20"
              >
                Schedule Ministry Demo
              </a>
              <a href="#pricing" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-lg font-bold text-lg transition-all backdrop-blur-sm">
                View Outreach Plans
              </a>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1544427928-c49cdfb81949?auto=format&fit=crop&q=80&w=800" 
                alt="Worship and Connection" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-2xl z-20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">450%</div>
                  <div className="text-sm text-slate-500">Avg. Congregational Reach</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;