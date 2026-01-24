
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

  // Auto-scroll transcript
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
    try {
      setErrorMessage(null);
      setStatus('Connecting');
      setIsActive(true);
      setTranscript([]);
      setCurrentSpeech({ user: '', agent: '' });
      initAudio();

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
            // Handle Transcriptions
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setCurrentSpeech(prev => ({ ...prev, user: prev.user + text }));
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setCurrentSpeech(prev => ({ ...prev, agent: prev.agent + text }));
            }
            
            // Finalize turn transcription
            if (message.serverContent?.turnComplete) {
              setTranscript(prev => {
                const next = [...prev];
                if (currentSpeech.user) next.push({ role: 'user', text: currentSpeech.user });
                if (currentSpeech.agent) next.push({ role: 'agent', text: currentSpeech.agent });
                return next;
              });
              setCurrentSpeech({ user: '', agent: '' });
            }

            // Handle Audio
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
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
                  setTimeout(() => {
                    if (isActive) setStatus('Listening');
                  }, 200);
                }
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('Listening');
              setCurrentSpeech({ user: '', agent: '' });
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setErrorMessage("Channel lost. Please reconnect.");
            stopConversation();
          },
          onclose: () => {
            if (isActive) stopConversation();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: `You are Zephyr, a warm and professional digital ministry consultant for 'Grow Ministry'.
          You have nearly 20 years of experience in helping churches leverage digital tools for outreach.
          
          Tone: Spiritual, helpful, concise, and professional. Use words like "Kingdom", "Fellowship", and "Stewardship".
          
          Knowledge:
          - Digital Lighthouse: Search visibility.
          - Digital Evangelism: Social outreach ($99/mo).
          - Digital Shepherd: Member care ($297/mo).
          - Complete Transformation: Full service ($495/mo).
          
          Always keep answers brief since this is a live voice interaction.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Support Agent Start Error:', err);
      setErrorMessage("Microphone access is required for voice consultation.");
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
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
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
          {/* Header */}
          <div className="p-6 bg-indigo-900 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-800 p-0.5 flex items-center justify-center border border-white/20 shadow-lg overflow-hidden">
                 <img src={LOGO_URL} alt="Zephyr Logo" className={`w-full h-full object-cover rounded-xl transition-all ${isActive ? 'scale-110 rotate-3' : 'scale-100'}`} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Zephyr</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
                  <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-extrabold">{isActive ? 'Live Channels Sync' : 'Consultant Offline'}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all relative z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-900/50">
            {isActive ? (
              <div className="space-y-4">
                {transcript.length === 0 && !currentSpeech.user && !currentSpeech.agent && (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 overflow-hidden">
                       <img src={LOGO_URL} alt="Grow Logo" className="w-full h-full object-cover opacity-60 animate-pulse" />
                    </div>
                    <p className="text-slate-400 text-sm italic px-8">
                      "I'm listening. How can we expand your Kingdom impact today?"
                    </p>
                  </div>
                )}
                {transcript.map((item, i) => (
                  <div key={i} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      item.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-900/20' 
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                    }`}>
                      {item.text}
                    </div>
                  </div>
                ))}
                {currentSpeech.user && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] px-4 py-3 bg-indigo-600/50 text-white/80 rounded-2xl rounded-br-none text-sm animate-pulse border border-indigo-500/30">
                      {currentSpeech.user}
                    </div>
                  </div>
                )}
                {currentSpeech.agent && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] px-4 py-3 bg-slate-800/50 text-slate-300 rounded-2xl rounded-bl-none text-sm animate-pulse border border-white/5">
                      {currentSpeech.agent}
                    </div>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="w-28 h-28 bg-slate-800 rounded-[2rem] mx-auto flex items-center justify-center border-2 border-slate-700 shadow-2xl overflow-hidden group">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="space-y-3 px-6">
                  <h4 className="text-white font-extrabold text-xl tracking-tight italic">Ministry Outreach Advisor</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Instantly consult with our AI specialist about church growth, digital stewardships, and visibility roadmaps.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls Footer */}
          <div className="p-8 bg-slate-900 border-t border-white/5 space-y-6">
            <div className="flex flex-col items-center">
              {renderVisualizer()}
              <p className={`text-xs mt-3 font-bold uppercase tracking-[0.3em] transition-colors duration-300 ${
                status === 'Listening' ? 'text-emerald-400' : 
                status === 'Speaking' ? 'text-amber-400' : 'text-slate-500'
              }`}>
                {status === 'Idle' ? 'System Offline' : status}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-400 text-[10px] text-center font-bold uppercase tracking-wider">{errorMessage}</p>
              </div>
            )}

            <button
              onClick={isActive ? stopConversation : startConversation}
              disabled={status === 'Connecting'}
              className={`w-full py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center space-x-3 active:scale-95 ${
                isActive 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30'
              }`}
            >
              {status === 'Connecting' ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isActive ? (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    ) : (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    )}
                  </svg>
                  <span>{isActive ? "End Session" : "Consult Zephyr"}</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center space-x-2 text-[9px] text-slate-600 font-bold uppercase tracking-[0.25em]">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
              <span>Ministry Grade Encryption</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-18 h-18 rounded-[1.75rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white active:scale-95 group relative overflow-hidden ${
          isActive ? 'bg-amber-500' : 'bg-indigo-900'
        }`}
      >
        {isActive && (
           <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        )}
        {!isOpen && (
           <img src={LOGO_URL} alt="Grow" className={`w-full h-full object-cover transition-all duration-700 ${isActive ? 'scale-125' : 'scale-100 group-hover:scale-110'}`} />
        )}
        {isOpen && (
           <svg className="w-8 h-8 text-white transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
           </svg>
        )}
      </button>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .w-18 { width: 4.5rem; }
        .h-18 { height: 4.5rem; }
      `}</style>
    </div>
  );
};

export default SupportAgent;
