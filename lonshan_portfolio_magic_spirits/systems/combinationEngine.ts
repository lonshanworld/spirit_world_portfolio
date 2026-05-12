import { ElementType, HybridElement } from '../types/spirit.types';

/** Mapping of element pair → hybrid */
const COMBINATIONS: Map<string, HybridElement> = new Map([
  ['fire+soil', 'lava'],
  ['soil+fire', 'lava'],
  ['water+ice', 'frost'],
  ['ice+water', 'frost'],
  ['light+void', 'eclipse'],
  ['void+light', 'eclipse'],
  ['lightning+wind', 'storm'],
  ['wind+lightning', 'storm'],
  ['trees+water', 'bloom'],
  ['water+trees', 'bloom'],
  ['space+time', 'cosmos'],
  ['time+space', 'cosmos'],
  ['robot+lightning', 'cyber'],
  ['lightning+robot', 'cyber'],
  ['dark+fire', 'inferno'],
  ['fire+dark', 'inferno'],
  ['healing+light', 'divine'],
  ['light+healing', 'divine'],
]);

export function getCombination(a: ElementType, b: ElementType): HybridElement | null {
  return COMBINATIONS.get(`${a}+${b}`) ?? null;
}

export function isCombinableWith(a: ElementType, b: ElementType): boolean {
  return COMBINATIONS.has(`${a}+${b}`);
}

export function getCompatiblePairs(element: ElementType): ElementType[] {
  const partners: ElementType[] = [];
  COMBINATIONS.forEach((_, key) => {
    const [e1, e2] = key.split('+') as [ElementType, ElementType];
    if (e1 === element) partners.push(e2);
  });
  return partners;
}

/** How long (ms) the user has to tap a second spirit to trigger combination */
export const COMBINATION_WINDOW_MS = 2500;
