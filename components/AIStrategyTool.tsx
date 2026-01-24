
import React, { useState } from 'react';
import { generateGrowthStrategy, StrategyResponse } from '../services/gemini';
import { createGHLContact } from '../services/ghl';

const AIStrategyTool: React.FC = () => {
  const LOGO_URL = "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/ysdCFupPEEPdGlWw2bqR/media/67efff89544d821e861dd115.jpeg";
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [ministryName, setMinistryName] = useState('');
  const [goals, setGoals] = useState('');
  const [mission, setMission] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await generateGrowthStrategy(ministryName, goals, mission);
      
      const names = userName.split(' ');
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
      
      await createGHLContact({
        name: userName,
        firstName,
        lastName,
        email: userEmail,
        companyName: ministryName,
        tags: ['AI Strategy Lab', 'Lead Magnet']
      });

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Unable to generate roadmap. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-tool" className="py-24 gradient-bg text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20">
               <img src={LOGO_URL} alt="Grow Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-sm font-bold uppercase tracking-widest">
            The Ministry Outreach Lab
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-glow text-white">Discern Your Digital Roadmap</h2>
          <p className="text-slate-300">
            Tell us about your calling, and our custom AI model will draft a preliminary outreach plan for your ministry.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-500"
                    placeholder="Pastor John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Your Ministry Email</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-500"
                    placeholder="pastor@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Ministry/Church Name</label>
                  <input
                    type="text"
                    required
                    value={ministryName}
                    onChange={(e) => setMinistryName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-500"
                    placeholder="e.g. Grace Fellowship"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Primary Ministerial Goal</label>
                  <input
                    type="text"
                    required
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-500"
                    placeholder="e.g. Deeper community discipleship"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Your Mission Statement</label>
                <textarea
                  required
                  rows={3}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-500"
                  placeholder="Describe the heart of your ministry..."
                ></textarea>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating Outreach Plan...</span>
                  </>
                ) : (
                  <span>Draft AI Roadmap</span>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/30">
                    <img src={LOGO_URL} alt="Grow Logo" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-500">Ministry Outreach Roadmap</h3>
                </div>
                <button 
                  onClick={() => setResult(null)}
                  className="text-slate-400 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-full"
                >
                  Start Over
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold mb-2 flex items-center space-x-2">
                    <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
                    <span>Outreach Summary</span>
                  </h4>
                  <p className="text-slate-300 italic leading-relaxed">{result.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center space-x-2 text-indigo-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                      <span>Stewardship Steps</span>
                    </h4>
                    <ul className="space-y-3">
                      {result.actionItems.map((item, idx) => (
                        <li key={idx} className="flex space-x-3 text-slate-300 text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                          <span className="text-amber-500 font-bold">{idx + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center space-x-2 text-indigo-400">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                       <span>Digital Ministry Insight</span>
                    </h4>
                    <div className="bg-indigo-900/40 p-5 rounded-2xl border border-indigo-500/20">
                      <p className="text-slate-200 text-sm leading-relaxed mb-4">{result.aiInsight}</p>
                      <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Primary Channels</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.recommendedPlatforms.map((p, idx) => (
                          <span key={idx} className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-md border border-indigo-500/30">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-center">
                 <p className="text-sm text-slate-400 mb-4">Would you like a professional to execute this AI-generated vision?</p>
                 <a href="#contact" className="inline-block bg-white text-indigo-900 px-6 py-2 rounded-full font-bold hover:bg-amber-500 hover:text-white transition-all shadow-lg">
                   Request a Spiritual Outreach Audit
                 </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIStrategyTool;
