'use client';

/**
 * ParticleField — React Three Fiber 3D particle system.
 * Replaces the 2D canvas implementation with a true WebGL scene:
 *   • 80 themed floating particles with Z-depth
 *   • 200 faint background stars for cosmic depth
 *   • Fully transparent canvas — CSS gradient background shines through
 *   • Theme-reactive particle colour via Zustand
 *   • Adaptive DPR [1, 1.5] to cap GPU cost on high-density screens
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';

// ── Constants ──────────────────────────────────────────────────────
const PARTICLE_COUNT = 80;
const STAR_COUNT = 200;

// ── Themed floating particles ──────────────────────────────────────
function Particles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Stable position + velocity buffers — mutated each frame
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3]     = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = 0.004 + Math.random() * 0.007; // drift upward
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions: pos, velocities: vel };
  }, []);

  // Sync material colour when theme changes
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
      // Wrap out-of-bounds particles back into view
      if (pos[i * 3 + 1] > 7)        pos[i * 3 + 1] = -7;
      if (Math.abs(pos[i * 3]) > 12) pos[i * 3] *= -0.95;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color={color}
        size={0.09}
        sizeAttenuation
        depthWrite={false}
        opacity={0.75}
      />
    </points>
  );
}

// ── Faint static starfield for depth ──────────────────────────────
function Stars() {
  const positions = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = -8 - Math.random() * 8; // pushed to background
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#ffffff"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
      />
    </points>
  );
}

// ── Exported component ─────────────────────────────────────────────
export function ParticleField() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const color = THEMES[activeTheme]?.particleColor ?? '#888888';

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Stars />
        <Particles color={color} />
      </Canvas>
    </div>
  );
}
