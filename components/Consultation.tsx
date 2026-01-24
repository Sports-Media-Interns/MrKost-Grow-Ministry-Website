
import React from 'react';

const Consultation: React.FC = () => {
  const SCHEDULING_LINK = "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-6a757c77-b1e8-4f09-9814-f9256b2213ed";

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold uppercase tracking-widest">
              🎯 See Your Ministry's Digital Future
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Ready to witness the impact first-hand?
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Schedule a personal demonstration where we'll show you exactly how these tools can transform your ministry's impact and help you reach more souls for Christ. No obligation - just discover the possibilities.
            </p>
            <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-amber-500">
              <blockquote className="italic text-slate-700 text-lg">
                "The demo opened our eyes to possibilities we never knew existed. Within 3 months, we had doubled our online engagement and welcomed 25 new families!"
              </blockquote>
              <p className="mt-4 font-bold text-slate-900">— Pastor Michael Torres</p>
            </div>
            <div>
              <a 
                href={SCHEDULING_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-indigo-900 hover:bg-indigo-950 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg"
              >
                <span>Book Free Discovery Call</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide">📅 Schedule Your Free Ministry Consultation</h3>
              <p className="text-indigo-300 text-sm mb-8">Available Monday-Friday, 9 AM - 6 PM EST | Usually within 24 hours</p>
              
              <div className="space-y-6">
                <p className="text-slate-300 leading-relaxed italic">
                  Join hundreds of other pastors and ministry leaders who have used our free discovery calls to find new ways to connect with their local community.
                </p>
                <a 
                  href={SCHEDULING_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-5 rounded-xl transition-all shadow-xl shadow-amber-500/20 text-lg"
                >
                  Go to Calendar & Book Demo
                </a>
                <div className="pt-4 flex justify-center space-x-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
                  <span>✓ 30 Minute Discovery</span>
                  <span>✓ Live Platform Demo</span>
                  <span>✓ Custom Roadmap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consultation;
