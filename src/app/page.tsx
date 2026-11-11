'use client';
import { useState, useEffect, useCallback } from 'react';
import Toolbar from '@/components/Toolbar';
import Canvas from '@/components/Canvas';
import LeftPanel from '@/components/panels/LeftPanel';
import RightPanel from '@/components/panels/RightPanel';
import DetailOverlay from '@/components/overlays/DetailOverlay';
import CommandPalette from '@/components/overlays/CommandPalette';
import { useNotes } from '@/hooks/useNotes';
import { CASES, FRAME_META } from '@/data/cases';

type Tool = 'move' | 'hand' | 'comment' | 'pencil';

export default function Home() {
  const [tool, setTool] = useState<Tool>('move');
  const [selected, setSelected] = useState<string | null>(null);
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const { notes, addNote, deleteNote } = useNotes();

  // sync zoom from canvas
  useEffect(() => {
    const id = setInterval(() => {
      const pct = (window as unknown as Record<string, unknown>).__canvasPct as number | undefined;
      if (pct !== undefined) setZoom(pct);
    }, 200);
    return () => clearInterval(id);
  }, []);

  // dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'v' || e.key === 'V') setTool('move');
      if (e.key === 'h' || e.key === 'H') setTool('hand');
      if (e.key === 'c' || e.key === 'C') setTool('comment');
      if (e.key === 'p' || e.key === 'P') setTool('pencil');
      if (e.key === '/') { e.preventDefault(); setCmdOpen(o => !o); }
      if (e.key === 'Escape') { setOpenCase(null); setCmdOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const zoomIn = useCallback(() => {
    const fn = (window as unknown as Record<string, unknown>).__canvasZoomBy as ((d: number) => void) | undefined;
    fn?.(1);
  }, []);

  const zoomOut = useCallback(() => {
    const fn = (window as unknown as Record<string, unknown>).__canvasZoomBy as ((d: number) => void) | undefined;
    fn?.(-1);
  }, []);

  const fit = useCallback(() => {
    const fn = (window as unknown as Record<string, unknown>).__canvasFit as (() => void) | undefined;
    fn?.();
  }, []);

  // select frame and scroll to it
  const handleLayerSelect = (id: string) => {
    setSelected(id);
    // navigate canvas to frame
    const meta = FRAME_META[id];
    if (!meta) return;
    const fn = (window as unknown as Record<string, unknown>).__canvasFit as (() => void) | undefined;
    fn?.();
  };

  const openCaseData = openCase ? CASES.find(c => c.id === openCase) : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--canvas-bg)]">
      <Toolbar
        tool={tool}
        onTool={setTool}
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fit}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        onShowLeft={() => setShowLeft(v => !v)}
        onShowRight={() => setShowRight(v => !v)}
        onShowCmd={() => setCmdOpen(o => !o)}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          selected={selected}
          onSelect={handleLayerSelect}
          open={showLeft}
          onClose={() => setShowLeft(false)}
        />

        <Canvas
          tool={tool}
          selected={selected}
          onSelect={setSelected}
          onOpenCase={setOpenCase}
          notes={notes}
          onAddNote={addNote}
        />

        <RightPanel
          selected={selected}
          notes={notes}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
          open={showRight}
          onClose={() => setShowRight(false)}
        />
      </div>

      {/* overlays */}
      {openCaseData && <DetailOverlay case_={openCaseData} onClose={() => setOpenCase(null)} />}
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}

      {/* slash hint */}
      {!cmdOpen && (
        <div className="fixed bottom-14 right-4 text-[10px] text-gray-400 dark:text-gray-600 pointer-events-none">
          Press <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">/</kbd> for terminal
        </div>
      )}
    </div>
  );
}
