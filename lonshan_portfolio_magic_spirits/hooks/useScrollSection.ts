'use client';

import { useEffect, useRef } from 'react';
import { useWorldStore } from '../store/worldStore';

const SECTIONS = ['hero', 'astral-terminal', 'memory-garden', 'chronicle-hall', 'elemental-archive', 'void-portal'];

export function useScrollSection(onSectionChange: (section: string) => void) {
  const setActiveSection = useWorldStore((s) => s.setActiveSection);
  const currentSection = useRef<string>('hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && currentSection.current !== id) {
            currentSection.current = id;
            setActiveSection(id);
            onSectionChange(id);
          }
        },
        { threshold: 0.4 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [setActiveSection, onSectionChange]);
}
