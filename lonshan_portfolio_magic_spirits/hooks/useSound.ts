'use client';

import { useState, useCallback } from 'react';
import { getSoundEngine } from '../systems/soundEngine';
import { ElementType } from '../types/spirit.types';

export function useSound() {
  const [isEnabled, setIsEnabled] = useState(true);

  const playSpiritClick = useCallback((element: ElementType) => {
    getSoundEngine().playSpiritClick(element);
  }, []);

  const playThemeTransition = useCallback(() => {
    getSoundEngine().playThemeTransition();
  }, []);

  const playCombination = useCallback(() => {
    getSoundEngine().playCombination();
  }, []);

  const playDialogueAppear = useCallback(() => {
    getSoundEngine().playDialogueAppear();
  }, []);

  const toggleSound = useCallback(() => {
    const engine = getSoundEngine();
    const next = !engine.isEnabled();
    engine.setEnabled(next);
    setIsEnabled(next);
  }, []);

  return { isEnabled, playSpiritClick, playThemeTransition, playCombination, playDialogueAppear, toggleSound };
}
