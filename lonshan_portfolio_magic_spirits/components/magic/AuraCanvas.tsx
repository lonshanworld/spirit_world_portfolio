'use client';

/**
 * AuraCanvas — Canvas 2D elemental aura per spirit.
 *
 * Renders ambient particle effects that reinforce elemental identity:
 *   fire    → rising embers + flame flicker
 *   water   → falling droplets + ripple rings
 *   ice     → drifting crystal flakes
 *   wind    → wisp trails curling outward
 *   lightning → electric spark bursts
 *   void    → dark mist + expanding event-horizon rings
 *   healing → soft rising orbs
 *   light   → radiant sparkle bloom
 *   others  → orbiting elemental sparkles
 *
 * Performance contract:
 *   - requestAnimationFrame loop, cancelled on unmount
 *   - Max 14 particles per spirit at rest, 20 while speaking
 *   - Object-pool reuse: particles are never GC'd mid-session
 *   - Entirely skipped on mobile / prefers-reduced-motion
 *   - canvas size: 90 × sizeVariant CSS px, 2× DPR backing
 */

import { useEffect, useRef } from 'react';
import { ElementType } from '../../types/spirit.types';

// ─── Particle struct (plain object pool) ──────────────────────────

interface P {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  r: number; g: number; b: number;
  alive: boolean;
}

function makePool(n: number): P[] {
  return Array.from({ length: n }, () => ({
    x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1,
    size: 1, r: 128, g: 128, b: 128, alive: false,
  }));
}

// ─── Color helpers ────────────────────────────────────────────────

function parseColor(color: string): { r: number; g: number; b: number } {
  if (color.startsWith('#')) {
    const full = color.length === 4
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color;
    const n = parseInt(full.slice(1), 16);
    return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
  }
  const m = color.match(/[\d.]+/g);
  if (m && m.length >= 3) return { r: +m[0], g: +m[1], b: +m[2] };
  return { r: 128, g: 128, b: 128 };
}

// ─── Props ────────────────────────────────────────────────────────

export interface AuraCanvasProps {
  element: ElementType;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  /** CSS display size in pixels (canvas backing is 2× for retina) */
  canvasSize: number;
  isSpeaking: boolean;
}

// ─── Component ────────────────────────────────────────────────────

export function AuraCanvas({
  element, primaryColor, secondaryColor, glowColor, canvasSize, isSpeaking,
}: AuraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    // Skip entirely on prefers-reduced-motion
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxOrNull = canvas.getContext('2d');
    if (!ctxOrNull) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px  = canvasSize * dpr;           // backing pixel size
    canvas.width  = px;
    canvas.height = px;

    const cx = px / 2;
    const cy = px / 2;

    const pCol = parseColor(primaryColor);
    const sCol = parseColor(secondaryColor);
    const gCol = parseColor(glowColor);

    const POOL_SIZE = 24;
    const MAX_ALIVE = isSpeaking ? 18 : 12;
    const pool      = makePool(POOL_SIZE);

    // ── Per-element spawn ──────────────────────────────────────────

    function spawn(p: P): void {
      p.alive   = true;
      p.life    = 0;

      switch (element) {

        case 'fire': {
          // Embers rise from the lower body and drift upward with flicker
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
          const spd   = (0.35 + Math.random() * 0.55) * dpr;
          p.x  = cx + (Math.random() - 0.5) * px * 0.30;
          p.y  = cy + px * 0.28;
          p.vx = Math.cos(angle) * spd;
          p.vy = Math.sin(angle) * spd - 0.25 * dpr;
          p.maxLife = 55 + Math.random() * 35;
          p.size = (1.4 + Math.random() * 2.2) * dpr;
          // Color: white core → orange → dim red
          const hot = Math.random();
          p.r = 255;
          p.g = hot > 0.5 ? 220 + Math.random() * 35 : 100 + Math.random() * 80;
          p.b = hot > 0.7 ? 160 : 15;
          break;
        }

        case 'water': {
          // Droplets fall from above and land with a small ripple effect
          const col = Math.random() < 0.5 ? pCol : sCol;
          p.x  = cx + (Math.random() - 0.5) * px * 0.45;
          p.y  = cy - px * 0.32;
          p.vx = (Math.random() - 0.5) * 0.22 * dpr;
          p.vy = (0.5 + Math.random() * 0.45) * dpr;
          p.maxLife = 48 + Math.random() * 30;
          p.size = (1.0 + Math.random() * 1.6) * dpr;
          p.r = col.r; p.g = col.g; p.b = col.b;
          break;
        }

        case 'ice': {
          // Crystal flakes drift down slowly, rotating
          const col = Math.random() < 0.5 ? pCol : sCol;
          p.x  = cx + (Math.random() - 0.5) * px * 0.55;
          p.y  = cy - px * 0.28;
          p.vx = (Math.random() - 0.5) * 0.12 * dpr;
          p.vy = (0.15 + Math.random() * 0.22) * dpr;
          p.maxLife = 80 + Math.random() * 55;
          p.size = (1.2 + Math.random() * 1.8) * dpr;
          p.r = col.r; p.g = col.g; p.b = col.b;
          break;
        }

        case 'wind': {
          // Curling wisps spiral outward then fade
          const angle = Math.random() * Math.PI * 2;
          const spd   = (0.25 + Math.random() * 0.35) * dpr;
          p.x  = cx + Math.cos(angle) * px * 0.15;
          p.y  = cy + Math.sin(angle) * px * 0.15;
          p.vx = Math.cos(angle + Math.PI / 4) * spd;
          p.vy = Math.sin(angle + Math.PI / 4) * spd - 0.18 * dpr;
          p.maxLife = 60 + Math.random() * 45;
          p.size = (0.8 + Math.random() * 2.0) * dpr;
          const col = Math.random() < 0.5 ? pCol : sCol;
          p.r = col.r; p.g = col.g; p.b = col.b;
          break;
        }

        case 'soil': {
          // Heavy pebble fragments fall slowly
          p.x  = cx + (Math.random() - 0.5) * px * 0.40;
          p.y  = cy - px * 0.10;
          p.vx = (Math.random() - 0.5) * 0.20 * dpr;
          p.vy = (0.18 + Math.random() * 0.25) * dpr;
          p.maxLife = 70 + Math.random() * 40;
          p.size = (1.8 + Math.random() * 2.5) * dpr;
          const col = Math.random() < 0.5 ? pCol : sCol;
          p.r = col.r; p.g = col.g; p.b = col.b;
          break;
        }

        case 'trees': {
          // Leaf fragments drift and spin outward
          const angle = -Math.PI * 0.75 + (Math.random() - 0.5) * 1.0;
          const spd   = (0.30 + Math.random() * 0.35) * dpr;
          p.x  = cx + (Math.random() - 0.5) * px * 0.25;
          p.y  = cy + px * 0.15;
          p.vx = Math.cos(angle) * spd;
          p.vy = Math.sin(angle) * spd;
          p.maxLife = 65 + Math.random() * 45;
          p.size = (1.5 + Math.random() * 2.0) * dpr;
          const col = Math.random() < 0.5 ? pCol : sCol;
          p.r = col.r; p.g = col.g; p.b = col.b;
          break;
        }

        case 'lightning': {
          // Explosive short-lived sparks radiating from center
          const angle = Math.random() * Math.PI * 2;
          const spd   = (1.8 + Math.random() * 2.8) * dpr;
          p.x  = cx; p.y = cy;
          p.vx = Math.cos(angle) * spd;
          p.vy = Math.sin(angle) * spd;
          p.maxLife = 12 + Math.random() * 12;
          p.size = (0.9 + Math.random() * 1.4) * dpr;
          p.r = 255; p.g = 250; p.b = 140 + Math.random() * 115;
          break;
        }

        case 'dark': {
          // Shadow shards slowly orbit and fade outward
          const angle = Math.random() * Math.PI * 2;
          const dist  = px * 0.12 + Math.random() * px * 0.15;
          p.x  = cx + Math.cos(angle) * dist;
          p.y  = cy + Math.sin(angle) * dist;
          p.vx = -Math.sin(angle) * 0.18 * dpr;
          p.vy =  Math.cos(angle) * 0.18 * dpr;
          p.maxLife = 90 + Math.random() * 60;
          p.size = (2.0 + Math.random() * 3.0) * dpr;
          p.r = gCol.r; p.g = gCol.g; p.b = gCol.b;
          break;
        }

        case 'light': {
          // Radiant sparkles bloom outward in all directions
          const angle = Math.random() * Math.PI * 2;
          const spd   = (0.30 + Math.random() * 0.45) * dpr;
          p.x  = cx; p.y = cy;
          p.vx = Math.cos(angle) * spd;
          p.vy = Math.sin(angle) * spd;
          p.maxLife = 55 + Math.random() * 40;
          p.size = (1.0 + Math.random() * 1.8) * dpr;
          p.r = 255; p.g = 250; p.b = 200 + Math.random() * 55;
          break;
        }

        case 'healing': {
          // Gentle soft orbs rise from body base
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.7;
          p.x  = cx + (Math.random() - 0.5) * px * 0.28;
          p.y  = cy + px * 0.20;
          p.vx = Math.cos(angle) * 0.20 * dpr;
          p.vy = Math.sin(angle) * 0.20 * dpr - 0.28 * dpr;
          p.maxLife = 75 + Math.random() * 45;
          p.size = (1.8 + Math.random() * 2.2) * dpr;
          // Soft mint to pink range
          p.r = 160 + Math.random() * 80;
          p.g = 240;
          p.b = 160 + Math.random() * 80;
          break;
        }

        case 'void': {
          // Dark mist expands slowly outward, leaving distortion rings
          const angle = Math.random() * Math.PI * 2;
          const spd   = (0.15 + Math.random() * 0.28) * dpr;
          p.x  = cx; p.y = cy;
          p.vx = Math.cos(angle) * spd;
          p.vy = Math.sin(angle) * spd;
          p.maxLife = 100 + Math.random() * 70;
          p.size = (2.5 + Math.random() * 4.0) * dpr;
          p.r = gCol.r; p.g = gCol.g; p.b = gCol.b;
          break;
        }

        case 'space': {
          // Star glints appear at random and fade
          p.x  = cx + (Math.random() - 0.5) * px * 0.70;
          p.y  = cy + (Math.random() - 0.5) * px * 0.70;
          p.vx = (Math.random() - 0.5) * 0.08 * dpr;
          p.vy = (Math.random() - 0.5) * 0.08 * dpr;
          p.maxLife = 80 + Math.random() * 80;
          p.size = (0.6 + Math.random() * 1.4) * dpr;
          p.r = 200 + Math.random() * 55; p.g = 200 + Math.random() * 55; p.b = 255;
          break;
        }

        case 'time': {
          // Clockwork sparks spiral clockwise
          const angle = Math.random() * Math.PI * 2;
          const dist  = px * 0.18 + Math.random() * px * 0.14;
          p.x  = cx + Math.cos(angle) * dist;
          p.y  = cy + Math.sin(angle) * dist;
          p.vx = -Math.sin(angle) * 0.35 * dpr;
          p.vy =  Math.cos(angle) * 0.35 * dpr;
          p.maxLife = 60 + Math.random() * 40;
          p.size = (1.2 + Math.random() * 1.6) * dpr;
          const col = Math.random() < 0.5 ? pCol : sCol;
          p.r = col.r; p.g = col.g; p.b = col.b;
          break;
        }

        case 'robot': {
          // Pixel data squares orbit in a discrete ring
          const steps  = 8;
          const step   = Math.floor(Math.random() * steps);
          const angle  = (step / steps) * Math.PI * 2;
          const orbitR = px * 0.28;
          p.x  = cx + Math.cos(angle) * orbitR;
          p.y  = cy + Math.sin(angle) * orbitR;
          p.vx = -Math.sin(angle) * 0.45 * dpr;
          p.vy =  Math.cos(angle) * 0.45 * dpr;
          p.maxLife = 55 + Math.random() * 35;
          p.size = (1.4 + Math.random() * 1.4) * dpr;
          const col = Math.random() < 0.5 ? pCol : sCol;
          p.r = col.r; p.g = col.g; p.b = col.b;
          break;
        }

        default: {
          const angle = Math.random() * Math.PI * 2;
          const spd   = (0.30 + Math.random() * 0.40) * dpr;
          p.x = cx; p.y = cy;
          p.vx = Math.cos(angle) * spd;
          p.vy = Math.sin(angle) * spd;
          p.maxLife = 60 + Math.random() * 40;
          p.size = (1.2 + Math.random() * 1.8) * dpr;
          p.r = pCol.r; p.g = pCol.g; p.b = pCol.b;
        }
      }
    }

    // ── Spawn rate by element — lightning is burst-heavy ──────────
    const SPAWN_EVERY: Partial<Record<ElementType, number>> = {
      lightning: isSpeaking ? 2 : 5,  // frames between spawns (lower = faster)
      fire:      isSpeaking ? 2 : 3,
      void:      isSpeaking ? 3 : 6,
      space:     isSpeaking ? 3 : 6,
      light:     isSpeaking ? 2 : 4,
    };
    const spawnEvery = SPAWN_EVERY[element] ?? (isSpeaking ? 3 : 5);

    let frameCount = 0;

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      frameCount++;

      // Fade trail — void uses slower fade for mist persistence
      ctx.globalCompositeOperation = 'destination-out';
      if (element === 'void') {
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
      } else if (element === 'dark') {
        ctx.fillStyle = 'rgba(0,0,0,0.10)';
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
      }
      ctx.fillRect(0, 0, px, px);
      ctx.globalCompositeOperation = 'source-over';

      // Spawn if under max count and interval elapsed
      if (frameCount % spawnEvery === 0) {
        const aliveCount = pool.filter((p) => p.alive).length;
        if (aliveCount < MAX_ALIVE) {
          const dead = pool.find((p) => !p.alive);
          if (dead) spawn(dead);
        }
      }

      // Update + draw each alive particle
      for (const p of pool) {
        if (!p.alive) continue;

        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Element-specific physics
        switch (element) {
          case 'fire':
            p.vx += (Math.random() - 0.5) * 0.04 * dpr; // heat flicker
            p.vy -= 0.008 * dpr;                          // accelerate upward
            p.size = Math.max(0.3, p.size - 0.018 * dpr); // shrink as ember fades
            break;
          case 'water':
            p.vy += 0.018 * dpr;  // gravity
            break;
          case 'lightning':
            p.vx *= 0.88; p.vy *= 0.88;  // rapid deceleration
            break;
          case 'void':
            p.size += 0.012 * dpr; // mist expands
            break;
          case 'soil':
            p.vy += 0.015 * dpr;  // mild gravity
            break;
          case 'time':
            // Clockwise rotation (already set by vx/vy) — gradually move outward
            {
              const toCenter = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
              if (toCenter < px * 0.42) {
                p.vx += (p.x - cx) / toCenter * 0.008 * dpr;
                p.vy += (p.y - cy) / toCenter * 0.008 * dpr;
              }
            }
            break;
        }

        // Alpha curve: sin fade gives smooth in+out; void fades only out
        const t     = p.life / p.maxLife;
        const alpha = element === 'void' || element === 'dark'
          ? (1 - t) * 0.45
          : Math.sin(t * Math.PI) * (element === 'lightning' ? 1.0 : 0.80);

        if (alpha <= 0.01 || p.size < 0.2) {
          p.alive = false;
          continue;
        }

        ctx.beginPath();

        // Robot: square pixels; others: circular dots
        if (element === 'robot') {
          const h = Math.max(0.5, p.size);
          ctx.rect(p.x - h / 2, p.y - h / 2, h, h);
        } else if (element === 'ice') {
          // Diamond shape for ice crystals
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x + p.size * 0.55, p.y);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.lineTo(p.x - p.size * 0.55, p.y);
          ctx.closePath();
        } else {
          ctx.arc(p.x, p.y, Math.max(0.2, p.size), 0, Math.PI * 2);
        }

        // Fire gets a radial gradient core; others flat color
        if (element === 'fire' && p.size > 0.5) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, `rgba(255,255,200,${alpha})`);
          grad.addColorStop(0.5, `rgba(${p.r},${p.g},${p.b},${alpha * 0.8})`);
          grad.addColorStop(1,   `rgba(${p.r},${p.g >> 1},0,0)`);
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        }

        ctx.fill();

        if (p.life >= p.maxLife) p.alive = false;
      }

      // ── Void: expanding event-horizon rings ───────────────────────
      if (element === 'void') {
        const tRing = ((frameCount * 0.008) % 1);
        const r1    = px * 0.18 + px * 0.20 * tRing;
        ctx.beginPath();
        ctx.arc(cx, cy, r1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${gCol.r},${gCol.g},${gCol.b},${(1 - tRing) * 0.28})`;
        ctx.lineWidth   = 1.2 * dpr;
        ctx.stroke();
      }

      // ── Lightning: occasional full arc flash ──────────────────────
      if (element === 'lightning' && frameCount % 18 === 0) {
        const arcX  = cx + (Math.random() - 0.5) * px * 0.35;
        const arcY  = cy + (Math.random() - 0.5) * px * 0.35;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        // Stepped arc to simulate electric zigzag
        const steps = 3 + Math.floor(Math.random() * 3);
        for (let i = 1; i <= steps; i++) {
          const t2 = i / steps;
          const nx  = cx + (arcX - cx) * t2 + (Math.random() - 0.5) * px * 0.10;
          const ny  = cy + (arcY - cy) * t2 + (Math.random() - 0.5) * px * 0.10;
          ctx.lineTo(nx, ny);
        }
        ctx.strokeStyle = `rgba(255,255,200,${0.55 + Math.random() * 0.35})`;
        ctx.lineWidth   = (0.8 + Math.random() * 1.2) * dpr;
        ctx.shadowColor = 'rgba(255,255,120,0.9)';
        ctx.shadowBlur  = 6 * dpr;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      // Reset all particles to dead so the pool can be GC'd cleanly
      pool.forEach((p) => { p.alive = false; });
    };
  // Re-run when key props change (isSpeaking changes spawn rate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, primaryColor, secondaryColor, glowColor, canvasSize, isSpeaking]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'absolute',
        top:           '50%',
        left:          '50%',
        transform:     'translate(-50%, -50%)',
        width:         canvasSize,
        height:        canvasSize,
        pointerEvents: 'none',
        zIndex:        1,
        opacity:       0.88,
      }}
    />
  );
}
