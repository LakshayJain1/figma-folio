import { EnvelopeSimple, DeviceMobile, GithubLogo } from '@phosphor-icons/react';

const CONTACTS = [
  { Icon: EnvelopeSimple, text: 'lakshayjain326@gmail.com' },
  { Icon: DeviceMobile,   text: '+91-6378146202' },
  { Icon: GithubLogo,     text: 'github.com/LakshayJain1' },
];

export default function ContactFrame({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="p-7 select-none" onClick={onSelect}>
      <h2 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mb-1">Let&apos;s build something</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
        Open to freelance projects, full-time roles, and interesting collabs.
      </p>
      {CONTACTS.map(({ Icon, text }) => (
        <div key={text} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 mb-2 text-xs text-gray-700 dark:text-gray-300">
          <Icon size={14} className="text-violet-500 flex-shrink-0" weight="fill" />
          {text}
        </div>
      ))}
    </div>
  );
}
