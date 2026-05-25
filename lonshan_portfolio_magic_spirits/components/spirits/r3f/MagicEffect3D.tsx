'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ElementType } from '../../../types/spirit.types';

interface EffectStyle {
  color: string;
  accent: string;
  count: number;
  speed: number;
  arc: number;
}

const EFFECT_STYLE: Record<ElementType, EffectStyle> = {
  fire: { color: '#ff7b3a', accent: '#ffd690', count: 20, speed: 1.2, arc: 1.1 },
  water: { color: '#58b7ff', accent: '#d6f3ff', count: 16, speed: 0.8, arc: 0.6 },
  ice: { color: '#9edfff', accent: '#ffffff', count: 16, speed: 0.8, arc: 0.7 },
  wind: { color: '#8cf0d3', accent: '#f2fff8', count: 16, speed: 1.0, arc: 0.8 },
  soil: { color: '#d5ab75', accent: '#f1d6b8', count: 14, speed: 0.65, arc: 0.55 },
  trees: { color: '#7bdf72', accent: '#e7ffe2', count: 16, speed: 0.75, arc: 0.7 },
  lightning: { color: '#ffe86d', accent: '#fffdf0', count: 22, speed: 1.5, arc: 1.4 },
  dark: { color: '#8c69ff', accent: '#2d1b5a', count: 14, speed: 0.72, arc: 0.65 },
  light: { color: '#fff2a5', accent: '#ffffff', count: 18, speed: 0.95, arc: 0.9 },
  healing: { color: '#91ffc8', accent: '#ecfff5', count: 18, speed: 0.9, arc: 0.8 },
  void: { color: '#9670ff', accent: '#281649', count: 14, speed: 0.64, arc: 0.45 },
  space: { color: '#aab7ff', accent: '#ffffff', count: 15, speed: 0.62, arc: 0.5 },
  time: { color: '#f0cf8c', accent: '#fff7df', count: 14, speed: 0.58, arc: 0.42 },
  robot: { color: '#75c3ff', accent: '#e5f6ff', count: 18, speed: 1.1, arc: 0.82 },
};

const DURATION = 0.95;

export interface MagicEffect3DProps {
  element: ElementType;
  trigger: number;
  originX?: number;
  originY?: number;
}

export function MagicEffect3D({ element, trigger, originX = 0, originY = 0 }: MagicEffect3DProps) {
  const style = EFFECT_STYLE[element];
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const elapsed = useRef(-1);

  const seeds = useMemo(
    () =>
      Array.from({ length: style.count }, (_, i) => ({
        a: (i / style.count) * Math.PI * 2 + Math.random() * 0.5,
        s: 0.45 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })),
    [style.count],
  );

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: style.color, emissive: style.accent, emissiveIntensity: 0.45, roughness: 0.22, metalness: 0.03, transparent: true, opacity: 0.9, depthWrite: false }),
    [style.accent, style.color],
  );

  useEffect(() => {
    if (trigger > 0) elapsed.current = 0;
  }, [trigger]);

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (elapsed.current < 0) {
      for (let i = 0; i < style.count; i++) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
      return;
    }

    elapsed.current += delta;
    const p = Math.min(1, elapsed.current / DURATION);
    if (p >= 1) {
      elapsed.current = -1;
      return;
    }

    const fade = 1 - p;
    material.opacity = 0.86 * fade;

    seeds.forEach((seed, i) => {
      const spin = seed.a + elapsed.current * style.speed * 5;
      const r = p * (0.18 + seed.s * 0.25);
      const x = Math.cos(spin) * r;
      const z = Math.sin(spin) * r * 0.35;
      const y = Math.sin(p * Math.PI) * style.arc * 0.18 + Math.sin(elapsed.current * 8 + seed.phase) * 0.03;

      dummy.position.set(originX + x, originY + y, z);
      const scale = 0.018 + fade * (0.04 + seed.s * 0.02);
      dummy.scale.set(scale, scale * 1.6, scale);
      dummy.rotation.set(0, spin, seed.phase + elapsed.current * 6);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, style.count]} renderOrder={5}>
      <octahedronGeometry args={[1, 0]} />
      <primitive object={material} attach="material" />
    </instancedMesh>
  );
}
