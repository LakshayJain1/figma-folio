'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { CASES, FRAME_META } from '@/data/cases';
import HeroFrame from './frames/HeroFrame';
import CaseFrame from './frames/CaseFrame';
import SkillsFrame from './frames/SkillsFrame';
import CertsFrame from './frames/CertsFrame';
import ContactFrame from './frames/ContactFrame';

type Tool = 'move' | 'hand' | 'comment' | 'pencil';

interface Props {
  tool: Tool;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onOpenCase: (id: string) => void;
  notes: Record<string, string[]>;
  onAddNote: (frameId: string, text: string) => void;
}

interface Path { points: { x: number; y: number }[]; color: string }
interface Comment { id: number; cx: number; cy: number; frameId: string; text: string }

export default function Canvas({ tool, selected, onSelect, onOpenCase, notes, onAddNote }: Props) {
  const toolRef = useRef(tool);
  toolRef.current = tool;
  const { wrapRef, transform, zoomBy, fitToScreen, pct } = useCanvas(
    useCallback(() => toolRef.current === 'move' || toolRef.current === 'hand', [])
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [noteInput, setNoteInput] = useState<{ x: number; y: number; frameId: string } | null>(null);
  const [noteText, setNoteText] = useState('');
  const noteRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // expose zoom and fit to parent via window (simple approach)
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__canvasZoomBy = zoomBy;
    (window as unknown as Record<string, unknown>).__canvasFit = fitToScreen;
    (window as unknown as Record<string, unknown>).__canvasPct = pct;
  }, [zoomBy, fitToScreen, pct]);

  useEffect(() => {
    if (noteInput) noteRef.current?.focus();
  }, [noteInput]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if ((e.key === '+' || e.key === '=') && !e.shiftKey) zoomBy(1);
      if (e.key === '-') zoomBy(-1);
      if (e.key === '1' && e.shiftKey) fitToScreen();
      if (e.key === 'Escape') { onSelect(null); setNoteInput(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomBy, fitToScreen, onSelect]);

  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return { x: 0, y: 0 };
    const rect = wrap.getBoundingClientRect();
    return {
      x: (clientX - rect.left - transform.tx) / transform.scale,
      y: (clientY - rect.top - transform.ty) / transform.scale,
    };
  }, [wrapRef, transform]);

  const hitFrame = useCallback((cx: number, cy: number): string | null => {
    for (const [id, m] of Object.entries(FRAME_META)) {
      if (cx >= m.x && cx <= m.x + m.w && cy >= m.y && cy <= m.y + m.h) return id;
    }
    return null;
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const pt = toCanvas(e.clientX, e.clientY);

    if (tool === 'pencil') {
      setDrawing(true);
      setCurrentPath([pt]);
      return;
    }

    if (tool === 'comment') {
      const fid = hitFrame(pt.x, pt.y);
      setNoteInput({ x: e.clientX, y: e.clientY, frameId: fid || 'canvas' });
      return;
    }
  }, [tool, toCanvas, hitFrame]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (tool === 'pencil' && drawing) {
      const pt = toCanvas(e.clientX, e.clientY);
      setCurrentPath(p => [...p, pt]);
    }
  }, [tool, drawing, toCanvas]);

  const handleCanvasMouseUp = useCallback(() => {
    if (tool === 'pencil' && drawing) {
      if (currentPath.length > 1) {
        setPaths(p => [...p, { points: currentPath, color: '#a78bfa' }]);
      }
      setCurrentPath([]);
      setDrawing(false);
    }
  }, [tool, drawing, currentPath]);

  const submitNote = () => {
    if (!noteText.trim() || !noteInput) { setNoteInput(null); return; }
    const pt = toCanvas(noteInput.x, noteInput.y);
    const fid = noteInput.frameId;
    onAddNote(fid, noteText.trim());
    setComments(c => [...c, { id: nextId.current++, cx: pt.x, cy: pt.y, frameId: fid, text: noteText.trim() }]);
    setNoteText('');
    setNoteInput(null);
  };

  const toSvgPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const { tx, ty, scale } = transform;

  return (
    <div
      ref={wrapRef}
      className="flex-1 canvas-bg relative overflow-hidden"
      style={{ cursor: tool === 'hand' ? 'grab' : tool === 'pencil' ? 'crosshair' : tool === 'comment' ? 'cell' : 'default' }}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
    >
      {/* canvas transform wrapper */}
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
      >
        {/* pencil drawing SVG */}
        <svg
          ref={svgRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: 2200, height: 2200 }}
        >
          {paths.map((p, i) => (
            <path key={i} d={toSvgPath(p.points)} stroke={p.color} strokeWidth={2 / scale} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {currentPath.length > 1 && (
            <path d={toSvgPath(currentPath)} stroke="#a78bfa" strokeWidth={2 / scale} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>

        {/* comment pins */}
        {comments.map(c => (
          <div
            key={c.id}
            className="absolute w-6 h-6 -ml-3 -mt-6 flex items-end justify-center pointer-events-none"
            style={{ left: c.cx, top: c.cy }}
          >
            <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow flex items-center justify-center text-[9px] font-bold text-white">
              {c.id}
            </div>
          </div>
        ))}

        {/* frames */}
        {Object.entries(FRAME_META).map(([id, meta]) => (
          <div
            key={id}
            className={`canvas-frame absolute ${selected === id ? 'selected' : ''}`}
            style={{ left: meta.x, top: meta.y, width: meta.w }}
            onClick={e => {
              if (tool !== 'move') return;
              e.stopPropagation();
              onSelect(id);
              if (id.startsWith('case-')) onOpenCase(id);
            }}
          >
            {/* frame label above */}
            <div
              className="absolute -top-6 left-0 text-[11px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap pointer-events-none"
              style={{ transform: `scale(${1})` }}
            >
              {meta.name}
            </div>

            {id === 'hero' && <HeroFrame onSelect={() => onSelect(id)} />}
            {id.startsWith('case-') && (
              <CaseFrame
                case_={CASES.find(c => c.id === id)!}
                onOpen={() => onOpenCase(id)}
                onSelect={() => onSelect(id)}
              />
            )}
            {id === 'skills' && <SkillsFrame onSelect={() => onSelect(id)} />}
            {id === 'certs' && <CertsFrame onSelect={() => onSelect(id)} />}
            {id === 'contact' && <ContactFrame onSelect={() => onSelect(id)} />}

            {/* note badges */}
            {notes[id]?.length > 0 && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-bold text-white pointer-events-none">
                {notes[id].length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* note input overlay (screen space) */}
      {noteInput && (
        <div
          className="fixed z-40"
          style={{ left: noteInput.x, top: noteInput.y + 8 }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 w-56">
            <input
              ref={noteRef}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitNote(); if (e.key === 'Escape') setNoteInput(null); }}
              placeholder="Add a note…"
              className="w-full text-xs outline-none bg-transparent text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setNoteInput(null)} className="text-[10px] text-gray-400 hover:text-gray-600">Cancel</button>
              <button onClick={submitNote} className="text-[10px] font-semibold text-violet-600 hover:text-violet-500">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* clear pencil button */}
      {tool === 'pencil' && paths.length > 0 && (
        <button
          onDoubleClick={() => setPaths([])}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 pointer-events-auto"
          onClick={() => setPaths([])}
        >
          Clear drawings
        </button>
      )}

      {/* zoom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-lg shadow px-1 py-0.5">
        <button onClick={() => zoomBy(-1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm">−</button>
        <button onClick={fitToScreen} className="text-xs text-gray-600 dark:text-gray-300 px-2 min-w-[3rem] text-center hover:text-violet-600">{pct}%</button>
        <button onClick={() => zoomBy(1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm">+</button>
      </div>
    </div>
  );
}
