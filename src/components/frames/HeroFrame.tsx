'use client';
import { useEffect, useRef } from 'react';

const BIO = 'I take products from blank canvas to production, handling design, engineering, and everything in between.';

export default function HeroFrame({ onSelect }: { onSelect: () => void }) {
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'inline-block w-0.5 h-5 bg-violet-600 ml-0.5 align-middle animate-pulse';
    el.appendChild(cursor);
    let i = 0;
    const id = setInterval(() => {
      if (i >= BIO.length) { clearInterval(id); return; }
      el.insertBefore(document.createTextNode(BIO[i]), cursor);
      i++;
    }, 26);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-14 select-none" onClick={onSelect}>
      <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-5 flex items-center gap-2">
        <span className="block w-6 h-0.5 bg-violet-600 rounded" />
        Product Builder
      </p>
      <h1 className="font-display text-6xl font-bold leading-none tracking-tighter text-gray-900 dark:text-gray-50 mb-4">
        Lakshay<br />Jain
      </h1>
      <p ref={bioRef} className="text-lg leading-relaxed text-gray-500 dark:text-gray-400 max-w-md mb-8 min-h-[3.5rem]" />
      <div className="flex flex-wrap gap-3">
        <a href="mailto:lakshayjain326@gmail.com"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Get in touch
        </a>
        <a href="https://github.com/LakshayJain1" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:border-violet-500 hover:text-violet-600 transition-colors">
          GitHub ↗
        </a>
        <a href="https://www.linkedin.com/in/lakshay-jain-3a5a7b286/" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:border-violet-500 hover:text-violet-600 transition-colors">
          LinkedIn ↗
        </a>
      </div>
      <div className="flex items-center gap-4 mt-9 pt-7 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_0_4px_rgba(74,222,128,0.2)] flex-shrink-0" />
        <span>Available for new projects</span>
        <span>·</span><span>Jaipur, India</span>
        <span>·</span><span>2+ yrs experience</span>
      </div>
    </div>
  );
}
