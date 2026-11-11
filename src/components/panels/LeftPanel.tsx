'use client';
import { useState } from 'react';
import { FrameCorners, FileText, X } from '@phosphor-icons/react';
import { FRAME_META } from '@/data/cases';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
  open?: boolean;
  onClose?: () => void;
}

export default function LeftPanel({ selected, onSelect, open, onClose }: Props) {
  const [tab, setTab] = useState<'layers' | 'pages'>('layers');

  const handleSelect = (id: string) => { onSelect(id); onClose?.(); };

  return (
    <>
      {/* mobile backdrop */}
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <div className={[
        'bg-[var(--panel-bg)] border-r border-[var(--panel-border)] flex flex-col text-xs select-none',
        // desktop: always visible in flow
        'lg:w-56 lg:flex-shrink-0 lg:static lg:translate-x-0 lg:z-auto lg:shadow-none',
        // mobile/tablet: fixed side drawer
        'max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:bottom-0 max-lg:w-72 max-lg:z-40 max-lg:transition-transform max-lg:duration-300 max-lg:shadow-2xl',
        open ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
      ].join(' ')}>
      <div className="flex items-center border-b border-[var(--panel-border)]">
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
        {onClose && (
          <button onClick={onClose} className="lg:hidden px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={14} />
          </button>
        )}
      </div>

      {tab === 'layers' && (
        <div className="flex-1 overflow-y-auto py-2">
          {Object.entries(FRAME_META).map(([id, meta]) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
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
    </>
  );
}
