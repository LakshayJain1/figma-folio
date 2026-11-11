'use client';
import Image from 'next/image';
import type { Case } from '@/data/cases';

export default function DetailOverlay({ case_: c, onClose }: { case_: Case; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-[#1e1e1e] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* cover */}
        <div className="relative w-full h-44 sm:h-56 bg-gray-900 overflow-hidden rounded-t-2xl">
          <Image src={c.img} alt={c.title} fill className="object-cover" unoptimized />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
          >✕</button>
        </div>

        <div className="p-5 sm:p-8">
          {/* tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {c.tags.map(t => (
              <span key={t} className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide ${
                c.accentTags.includes(t)
                  ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}>{t}</span>
            ))}
          </div>

          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1 leading-tight">{c.title}</h2>
          <p className="text-xs text-gray-400 mb-6">{c.meta}</p>

          {/* metrics */}
          <div className="flex gap-3 mb-6">
            {c.metrics.map(m => (
              <div key={m.label} className="flex-1 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                <div className="font-display text-2xl font-bold text-violet-600">{m.num}</div>
                <div className="text-xs text-gray-400 mt-1 leading-tight">{m.label}</div>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Problem</p>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-5">{c.problem}</p>

          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">What I built</p>
          <ul className="mb-5 space-y-2">
            {c.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="text-violet-500 mt-0.5 flex-shrink-0">▸</span>
                {b}
              </li>
            ))}
          </ul>

          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Outcome</p>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-6">{c.outcome}</p>

          {c.link && (
            <a href={c.link} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              View on GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
