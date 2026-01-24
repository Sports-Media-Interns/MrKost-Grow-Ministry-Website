
import React from 'react';

const Footer: React.FC = () => {
  const LOGO_URL = "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/ysdCFupPEEPdGlWw2bqR/media/67efff89544d821e861dd115.jpeg";

  return (
    <footer className="bg-slate-950 text-white py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                <img src={LOGO_URL} alt="Grow Ministry Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-3xl font-bold tracking-tight">
                GROW<span className="text-amber-500">MINISTRY</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
              Nearly 20 years of faithful stewardship, helping ministries navigate the digital frontier with heart and technical excellence.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-white/10 transition-all border border-white/10">
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.411 2.865 8.146 6.839 9.465.111.021.222.031.332.031.428 0 .78-.344.78-.772v-1.761c-2.783.605-3.37-1.341-3.37-1.341-.456-1.157-1.112-1.465-1.112-1.465-.908-.62.069-.607.069-.607 1.004.07 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.831.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025.798-.222 1.653-.333 2.503-.337.849.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852v2.747c0 .432.352.783.788.783.11 0 .219-.01.328-.031 3.974-1.319 6.839-5.054 6.839-9.465 0-5.523-4.477-10-10-10z"/></svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Outreach Case Studies</a></li>
              <li><a href="#services" className="hover:text-amber-500 transition-colors">Our Ministry Services</a></li>
              <li><a href="#ai-tool" className="hover:text-amber-500 transition-colors">AI Outreach Lab</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Pastoral Resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy & Stewardship</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Terms of Partnership</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-white/5 text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Grow Ministry. All rights reserved.</p>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <p className="font-bold uppercase tracking-widest text-[10px]">Faith-Aligned Technology</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
