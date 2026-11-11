import { Cloud, Robot, Sparkle, GraduationCap } from '@phosphor-icons/react';

const CERTS = [
  { Icon: Cloud,    name: 'Deploy Multi-Agent Architectures', issuer: 'Google Cloud · Nov 2026' },
  { Icon: Robot,    name: 'Engineer AI Agents with ADK',      issuer: 'Google Cloud · Oct 2026' },
  { Icon: Sparkle,  name: 'Create Your First Gemini Enterprise App', issuer: 'Google Cloud · Oct 2026' },
];

export default function CertsFrame({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="p-7 select-none" onClick={onSelect}>
      <h2 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mb-5">Certifications</h2>
      {CERTS.map(({ Icon, name, issuer }) => (
        <div key={name} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 mb-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Icon size={18} weight="fill" color="white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-snug">{name}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{issuer}</p>
          </div>
        </div>
      ))}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={13} className="text-gray-400" />
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Education</p>
        </div>
        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">BTech Computer Science (CSE)</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Poornima College of Engineering, Jaipur · 2025 · 7.3 CGPA</p>
      </div>
    </div>
  );
}
