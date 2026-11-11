import Image from 'next/image';
import type { Case } from '@/data/cases';

interface Props {
  case_: Case;
  onOpen: () => void;
  onSelect: () => void;
}

export default function CaseFrame({ case_: c, onOpen, onSelect }: Props) {
  return (
    <div className="select-none cursor-pointer">
      {/* cover */}
      <div className="relative w-full h-60 bg-gray-900 overflow-hidden" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
        <Image src={c.img} alt={c.title} fill className="object-cover" unoptimized />
        <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest text-white/70 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded">
          {c.num}
        </span>
      </div>

      {/* body */}
      <div className="p-6 pb-7">
        <div className="flex flex-wrap gap-1 mb-3">
          {c.tags.map(t => (
            <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide ${
              c.accentTags.includes(t)
                ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>{t}</span>
          ))}
        </div>

        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-gray-50 mb-2 leading-snug">
          {c.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 mb-4">{c.problem}</p>

        <div className="flex gap-3">
          {c.metrics.map(m => (
            <div key={m.label} className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
              <div className="font-display text-xl font-bold text-violet-600">{m.num}</div>
              <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{m.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="mt-4 text-xs font-semibold text-violet-600 hover:opacity-70 transition-opacity"
        >
          View case study →
        </button>
      </div>
    </div>
  );
}
