'use client';
import { useState, useCallback, useEffect } from 'react';

function load(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem('folio-notes') || '{}'); } catch { return {}; }
}
function save(n: Record<string, string[]>) {
  try { localStorage.setItem('folio-notes', JSON.stringify(n)); } catch {}
}

export function useNotes() {
  const [notes, setNotes] = useState<Record<string, string[]>>({});

  // load from localStorage after hydration
  useEffect(() => {
    setNotes(load());
  }, []);

  const addNote = useCallback((frameId: string, text: string) => {
    setNotes(prev => {
      const next = { ...prev, [frameId]: [...(prev[frameId] || []), text] };
      save(next);
      return next;
    });
  }, []);

  const deleteNote = useCallback((frameId: string, index: number) => {
    setNotes(prev => {
      const arr = [...(prev[frameId] || [])];
      arr.splice(index, 1);
      const next = { ...prev, [frameId]: arr };
      save(next);
      return next;
    });
  }, []);

  return { notes, addNote, deleteNote };
}
