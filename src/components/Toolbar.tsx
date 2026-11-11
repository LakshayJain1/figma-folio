'use client';
import { useState } from 'react';
import { Cursor, Hand, ChatCircle, PencilSimple, Sun, Moon, SquaresFour, SlidersHorizontal, Terminal } from '@phosphor-icons/react';

type Tool = 'move' | 'hand' | 'comment' | 'pencil';

interface Props {
  tool: Tool;
  onTool: (t: Tool) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  onShowLeft?: () => void;
  onShowRight?: () => void;
  onShowCmd?: () => void;
}

const TOOLS: { id: Tool; key: string; Icon: React.ElementType; title: string }[] = [
  { id: 'move',    key: 'V', Icon: Cursor,            title: 'Move (V)' },
  { id: 'hand',    key: 'H', Icon: Hand,              title: 'Hand (H)' },
  { id: 'comment', key: 'C', Icon: ChatCircle,         title: 'Comment (C)' },
  { id: 'pencil',  key: 'P', Icon: PencilSimple,       title: 'Pencil (P) · click to clear' },
];

export default function Toolbar({ tool, onTool, zoom, onZoomIn, onZoomOut, onFit, darkMode, onToggleDark, onShowLeft, onShowRight, onShowCmd }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="h-10 bg-[#2c2c2c] flex items-center px-3 gap-1 flex-shrink-0 z-30">
      {/* mobile: layers toggle */}
      {onShowLeft && (
        <button onClick={onShowLeft} title="Layers" className="lg:hidden w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white">
          <SquaresFour size={15} />
        </button>
      )}

      {/* logo */}
      <div className="flex items-center gap-1.5 mr-3">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#a78bfa"/>
          <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#6366f1"/>
          <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#8b5cf6"/>
          <circle cx="14.5" cy="14.5" r="3.5" fill="#c4b5fd"/>
        </svg>
        <span className="text-[#d4d4d4] text-xs font-semibold tracking-tight">folio</span>
      </div>

      <div className="hidden sm:block w-px h-5 bg-white/10 mx-1" />

      {/* tools */}
      {TOOLS.map(({ id, Icon, title }) => (
        <button
          key={id}
          title={title}
          onClick={() => onTool(id)}
          className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
            tool === id
              ? 'bg-violet-600 text-white'
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Icon size={15} weight={tool === id ? 'fill' : 'regular'} />
        </button>
      ))}

      <div className="hidden sm:block w-px h-5 bg-white/10 mx-1" />

      <button onClick={onFit} title="Fit (Shift+1)" className="hidden sm:block text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors">
        Fit
      </button>

      {/* zoom */}
      <div className="hidden sm:flex items-center gap-0.5 ml-auto">
        <button onClick={onZoomOut} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors text-sm">−</button>
        <button onClick={onFit} className="text-xs text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors min-w-[3.5rem] text-center">
          {zoom}%
        </button>
        <button onClick={onZoomIn} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors text-sm">+</button>
      </div>

      <div className="ml-auto sm:ml-0 w-px h-5 bg-white/10 mx-1" />

      {/* theme */}
      <button onClick={onToggleDark} title="Toggle theme" className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors">
        {darkMode ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      {/* share */}
      <button
        onClick={handleShare}
        className={`text-xs font-semibold px-3 py-1 rounded transition-colors ml-1 ${
          copied ? 'bg-green-600 text-white' : 'bg-violet-600 text-white hover:bg-violet-500'
        }`}
      >
        {copied ? 'Copied!' : 'Share'}
      </button>

      {/* mobile: inspect + terminal toggles */}
      {onShowCmd && (
        <button onClick={onShowCmd} title="Terminal" className="lg:hidden w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white ml-1">
          <Terminal size={15} />
        </button>
      )}
      {onShowRight && (
        <button onClick={onShowRight} title="Inspect" className="lg:hidden w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white">
          <SlidersHorizontal size={15} />
        </button>
      )}
    </div>
  );
}
