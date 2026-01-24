
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { createGHLContact } from '../services/ghl';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const Contact: React.FC = () => {
  const LOGO_URL = "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/ysdCFupPEEPdGlWw2bqR/media/67efff89544d821e861dd115.jpeg";
  
  // Form Security & Data State
  const [mathChallenge, setMathChallenge] = useState({ a: 0, b: 0, result: 0 });
  const [userMathAnswer, setUserMathAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    churchName: '',
    role: 'Lead Pastor',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileVisible, setTurnstileVisible] = useState(true);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Initialize Math Challenge & Chat Session
  const generateMath = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setMathChallenge({ a, b, result: a + b });
  };

  useEffect(() => {
    generateMath();
    
    // Initialize Chat Session
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are Zephyr, a digital ministry consultant for 'Grow Ministry'.
        You have 20 years of experience in church growth.
        Tone: Professional, spiritual, and concise. 
        Focus: Digital Lighthouse (SEO), Digital Evangelism (Social), and Digital Shepherd (CRM).
        Keep responses under 3 sentences for readability in a chat widget.`,
      }
    });

    let isMounted = true;
    const loadTurnstile = () => {
      if (document.querySelector('script[src*="turnstile"]')) return Promise.resolve();
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    const renderWidget = () => {
      if (!isMounted || !turnstileContainerRef.current || !(window as any).turnstile) return;
      try {
        widgetIdRef.current = (window as any).turnstile.render(turnstileContainerRef.current, {
          sitekey: '1x00000000000000000000AA',
          callback: (token: string) => isMounted && setTurnstileToken(token),
          'error-callback': () => isMounted && setTurnstileVisible(false)
        });
      } catch (e) {
        if (isMounted) setTurnstileVisible(false);
      }
    };

    loadTurnstile().then(() => setTimeout(renderWidget, 500)).catch(() => isMounted && setTurnstileVisible(false));
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);
    setIsTyping(true);

    try {
      const result = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = "";
      
      setChatMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of result) {
        fullText += chunk.text;
        setChatMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'model', text: fullText };
          return next;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, { role: 'model', text: "Forgive me, my connection wavered. Could you try asking that again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      setStatus('success');
      return;
    }
    if (parseInt(userMathAnswer) !== mathChallenge.result) {
      alert("Verification failed. Please solve the simple math problem.");
      generateMath();
      setUserMathAnswer('');
      return;
    }

    setLoading(true);
    setStatus('idle');

    const names = formData.name.trim().split(/\s+/);
    const success = await createGHLContact({
      name: formData.name.trim(),
      firstName: names[0] || 'Ministry',
      lastName: names.length > 1 ? names.slice(1).join(' ') : 'Leader',
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      website: formData.website.trim(),
      companyName: formData.churchName.trim(),
      tags: [
        'Contact Form Submission', 
        `Church: ${formData.churchName}`,
        turnstileToken ? 'Verified: Turnstile' : 'Verified: Math Challenge'
      ]
    });

    if (success) {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', website: '', churchName: '', role: 'Lead Pastor', message: '' });
      setUserMathAnswer('');
      generateMath();
    } else {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Info & Live Chat Widget */}
          <div className="space-y-10">
            <div>
              <h3 className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-4">Ministry Support</h3>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Connect with a Digital Steward</h2>
              <p className="text-lg text-slate-600 mt-6 leading-relaxed">
                Whether you prefer a formal inquiry or a quick chat about your outreach, we are here to support your mission.
              </p>
            </div>

            {/* Embedded Live Chat Widget */}
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[500px]">
              <div className="p-5 bg-indigo-900 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-800 border border-white/20">
                    <img src={LOGO_URL} alt="Zephyr" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Zephyr (Live Advisor)</h4>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold">Always Available</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/50 scrollbar-hide">
                {chatMessages.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-slate-500 text-sm italic font-medium px-10">
                      "I'm Zephyr. Ask me anything about growing your digital ministry or reaching your local community."
                    </p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-900/20' 
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-none text-xs flex space-x-1 items-center border border-white/5">
                      <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                      <span className="ml-2 font-bold uppercase tracking-widest text-[10px]">Zephyr is discerning...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-white/10">
                <div className="relative">
                  <input 
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about SEO, Social, or CRM..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                  />
                  <button 
                    type="submit"
                    disabled={isTyping}
                    className="absolute right-2 top-1.5 p-1.5 text-amber-500 hover:text-amber-400 transition-colors disabled:opacity-20"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <span>Ministerial Data Protection Guaranteed</span>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 relative shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">Mission Received!</h3>
                <p className="text-slate-600">Your secure inquiry has been delivered to our team.</p>
                <button onClick={() => setStatus('idle')} className="bg-indigo-900 text-white px-8 py-3 rounded-xl font-bold mt-6 hover:bg-indigo-950 transition-all">Send Another Inquiry</button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="hidden" aria-hidden="true">
                  <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" placeholder="e.g. John Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" placeholder="pastor@church.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Church Name</label>
                    <input type="text" required value={formData.churchName} onChange={(e) => setFormData({...formData, churchName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" placeholder="Grace Fellowship" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea rows={3} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" placeholder="Tell us about your calling..."></textarea>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span>Verification Challenge</span>
                  </div>
                  
                  {turnstileVisible && (
                    <div ref={turnstileContainerRef} className="min-h-[65px] flex justify-center"></div>
                  )}

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To verify outreach, what is {mathChallenge.a} + {mathChallenge.b}?</label>
                      <input 
                        type="number" 
                        required 
                        value={userMathAnswer}
                        onChange={(e) => setUserMathAnswer(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="Your answer"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-900 hover:bg-indigo-950 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      <span>Securely Send Outreach Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Contact;
