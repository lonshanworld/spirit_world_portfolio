/**
 * cursorRef.ts
 *
 * Shared mutable cursor position store — a plain object, NOT React state.
 *
 * Why not Zustand / useState for cursor tracking:
 *   - Zustand.set triggers re-renders in all subscribing components
 *   - The cursor fires mousemove 60+ times/second
 *   - With 35+ spirit instances each subscribing to cursorX/Y, that is 2100+
 *     re-renders per second — catastrophic for frame rate
 *
 * This module exports a single mutable object that:
 *   - Is written to once per mousemove event in page.tsx (direct assignment, zero React overhead)
 *   - Is read by SpiritCreature components inside a requestAnimationFrame loop
 *     throttled to ~15 fps (every 4 frames) — limiting actual pupil state updates
 *     to a perceptually smooth but performant cadence
 */

export const CURSOR = { x: -9999, y: -9999 };
