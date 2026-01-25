import React, { useState } from 'react';

interface PricingPlan {
  name: string;
  tagline: string;
  description: string;
  isOneTime?: boolean;
  price?: number;
  link?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  monthlyLink?: string;
  yearlyLink?: string;
  popular?: boolean;
  trialAvailable: boolean;
  features: string[];
  buttonText: string;
  color: string;
}

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const SCHEDULING_LINK = "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-6a757c77-b1e8-4f09-9814-f9256b2213ed";

  const plans: PricingPlan[] = [
    {
      name: "Digital Shepherd (Member Care)",
      tagline: "Know your sheep by name",
      description: "Comprehensive congregational care powered by AI. A permanent foundation for your ministry's growth.",
      isOneTime: true,
      price: 297,
      link: "https://link.fastpaydirect.com/payment-link/68a7baec613b1ba993cd51bc",
      features: [
        "Complete Member Directory & Family Tracking",
        "Fellowship & Engagement Analytics",
        "Automated Follow-up for New Visitors",
        "Prayer Request Management System",
        "Tithe & Donation Tracking",
        "Event Planning & RSVP Management",
        "Volunteer Coordination Tools",
        "AI-Powered Newsletter & Bulletin Content",
        "Mobile App for Pastoral Visits",
        "Sermon Series Planning & Scripture Integration",
        "Small Group & Discipleship Management",
        "Congregational Milestone Reminders"
      ],
      buttonText: "Invest in Your Ministry",
      color: "slate",
      trialAvailable: false
    },
    {
      name: "Hands-Free Digital Ministry",
      tagline: "Building His Kingdom with every tool",
      description: "A complete managed solution. Our team becomes your digital department, handling growth and care end-to-end.",
      monthlyPrice: 495,
      yearlyPrice: 4950,
      monthlyLink: "https://link.fastpaydirect.com/payment-link/68b4639e613b1b92decd9036",
      yearlyLink: "https://link.fastpaydirect.com/payment-link/68b1d3ab613b1b01a2cd86de",
      popular: true,
      trialAvailable: true,
      features: [
        "ALL Digital Shepherd Member Care Features",
        "ALL Digital Evangelism Outreach Features",
        "ALL Digital Lighthouse Visibility Features",
        "Integrated Ministry Management",
        "Advanced Mission Impact Dashboard",
        "Priority Pastoral Support",
        "Monthly Strategy Consultation Call",
        "Staff Training & Onboarding",
        "Advanced AI Outreach Personalization",
        "Multi-Campus Management Tools",
        "Advanced Stewardship Workflows"
      ],
      buttonText: "Transform Your Ministry Now",
      color: "indigo"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-3xl font-bold tracking-tight text-indigo-900">
              GROW<span className="text-amber-500">MINISTRY</span>
            </span>
            <p className="text-slate-500 font-medium text-sm md:text-base italic">Empowering Your Digital Mission Since 2005</p>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Ministry Investment Plans</h2>

          <div className="flex items-center justify-center space-x-4 mt-8">
            <span className={`text-sm font-bold ${!isYearly ? 'text-indigo-900' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-indigo-600 rounded-full transition-colors focus:outline-none"
              aria-label="Toggle yearly pricing"
            >
              <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-bold ${isYearly ? 'text-indigo-900' : 'text-slate-500'}`}>
              Yearly <span className="text-emerald-600 font-extrabold uppercase">(Save 2 Months!)</span>
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 items-start">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border-2 transition-transform duration-300 hover:scale-[1.02] ${plan.popular ? 'border-amber-500 lg:scale-105 z-10' : 'border-slate-100'}`}>
              {plan.popular && (
                <div className="bg-amber-500 text-white text-center py-1.5 text-xs font-bold uppercase tracking-widest">
                  ⭐ Flagship Managed Plan
                </div>
              )}
              
              <div className="p-8 flex-grow">
                {plan.trialAvailable && (
                  <div className="mb-4 inline-block bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-emerald-200">
                    One Month Free Trial
                  </div>
                )}
                {plan.isOneTime && (
                  <div className="mb-4 inline-block bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-indigo-200">
                    Lifetime Investment
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-indigo-600 text-sm font-bold italic mt-1 leading-tight">"{plan.tagline}"</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ${plan.isOneTime ? plan.price : (isYearly ? (plan.yearlyPrice || 0) / 12 : (plan.monthlyPrice || 0))}
                    </span>
                    <span className="text-slate-500 ml-2">{plan.isOneTime ? 'Once' : '/ mo'}</span>
                  </div>
                  {!plan.isOneTime && isYearly ? (
                    <div className="mt-1">
                      <p className="text-sm text-emerald-600 font-bold italic">Total: ${plan.yearlyPrice}/year</p>
                      <p className="text-xs text-slate-400 line-through">Regularly ${(plan.monthlyPrice || 0) * 12}/year</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1 italic">{plan.isOneTime ? 'No recurring fees' : 'Billed monthly'}</p>
                  )}
                  <p className="text-slate-600 text-sm mt-4 font-medium">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start text-sm text-slate-600 leading-tight">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 mt-auto space-y-3">
                {plan.trialAvailable && (
                  <a 
                    href={SCHEDULING_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-4 px-4 rounded-xl font-black uppercase tracking-widest text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1"
                  >
                    Start 30-Day Free Trial
                  </a>
                )}
                <a 
                  href={plan.isOneTime ? (plan.link || '#') : (isYearly ? plan.yearlyLink : plan.monthlyLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-4 px-4 rounded-xl font-bold transition-all shadow-lg ${plan.popular ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20' : 'bg-indigo-900 text-white hover:bg-indigo-950 shadow-indigo-900/10'}`}
                >
                  {plan.buttonText}
                </a>
                <a 
                  href={SCHEDULING_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 px-4 rounded-xl font-bold text-indigo-600 text-sm hover:text-indigo-800 transition-colors border-2 border-transparent hover:border-indigo-100"
                >
                  Schedule a Demonstration
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border-b-8 border-amber-500 max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="grid lg:grid-cols-3 gap-12 items-center relative z-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-400 text-sm font-bold uppercase tracking-wider">
                🤝 Full-Service Ministry Partner
              </div>
              <h3 className="text-3xl md:text-4xl font-bold">Managed Growth & Outreach</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Add dedicated partner management to any package. We handle the technical labor while you focus on shepherding your flock.
              </p>
              <div className="flex items-baseline space-x-3">
                <span className="text-indigo-300 text-lg italic">Starting at</span>
                <span className="text-4xl font-extrabold text-amber-500">$1,000/mo</span>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <a 
                href={SCHEDULING_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-2xl font-extrabold text-xl transition-all shadow-xl shadow-amber-500/30 w-full lg:w-auto"
              >
                Inquire Today
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;