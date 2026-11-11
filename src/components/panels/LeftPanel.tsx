'use client';
import { useState } from 'react';
import { FrameCorners, FileText, Square } from '@phosphor-icons/react';
import { FRAME_META } from '@/data/cases';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function LeftPanel({ selected, onSelect }: Props) {
  const [tab, setTab] = useState<'layers' | 'pages'>('layers');

  return (
    <div className="w-56 flex-shrink-0 bg-[var(--panel-bg)] border-r border-[var(--panel-border)] flex flex-col text-xs select-none">
      <div className="flex border-b border-[var(--panel-border)]">
        {(['layers', 'pages'] as const).map(t => (
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

      {tab === 'layers' && (
        <div className="flex-1 overflow-y-auto py-2">
          {Object.entries(FRAME_META).map(([id, meta]) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left ${
                selected === id ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <FrameCorners size={12} className="opacity-50 flex-shrink-0" />
              <span className="truncate">{meta.name}</span>
            </button>
          ))}
        </div>
      )}

      {tab === 'pages' && (
        <div className="flex-1 overflow-y-auto py-2 px-3">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 font-medium">
            <FileText size={12} />Portfolio
          </div>
          <p className="mt-3 text-gray-400 text-[10px] text-center">One page</p>
        </div>
      )}
    </div>
  );
}
