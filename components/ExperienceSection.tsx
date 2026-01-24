
import React from 'react';

const ExperienceSection: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
             <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=400" className="rounded-2xl mt-8" alt="Sanctuary Service" />
                <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=400" className="rounded-2xl" alt="Fellowship" />
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-900 text-white p-8 rounded-full h-32 w-32 flex flex-col items-center justify-center border-8 border-white shadow-xl">
                <span className="text-2xl font-bold">20</span>
                <span className="text-xs uppercase tracking-widest">Years</span>
             </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              Serving the Body of Christ <br /> in the Digital Age for <span className="text-indigo-600 underline decoration-amber-500">Two Decades.</span>
            </h2>
            <p className="text-lg text-slate-600">
              Founded with a divine vision to help ministries navigate the digital frontier, Grow Ministry acts as a bridge between the ancient message and modern technology.
            </p>
            <div className="space-y-4">
               {[
                 { title: "Pastoral Insight", desc: "We understand the delicate nature of shepherding a digital flock." },
                 { title: "Gospel Aligned", desc: "Our methods prioritize spiritual fruit and genuine connection over clicks." },
                 { title: "Visionary Tech", desc: "Employing AI and advanced CRMs to better manage the Lord's house." }
               ].map((item, idx) => (
                 <div key={idx} className="flex space-x-4">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                     <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900">{item.title}</h4>
                     <p className="text-slate-500">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
