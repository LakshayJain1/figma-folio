'use client';
import { useState } from 'react';
import { Plus, Trash } from '@phosphor-icons/react';
import { FRAME_META } from '@/data/cases';

interface Props {
  selected: string | null;
  notes: Record<string, string[]>;
  onAddNote: (frameId: string, text: string) => void;
  onDeleteNote: (frameId: string, index: number) => void;
}

const EXP = [
  { role: 'Software Developer', co: 'Autovyn Consultancy', dates: 'May 2026–Now' },
  { role: 'Full-Stack AI Engineer', co: 'Tectome', dates: 'Jul 2025–May 2026' },
  { role: 'UI/UX Designer & Frontend Dev', co: 'Integrated Byte', dates: 'Mar–Jul 2025' },
  { role: 'Associate Software Engineer', co: 'Modulobytes', dates: 'Dec 2024–Mar 2025' },
];

const SKILLS_QUICK = ['LangChain', 'RAG', 'Next.js', 'TypeScript', 'Python', 'Neo4j', 'Figma', 'n8n'];

export default function RightPanel({ selected, notes, onAddNote, onDeleteNote }: Props) {
  const [tab, setTab] = useState<'design' | 'inspect'>('design');
  const [addingNote, setAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const meta = selected ? FRAME_META[selected] : null;
  const frameNotes = (selected && notes[selected]) || [];

  const submitNote = () => {
    if (noteText.trim() && selected) {
      onAddNote(selected, noteText.trim());
      setNoteText('');
      setAddingNote(false);
    }
  };

  return (
    <div className="w-56 flex-shrink-0 bg-[var(--panel-bg)] border-l border-[var(--panel-border)] flex flex-col text-xs select-none">
      <div className="flex border-b border-[var(--panel-border)]">
        {(['design', 'inspect'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 capitalize font-medium transition-colors ${
              tab === t
                ? 'text-gray-900 dark:text-gray-100 border-b-2 border-violet-600'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'design' && (
          <div>
            <div className="p-4 border-b border-[var(--panel-border)] flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-display font-bold text-xl">LJ</div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Lakshay Jain</p>
              <p className="text-gray-400 text-[10px]">Product Builder · Jaipur, India</p>
              <div className="flex items-center gap-1.5 text-[10px] text-green-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Available for hire
              </div>
            </div>

            <div className="p-3 border-b border-[var(--panel-border)]">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Top Skills</p>
              <div className="flex flex-wrap gap-1">
                {SKILLS_QUICK.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{s}</span>
                ))}
              </div>
            </div>

            <div className="p-3">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Experience</p>
              <div className="space-y-3">
                {EXP.map(e => (
                  <div key={e.co}>
                    <p className="font-medium text-gray-800 dark:text-gray-200 leading-tight">{e.role}</p>
                    <p className="text-gray-500">{e.co}</p>
                    <p className="text-gray-400 text-[10px]">{e.dates}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'inspect' && (
          <div className="p-3">
            {meta ? (
              <>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Frame</p>
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {[['W', meta.w], ['H', meta.h], ['X', meta.x], ['Y', meta.y]].map(([k, v]) => (
                    <div key={k as string} className="bg-gray-50 dark:bg-gray-800/60 rounded px-2 py-1.5 flex items-center justify-between">
                      <span className="text-gray-400">{k}</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded px-2 py-1.5 mb-4 flex items-center justify-between">
                  <span className="text-gray-400">Fill</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-600" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">White</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center mt-4">Click a frame to inspect</p>
            )}

            <div className="border-t border-[var(--panel-border)] pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Notes</p>
                {selected && (
                  <button onClick={() => setAddingNote(a => !a)} className="text-violet-500 hover:text-violet-400 transition-colors">
                    <Plus size={13} weight="bold" />
                  </button>
                )}
              </div>

              {addingNote && (
                <div className="mb-2">
                  <input
                    autoFocus
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') submitNote(); if (e.key === 'Escape') setAddingNote(false); }}
                    placeholder="Add a note…"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs outline-none focus:border-violet-400 text-gray-800 dark:text-gray-200"
                  />
                </div>
              )}

              {frameNotes.length === 0 && !addingNote && (
                <p className="text-gray-400 text-[10px]">{selected ? 'No notes yet' : 'Select a frame first'}</p>
              )}

              {frameNotes.map((n, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5 group">
                  <span className="text-violet-500 text-[10px] mt-0.5 flex-shrink-0">●</span>
                  <span className="flex-1 text-gray-600 dark:text-gray-400 text-[11px] leading-snug break-words">{n}</span>
                  <button
                    onClick={() => selected && onDeleteNote(selected, i)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
                  >
                    <Trash size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
