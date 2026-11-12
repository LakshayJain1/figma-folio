'use client';
import { useEffect, useRef, useState } from 'react';

interface Props { onSelect: () => void }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRec = any;

const CMDS = [
  { key: 'canopy ai', label: '"canopy ai"', sub: '→ Case 01' },
  { key: 'agent corp', label: '"agent corp"', sub: '→ Case 02' },
  { key: 'police', label: '"police report"', sub: '→ Case 03' },
  { key: 'inventory', label: '"inventory"', sub: '→ Case 04' },
];

export default function VoiceFrame({ onSelect }: Props) {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState('Click mic to start');
  const [heard, setHeard] = useState('');
  const [triggered, setTriggered] = useState<string | null>(null);
  const [hasSR, setHasSR] = useState(true);
  const recRef = useRef<AnyRec>(null);

  useEffect(() => {
    const w = window as AnyRec;
    if (!w.SpeechRecognition && !w.webkitSpeechRecognition) setHasSR(false);
  }, []);

  function fireCmd(cmd: string) {
    setTriggered(cmd);
    setTimeout(() => setTriggered(null), 1000);
    window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: cmd }));
  }

  function toggleMic() {
    if (!hasSR) return;
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      setStatus('Click mic to start');
      return;
    }
    const w = window as AnyRec;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    const rec = new SR();
    recRef.current = rec;
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => { setListening(true); setStatus('Listening…'); };
    rec.onresult = (e: AnyRec) => {
      const t = Array.from(e.results as AnyRec[]).map((r: AnyRec) => r[0].transcript).join('').toLowerCase();
      setHeard(t);
      if (e.results[0].isFinal) {
        const match = CMDS.find(c => t.includes(c.key));
        if (match) fireCmd(match.key);
        else setStatus('Try: "agent corp", "inventory"…');
      }
    };
    rec.onend = () => { setListening(false); setStatus('Click mic to start'); setHeard(''); };
    rec.onerror = () => { setListening(false); setStatus('Click mic to start'); };
    rec.start();
  }

  return (
    <div
      className="bg-[var(--panel-bg)] rounded-sm overflow-hidden h-full flex flex-col select-none"
      onClick={onSelect}
    >
      <div className="px-4 pt-3 pb-2 border-b border-[var(--panel-border)] flex items-center gap-2">
        <span className="text-[9px] font-bold tracking-widest uppercase text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">Audio</span>
        <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 font-display">Voice Navigator</span>
      </div>

      <div className="flex-1 flex flex-col items-center gap-3 px-4 py-4">
        <button
          onClick={e => { e.stopPropagation(); toggleMic(); }}
          disabled={!hasSR}
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
            listening
              ? 'border-violet-500 bg-violet-500/10 animate-pulse'
              : 'border-gray-300 dark:border-gray-600 hover:border-violet-400'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <svg className={`w-6 h-6 ${listening ? 'text-violet-400' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="1" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v4M8 23h8"/>
          </svg>
        </button>

        <div className={`flex gap-1 items-center h-5 transition-opacity ${listening ? 'opacity-100' : 'opacity-0'}`}>
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-1 rounded-sm bg-violet-400"
              style={{ height: '4px', animation: listening ? `wavebar 0.8s ease ${i * 0.1}s infinite` : 'none' }} />
          ))}
        </div>

        <p className={`text-[10px] font-mono text-center ${listening ? 'text-violet-400' : 'text-gray-400'}`}>
          {heard ? `"${heard}"` : status}
        </p>

        {!hasSR && (
          <p className="text-[9px] text-amber-400 font-mono text-center px-2">
            Speech API unavailable — click chips below
          </p>
        )}

        <div className="grid grid-cols-2 gap-1.5 w-full mt-1">
          {CMDS.map(c => (
            <button
              key={c.key}
              onClick={e => { e.stopPropagation(); setHeard(c.key); fireCmd(c.key); }}
              className={`text-left px-2.5 py-2 rounded border text-[10px] font-mono transition-all ${
                triggered === c.key
                  ? 'border-green-400 text-green-400 bg-green-400/10'
                  : 'border-gray-700 text-gray-400 hover:border-violet-400 hover:text-violet-300'
              }`}
            >
              <div>{c.label}</div>
              <div className="text-gray-500 text-[9px]">{c.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wavebar {
          0%,100% { height: 4px }
          50% { height: 16px }
        }
      `}</style>
    </div>
  );
}
