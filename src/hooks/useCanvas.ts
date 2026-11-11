'use client';
import { useRef, useState, useCallback, useEffect } from 'react';

export interface Transform { scale: number; tx: number; ty: number }

export function useCanvas(canPan: () => boolean = () => true) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, tx: 0, ty: 0 });
  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const canPanRef = useRef(canPan);
  canPanRef.current = canPan;

  const applyZoomAt = useCallback((cx: number, cy: number, factor: number) => {
    setTransform(t => {
      const newScale = Math.min(3, Math.max(0.1, t.scale * factor));
      return {
        scale: newScale,
        tx: cx - (cx - t.tx) * (newScale / t.scale),
        ty: cy - (cy - t.ty) * (newScale / t.scale),
      };
    });
  }, []);

  const zoomBy = useCallback((delta: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { width, height } = wrap.getBoundingClientRect();
    applyZoomAt(width / 2, height / 2, delta > 0 ? 1.1 : 0.9);
  }, [applyZoomAt]);

  const fitToScreen = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { width, height } = wrap.getBoundingClientRect();
    const contentW = 2000, contentH = 2050;
    const s = Math.min(width / contentW, height / contentH) * 0.88;
    const scale = Math.round(s * 10) / 10;
    setTransform({ scale, tx: (width - contentW * scale) / 2, ty: (height - contentH * scale) / 2 });
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = wrap.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      if (e.ctrlKey || e.metaKey) {
        applyZoomAt(cx, cy, e.deltaY < 0 ? 1.08 : 0.92);
      } else {
        setTransform(t => ({ ...t, tx: t.tx - e.deltaX, ty: t.ty - e.deltaY }));
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!canPanRef.current()) return;
      isDragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      wrap.style.cursor = 'grabbing';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setTransform(t => ({ ...t, tx: t.tx + e.clientX - last.current.x, ty: t.ty + e.clientY - last.current.y }));
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging.current = false; wrap.style.cursor = ''; };

    // touch support
    let lastTouches: Touch[] = [];
    const onTouchStart = (e: TouchEvent) => {
      lastTouches = Array.from(e.touches);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touches = Array.from(e.touches);
      if (touches.length === 1 && canPanRef.current()) {
        const dx = touches[0].clientX - (lastTouches[0]?.clientX ?? touches[0].clientX);
        const dy = touches[0].clientY - (lastTouches[0]?.clientY ?? touches[0].clientY);
        setTransform(t => ({ ...t, tx: t.tx + dx, ty: t.ty + dy }));
      } else if (touches.length === 2 && lastTouches.length === 2) {
        const prev = Math.hypot(lastTouches[1].clientX - lastTouches[0].clientX, lastTouches[1].clientY - lastTouches[0].clientY);
        const next = Math.hypot(touches[1].clientX - touches[0].clientX, touches[1].clientY - touches[0].clientY);
        if (prev === 0) return;
        const rect = wrap.getBoundingClientRect();
        const mx = (touches[0].clientX + touches[1].clientX) / 2 - rect.left;
        const my = (touches[0].clientY + touches[1].clientY) / 2 - rect.top;
        applyZoomAt(mx, my, next / prev);
      }
      lastTouches = touches;
    };
    const onTouchEnd = (e: TouchEvent) => { lastTouches = Array.from(e.touches); };

    wrap.addEventListener('wheel', onWheel, { passive: false });
    wrap.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchmove', onTouchMove, { passive: false });
    wrap.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      wrap.removeEventListener('wheel', onWheel);
      wrap.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchmove', onTouchMove);
      wrap.removeEventListener('touchend', onTouchEnd);
    };
  }, [applyZoomAt]);

  // fit on mount
  useEffect(() => { setTimeout(fitToScreen, 50); }, [fitToScreen]);

  return { wrapRef, transform, zoomBy, fitToScreen, pct: Math.round(transform.scale * 100) };
}
