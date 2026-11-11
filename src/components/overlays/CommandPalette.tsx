'use client';
import { useState, useEffect, useRef } from 'react';
import { CMD_HINTS, CMD_RESPONSES } from '@/data/commands';

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ t: string; s: string }[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const run = (cmd: string) => {
    const key = cmd.trim().toLowerCase();
    setOutput(CMD_RESPONSES[key] || [{ t: 'dim', s: `command not found: ${key}` }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') run(input);
    if (e.key === 'Tab' && CMD_HINTS.some(h => h.startsWith(input))) {
      e.preventDefault();
      const match = CMD_HINTS.find(h => h.startsWith(input));
      if (match) setInput(match);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 overflow-hidden font-mono"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <span className="text-violet-400 text-sm select-none">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => { setInput(e.target.value); setOutput(null); }}
            onKeyDown={handleKeyDown}
            placeholder="type a command..."
            className="flex-1 bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-600"
          />
          <span className="text-xs text-gray-600">ESC to close</span>
        </div>

        {!output && (
          <div className="p-4 flex flex-wrap gap-2">
            {CMD_HINTS.map(h => (
              <button
                key={h}
                onClick={() => { setInput(h); run(h); }}
                className="text-xs px-3 py-1.5 rounded-md bg-white/5 text-gray-400 hover:bg-white/10 hover:text-violet-300 transition-colors font-mono"
              >
                {h}
              </button>
            ))}
          </div>
        )}

        {output && (
          <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
            {output.map((line, i) => (
              <p key={i} className={`text-xs leading-relaxed whitespace-pre ${
                line.t === 'accent' ? 'text-violet-300 font-semibold' :
                line.t === 'dim'    ? 'text-gray-500' :
                line.t === 'success'? 'text-green-400' :
                'text-gray-300'
              }`}>{line.s}</p>
            ))}
            <div className="pt-2">
              <button onClick={() => setOutput(null)} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
