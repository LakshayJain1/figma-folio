'use client';
import { useState } from 'react';

interface Props { onSelect: () => void }

const NEEDS = [
  { id: 'ai', label: 'AI / LLM' },
  { id: 'rag', label: 'RAG Systems' },
  { id: 'multiagent', label: 'Multi-Agent' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend / API' },
  { id: 'design', label: 'UI / UX Design' },
  { id: 'realtime', label: 'Real-time Data' },
  { id: 'automation', label: 'Automation' },
  { id: 'branding', label: 'Brand Identity' },
  { id: 'chat', label: 'Chat Interfaces' },
];

const PROJECTS = [
  { name: 'Canopy AI', needs: ['ai', 'rag', 'multiagent', 'backend'], tags: ['ai', 'rag', 'backend'] },
  { name: 'AgentCorp', needs: ['ai', 'multiagent', 'automation', 'backend'], tags: ['ai', 'multiagent', 'automation'] },
  { name: 'Police AI Assistant', needs: ['ai', 'chat', 'automation', 'backend'], tags: ['ai', 'chat', 'automation'] },
  { name: 'Inventory App', needs: ['frontend', 'backend', 'realtime'], tags: ['frontend', 'realtime', 'backend'] },
  { name: 'Brand + Web Design', needs: ['design', 'branding', 'frontend'], tags: ['design', 'branding', 'frontend'] },
];

export default function MatcherFrame({ onSelect }: Props) {
  const [active, setActive] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setActive(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const matched = PROJECTS.filter(p => active.size > 0 && p.needs.some(n => active.has(n)));

  return (
    <div
      className="bg-[var(--panel-bg)] rounded-sm overflow-hidden h-full flex flex-col select-none"
      onClick={onSelect}
    >
      {/* header */}
      <div className="px-4 pt-3 pb-2 border-b border-[var(--panel-border)] flex items-center gap-2">
        <span className="text-[9px] font-bold tracking-widest uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded">Interactive</span>
        <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 font-display">What do you need built?</span>
      </div>

      <div className="flex-1 flex flex-col px-4 py-3 gap-3 overflow-hidden">
        <p className="text-[10px] text-gray-400 leading-snug">Pick the capabilities you need. I'll show which projects cover them.</p>

        {/* chips */}
        <div className="flex flex-wrap gap-1.5">
          {NEEDS.map(n => (
            <button
              key={n.id}
              onClick={e => { e.stopPropagation(); toggle(n.id); }}
              className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all ${
                active.has(n.id)
                  ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >{n.label}</button>
          ))}
        </div>

        {/* divider */}
        <div className="h-px bg-[var(--panel-border)]" />

        {/* project rows */}
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
          {PROJECTS.map(p => {
            const isMatch = active.size > 0 && p.needs.some(n => active.has(n));
            return (
              <div key={p.name} className={`flex items-center gap-2 px-2.5 py-2 rounded-md border transition-all ${
                isMatch
                  ? 'border-violet-500/40 bg-violet-500/5 opacity-100'
                  : 'border-gray-800 opacity-30'
              }`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${isMatch ? 'bg-violet-400' : 'bg-gray-700'}`} />
                <span className={`text-[11px] font-semibold flex-1 ${isMatch ? 'text-gray-200' : 'text-gray-500'}`}>{p.name}</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {p.tags.map(t => (
                    <span key={t} className={`text-[8px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                      active.has(t) ? 'bg-violet-500/20 text-violet-300' : 'bg-gray-800 text-gray-500'
                    }`}>{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* summary */}
        <div className={`text-[10px] font-mono px-2.5 py-2 rounded-md transition-all ${
          active.size === 0
            ? 'text-gray-500'
            : matched.length === 0
              ? 'text-red-400 bg-red-400/5 border border-red-400/20'
              : 'text-green-400 bg-green-400/5 border border-green-400/20'
        }`}>
          {active.size === 0
            ? 'Select capabilities above to see matches'
            : matched.length === 0
              ? 'No exact match — but I can build it from scratch.'
              : `✓ ${matched.length} project${matched.length > 1 ? 's' : ''} match your needs → lakshayjain326@gmail.com`}
        </div>
      </div>
    </div>
  );
}
