import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decode, decodeAudioData, createBlob } from '../services/live-audio-utils';

interface TranscriptItem {
  role: 'user' | 'agent';
  text: string;
}

const SupportAgent: React.FC = () => {
  const LOGO_URL = "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/ysdCFupPEEPdGlWw2bqR/media/67efff89544d821e861dd115.jpeg";
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'Idle' | 'Connecting' | 'Listening' | 'Speaking' | 'Processing'>('Idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [currentSpeech, setCurrentSpeech] = useState<{ user: string; agent: string }>({ user: '', agent: '' });
  
  const audioContexts = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentSpeech]);

  const initAudio = () => {
    if (!audioContexts.current) {
      audioContexts.current = {
        input: new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 }),
        output: new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 })
      };
    }
  };

  const startConversation = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setErrorMessage("System not configured. Please add API_KEY to environment variables.");
      return;
    }

    try {
      setErrorMessage(null);
      setStatus('Connecting');
      setIsActive(true);
      setTranscript([]);
      setCurrentSpeech({ user: '', agent: '' });
      initAudio();

      const ai = new GoogleGenAI({ apiKey });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Listening');
            const source = audioContexts.current!.input.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = audioContexts.current!.input.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContexts.current!.input.destination);
            
            (sessionRef.current as any) = { 
              stopMic: () => {
                try {
                  source.disconnect();
                  scriptProcessor.disconnect();
                } catch(e) {}
              }
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setCurrentSpeech(prev => ({ ...prev, user: prev.user + text }));
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setCurrentSpeech(prev => ({ ...prev, agent: prev.agent + text }));
            }
            if (message.serverContent?.turnComplete) {
              setTranscript(prev => {
                const next = [...prev];
                if (currentSpeech.user) next.push({ role: 'user', text: currentSpeech.user });
                if (currentSpeech.agent) next.push({ role: 'agent', text: currentSpeech.agent });
                return next;
              });
              setCurrentSpeech({ user: '', agent: '' });
            }
            // Fix for TS18048: added optional chaining before index access
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('Speaking');
              const ctx = audioContexts.current!.output;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                  setTimeout(() => { if (isActive) setStatus('Listening'); }, 200);
                }
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('Listening');
              setCurrentSpeech({ user: '', agent: '' });
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setErrorMessage("Connection lost. Please try again.");
            stopConversation();
          },
          onclose: () => { if (isActive) stopConversation(); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: `You are Zephyr, a professional digital ministry consultant.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Support Agent Start Error:', err);
      setErrorMessage("Failed to start voice session. Check microphone permissions.");
      stopConversation();
    }
  };

  const stopConversation = () => {
    setIsActive(false);
    setStatus('Idle');
    if (sessionRef.current?.stopMic) sessionRef.current.stopMic();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const renderVisualizer = () => {
    const isSpeaking = status === 'Speaking';
    const isListening = status === 'Listening';
    return (
      <div className="flex items-end justify-center space-x-1 h-16 w-full px-8">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1 rounded-full transition-all duration-300 ${
              isSpeaking ? 'bg-amber-400 animate-bounce' : 
              isListening ? 'bg-emerald-400 opacity-60' : 'bg-slate-700'
            }`}
            style={{ 
              height: isSpeaking ? `${Math.random() * 100 + 10}%` : isListening ? `${Math.random() * 30 + 10}%` : '4px',
              animationDelay: `${i * 0.05}s`,
              animationDuration: '0.5s'
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[360px] bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 flex flex-col max-h-[600px]">
          <div className="p-6 bg-indigo-900 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-800 p-0.5 border border-white/20 shadow-lg overflow-hidden">
                 <img src={LOGO_URL} alt="Zephyr" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Zephyr</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
                  <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-extrabold">{isActive ? 'Live' : 'Offline'}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white rounded-full transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/50 scrollbar-hide">
            {isActive ? (
              <div className="space-y-4">
                {transcript.map((item, i) => (
                  <div key={i} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      item.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                    }`}>
                      {item.text}
                    </div>
                  </div>
                ))}
                {currentSpeech.user && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] px-4 py-3 bg-indigo-600/50 text-white/80 rounded-2xl rounded-br-none text-sm animate-pulse">{currentSpeech.user}</div>
                  </div>
                )}
                {currentSpeech.agent && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] px-4 py-3 bg-slate-800/50 text-slate-300 rounded-2xl rounded-bl-none text-sm animate-pulse">{currentSpeech.agent}</div>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-white font-bold text-xl">Ministry Advisor</h4>
                <p className="text-slate-400 text-sm">Tap below to consult about church growth and digital stewardship.</p>
              </div>
            )}
          </div>
          <div className="p-8 bg-slate-900 border-t border-white/5 space-y-6">
            <div className="flex flex-col items-center">
              {renderVisualizer()}
              <p className="text-xs mt-3 font-bold uppercase tracking-[0.3em] text-slate-500">{status}</p>
            </div>
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-400 text-[10px] text-center font-bold uppercase tracking-wider">{errorMessage}</p>
              </div>
            )}
            <button
              onClick={isActive ? stopConversation : startConversation}
              disabled={status === 'Connecting'}
              className={`w-full py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center space-x-3 ${
                isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500 text-white'
              }`}
            >
              {isActive ? "End Session" : "Consult Zephyr"}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-18 h-18 rounded-[1.75rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white active:scale-95 group relative overflow-hidden ${
          isActive ? 'bg-amber-500' : 'bg-indigo-900'
        }`}
      >
        {!isOpen && <img src={LOGO_URL} alt="Grow" className="w-full h-full object-cover" />}
        {isOpen && <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>}
      </button>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .w-18 { width: 4.5rem; }
        .h-18 { height: 4.5rem; }
        .py-4.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
      `}</style>
    </div>
  );
};

export default SupportAgent;