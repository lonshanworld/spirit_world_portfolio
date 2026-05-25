'use client';

/**
 * SpiritScene3D — Single unified React Three Fiber canvas.
 *
 * Replaces both:
 *   • ParticleField.tsx (background particles + starfield)
 *   • SpiritManager.tsx + SpiritOrb.tsx (all spirit rendering)
 *
 * Architecture:
 *   • One Canvas, position:fixed, full viewport, transparent, pointer-events:none
 *   • Camera at z=5, fov=60 — same as ParticleField
 *   • Background particles (Particles + Stars) as inner components
 *   • One Spirit3D per SpiritInstance from worldStore
 *   • EffectComposer with Bloom for glow post-processing
 *   • Scroll-aware: scrollY shared via mutable ref, updated on window 'scroll'
 *   • Custom document-level pointer detection: we read cursor position and
 *     compare world coords against each spirit's current 3D position to
 *     detect hover / click — no WebGL raycasting required (canvas pointer-events:none)
 */

import { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Spirit3D } from '../spirits/r3f/Spirit3D';
import { useWorldStore } from '../../store/worldStore';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { ElementType, SpiritInstance, SpiritInstanceId } from '../../types/spirit.types';
import { CURSOR } from '../../utils/cursorRef';

// ─── Constants ─────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 80;
const STAR_COUNT = 200;

// ─── Background particles (same as ParticleField) ──────────────────────────

function BackgroundParticles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3]     = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = 0.004 + Math.random() * 0.007;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useEffect(() => {
    if (!pointsRef.current) return;
    (pointsRef.current.material as THREE.PointsMaterial).color.set(color);
  }, [color]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes.position;
    const pos = attr.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      if (pos[i * 3 + 1] > 7)        pos[i * 3 + 1] = -7;
      if (Math.abs(pos[i * 3]) > 12) pos[i * 3] *= -0.95;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial transparent color={color} size={0.09} sizeAttenuation depthWrite={false} opacity={0.75} />
    </points>
  );
}

function StarField() {
  const positions = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = -8 - Math.random() * 8;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial transparent color="#ffffff" size={0.04} sizeAttenuation depthWrite={false} opacity={0.3} />
    </points>
  );
}

// ─── Inner scene (inside Canvas context) ──────────────────────────────────

interface SceneProps {
  spirits: Map<SpiritInstanceId, SpiritInstance>;
  particleColor: string;
  scrollY: React.MutableRefObject<number>;
  docHeight: React.MutableRefObject<number>;
  onTap: (element: ElementType, instanceId: SpiritInstanceId) => void;
  onHover: (instanceId: SpiritInstanceId, hovered: boolean) => void;
  onScreenPosition: (instanceId: SpiritInstanceId, element: ElementType, x: number, y: number) => void;
}

function Scene({ spirits, particleColor, scrollY, docHeight, onTap, onHover, onScreenPosition }: SceneProps) {
  const [tapPulseById, setTapPulseById] = useState<Map<SpiritInstanceId, number>>(new Map());

  const handleTapWithPulse = useCallback((element: ElementType, instanceId: SpiritInstanceId) => {
    setTapPulseById((prev) => {
      const next = new Map(prev);
      next.set(instanceId, (next.get(instanceId) ?? 0) + 1);
      return next;
    });
    onTap(element, instanceId);
  }, [onTap]);

  return (
    <>
      {/* Cinematic light rig focused on character readability */}
      <hemisphereLight intensity={0.5} color="#f9f3ff" groundColor="#0f1120" />
      <directionalLight position={[1.8, 2.6, 2.2]} intensity={0.9} color="#fff7eb" />
      <directionalLight position={[-2.2, 1.6, -1.8]} intensity={0.45} color="#8cc7ff" />
      <pointLight position={[0, 0.3, 2.8]} intensity={0.6} color="#ffffff" />

      {/* Background */}
      <StarField />
      <BackgroundParticles color={particleColor} />

      {/* Spirits */}
      {[...spirits.values()].map((instance) => (
        <Spirit3D
          key={instance.instanceId}
          instance={instance}
          scrollY={scrollY}
          docHeight={docHeight}
          onTap={handleTapWithPulse}
          onHover={onHover}
          onScreenPosition={onScreenPosition}
          tapPulse={tapPulseById.get(instance.instanceId) ?? 0}
        />
      ))}

    </>
  );
}

// ─── Public component ──────────────────────────────────────────────────────

export interface SpiritScene3DProps {
  onSpiritTap: (element: ElementType, instanceId: SpiritInstanceId) => void;
  onSpiritHover?: (element: ElementType, instanceId: SpiritInstanceId) => void;
}

export function SpiritScene3D({ onSpiritTap, onSpiritHover }: SpiritScene3DProps) {
  const spirits    = useWorldStore((s) => s.spirits);
  const setSpiritHovered = useWorldStore((s) => s.setSpiritHovered);
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const particleColor = THEMES[activeTheme]?.particleColor ?? '#888888';

  // Mutable refs shared into the R3F scene (avoids re-creating the Canvas)
  const scrollY   = useRef(0);
  const docHeight = useRef(typeof document !== 'undefined' ? document.documentElement.scrollHeight : 800);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    const onResize = () => { docHeight.current = document.documentElement.scrollHeight; };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ── Spirit hover detection via cursor distance ─────────────────────────
  // Since pointer-events:none on canvas, we can't use WebGL raycasting.
  // Instead we poll cursor position vs spirit screen positions on mousemove.
  // Spirit screen position is approximated from worldX/worldY % → px coords.
  // A 60px radius counts as hover.
  const HOVER_RADIUS_PX = 65;
  const hoveredRef = useRef<SpiritInstanceId | null>(null);
  const spiritScreenPosRef = useRef<Map<SpiritInstanceId, { x: number; y: number; element: ElementType }>>(new Map());

  const handleScreenPosition = useCallback((instanceId: SpiritInstanceId, element: ElementType, x: number, y: number) => {
    spiritScreenPosRef.current.set(instanceId, { x, y, element });
  }, []);

  const handleHover = useCallback((instanceId: SpiritInstanceId, hovered: boolean) => {
    setSpiritHovered(instanceId, hovered);
    if (hovered) {
      const spirit = spirits.get(instanceId);
      if (spirit && onSpiritHover) onSpiritHover(spirit.element, instanceId);
    }
  }, [setSpiritHovered, spirits, onSpiritHover]);

  const handleTap = useCallback((element: ElementType, instanceId: SpiritInstanceId) => {
    onSpiritTap(element, instanceId);
  }, [onSpiritTap]);

  // Keep only active instances in the live hit-test map.
  useEffect(() => {
    const liveIds = new Set(spirits.keys());
    for (const id of spiritScreenPosRef.current.keys()) {
      if (!liveIds.has(id)) spiritScreenPosRef.current.delete(id);
    }
  }, [spirits]);

  // Document-level mousemove → proximity hover
  useEffect(() => {
    const onMove = () => {
      let closestId: SpiritInstanceId | null = null;
      let closestDist = HOVER_RADIUS_PX;

      for (const [instanceId, pos] of spiritScreenPosRef.current) {
        const dx = CURSOR.x - pos.x;
        const dy = CURSOR.y - pos.y;
        const d = Math.hypot(dx, dy);
        if (d < closestDist) {
          closestDist = d;
          closestId = instanceId;
        }
      }

      if (closestId !== hoveredRef.current) {
        if (hoveredRef.current) handleHover(hoveredRef.current, false);
        if (closestId) handleHover(closestId, true);
        hoveredRef.current = closestId;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [spirits, handleHover]);

  // Document-level click → tap nearest spirit
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Canvas is pointer-events:none, so we receive clicks through the page.
      // Ignore explicit interactive controls, but allow normal page-space taps.
      const target = e.target as HTMLElement | null;
      if (target?.closest('a,button,input,textarea,select,option,label,[role="button"],[data-no-spirit-tap="true"]')) {
        return;
      }

      let closestId: SpiritInstanceId | null = null;
      let closestElement: ElementType = 'fire';
      let closestDist = HOVER_RADIUS_PX * 1.5;

      for (const [instanceId, pos] of spiritScreenPosRef.current) {
        const d = Math.hypot(e.clientX - pos.x, e.clientY - pos.y);
        if (d < closestDist) {
          closestDist = d;
          closestId = instanceId;
          closestElement = pos.element;
        }
      }

      if (closestId) handleTap(closestElement, closestId);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [spirits, handleTap]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Scene
          spirits={spirits}
          particleColor={particleColor}
          scrollY={scrollY}
          docHeight={docHeight}
          onTap={handleTap}
          onHover={handleHover}
          onScreenPosition={handleScreenPosition}
        />
      </Canvas>
    </div>
  );
}
