import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { createGHLContact } from '../services/ghl';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const Contact: React.FC = () => {
  const LOGO_URL = "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/ysdCFupPEEPdGlWw2bqR/media/67efff89544d821e861dd115.jpeg";
  
  const [mathChallenge, setMathChallenge] = useState({ a: 0, b: 0, result: 0 });
  const [userMathAnswer, setUserMathAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', website: '', churchName: '', role: 'Lead Pastor', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileVisible, setTurnstileVisible] = useState(true);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setMathChallenge({ a, b, result: a + b });

    const apiKey = process.env.API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Zephyr, a digital ministry consultant for 'Grow Ministry'. Professional and concise.`,
        }
      });
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chatRef.current) return;

    const userMsg = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
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
      setChatMessages(prev => [...prev, { role: 'model', text: "Forgive me, my connection wavered. Try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userMathAnswer) !== mathChallenge.result) {
      alert("Verification failed.");
      return;
    }
    setLoading(true);
    const names = formData.name.trim().split(/\s+/);
    const success = await createGHLContact({
      name: formData.name,
      firstName: names[0],
      lastName: names.length > 1 ? names.slice(1).join(' ') : 'Leader',
      email: formData.email,
      phone: formData.phone,
      companyName: formData.churchName,
      tags: ['Contact Form']
    });
    setStatus(success ? 'success' : 'error');
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-10">
            <div>
              <h3 className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-4">Ministry Support</h3>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Connect with a Digital Steward</h2>
            </div>
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[500px]">
              <div className="p-5 bg-indigo-900 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-800 border border-white/20">
                    <img src={LOGO_URL} alt="Zephyr" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-white font-bold text-sm">Zephyr (Live Advisor)</h4>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/50">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-white/10">
                <input 
                  type="text" 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </form>
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-10">
                <h3 className="text-3xl font-bold text-slate-900">Mission Received!</h3>
                <button onClick={() => setStatus('idle')} className="mt-6 bg-indigo-900 text-white px-8 py-3 rounded-xl">Send Another</button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border rounded-xl px-4 py-3" placeholder="Full Name" />
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white border rounded-xl px-4 py-3" placeholder="Work Email" />
                <input type="text" required value={formData.churchName} onChange={(e) => setFormData({...formData, churchName: e.target.value})} className="w-full bg-white border rounded-xl px-4 py-3" placeholder="Church Name" />
                <input type="number" required value={userMathAnswer} onChange={(e) => setUserMathAnswer(e.target.value)} className="w-full bg-white border rounded-xl px-4 py-3" placeholder={`What is ${mathChallenge.a} + ${mathChallenge.b}?`} />
                <button type="submit" disabled={loading} className="w-full bg-indigo-900 text-white font-bold py-4 rounded-xl">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;