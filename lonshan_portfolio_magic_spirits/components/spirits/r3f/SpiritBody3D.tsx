'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ElementType } from '../../../types/spirit.types';

interface BodyActing {
  pulseSpeed: number;
  pulseAmp: number;
  driftAmp: number;
}

const BODY_ACTING: Record<ElementType, BodyActing> = {
  fire: { pulseSpeed: 3.2, pulseAmp: 0.06, driftAmp: 0.02 },
  water: { pulseSpeed: 1.4, pulseAmp: 0.035, driftAmp: 0.016 },
  ice: { pulseSpeed: 1.9, pulseAmp: 0.028, driftAmp: 0.012 },
  wind: { pulseSpeed: 2.6, pulseAmp: 0.04, driftAmp: 0.018 },
  soil: { pulseSpeed: 1.4, pulseAmp: 0.024, driftAmp: 0.01 },
  trees: { pulseSpeed: 1.7, pulseAmp: 0.028, driftAmp: 0.012 },
  lightning: { pulseSpeed: 4.2, pulseAmp: 0.07, driftAmp: 0.022 },
  dark: { pulseSpeed: 1.7, pulseAmp: 0.028, driftAmp: 0.014 },
  light: { pulseSpeed: 2, pulseAmp: 0.032, driftAmp: 0.015 },
  healing: { pulseSpeed: 1.8, pulseAmp: 0.028, driftAmp: 0.014 },
  void: { pulseSpeed: 1.1, pulseAmp: 0.022, driftAmp: 0.01 },
  space: { pulseSpeed: 1.2, pulseAmp: 0.02, driftAmp: 0.012 },
  time: { pulseSpeed: 1.3, pulseAmp: 0.024, driftAmp: 0.011 },
  robot: { pulseSpeed: 2.2, pulseAmp: 0.018, driftAmp: 0.009 },
};

export interface SpiritBody3DProps {
  element: ElementType;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  glowIntensity: number;
  tiltDeg: number;
  scaleFactor: number;
  facingLeft: boolean;
}

export function SpiritBody3D({
  element,
  primaryColor,
  secondaryColor,
  glowColor,
  glowIntensity,
  tiltDeg,
  scaleFactor,
  facingLeft,
}: SpiritBody3DProps) {
  const rootRef = useRef<THREE.Group>(null);
  const flameTipsRef = useRef<(THREE.Mesh | null)[]>([]);
  const waterNodesRef = useRef<(THREE.Mesh | null)[]>([]);
  const lightningRef = useRef<(THREE.Mesh | null)[]>([]);
  const voidRingsRef = useRef<(THREE.Mesh | null)[]>([]);
  const spaceOrbitsRef = useRef<(THREE.Mesh | null)[]>([]);
  const timeLayersRef = useRef<(THREE.Mesh | null)[]>([]);
  const windRibbonsRef = useRef<(THREE.Mesh | null)[]>([]);
  const darkSpikesRef = useRef<(THREE.Mesh | null)[]>([]);
  const robotBitsRef = useRef<(THREE.Mesh | null)[]>([]);

  const acting = BODY_ACTING[element];
  const phase = useRef(Math.random() * Math.PI * 2);
  const emissive = useMemo(() => new THREE.Color(glowColor), [glowColor]);

  useFrame(({ clock }) => {
    if (!rootRef.current) return;

    const t = clock.elapsedTime + phase.current;
    const pulse = 1 + Math.sin(t * acting.pulseSpeed) * acting.pulseAmp;
    const sway = Math.sin(t * 0.9) * acting.driftAmp;

    rootRef.current.rotation.z += ((tiltDeg * Math.PI) / 180 + sway - rootRef.current.rotation.z) * 0.1;
    rootRef.current.position.y = Math.sin(t * 1.3) * acting.driftAmp;
    rootRef.current.scale.set(
      scaleFactor * pulse * (facingLeft ? -1 : 1),
      scaleFactor * (1 + Math.sin(t * acting.pulseSpeed + 0.7) * acting.pulseAmp),
      scaleFactor * (1 - Math.sin(t * acting.pulseSpeed + 0.2) * acting.pulseAmp * 0.6),
    );

    flameTipsRef.current.forEach((tip, i) => {
      if (!tip) return;
      tip.rotation.z = Math.sin(t * (3.8 + i * 0.7)) * 0.35;
      tip.position.y = 0.18 + i * 0.08 + Math.sin(t * (4 + i)) * 0.04;
    });

    waterNodesRef.current.forEach((node, i) => {
      if (!node) return;
      node.position.x = Math.sin(t * (0.9 + i * 0.2)) * (0.08 + i * 0.02);
      node.position.y = -0.06 + i * 0.12 + Math.cos(t * (1 + i * 0.3)) * 0.03;
    });

    lightningRef.current.forEach((branch, i) => {
      if (!branch) return;
      branch.rotation.z = Math.sin(t * (10 + i * 3)) * 0.5;
      branch.rotation.y = Math.cos(t * (8 + i * 2)) * 0.4;
      branch.position.x += (Math.random() - 0.5) * 0.01;
      branch.position.y += (Math.random() - 0.5) * 0.01;
    });

    voidRingsRef.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.x = t * (0.22 + i * 0.05);
      ring.rotation.y = -t * (0.14 + i * 0.03);
      ring.scale.setScalar(1 + Math.sin(t * (0.8 + i * 0.2)) * 0.12);
    });

    spaceOrbitsRef.current.forEach((orbit, i) => {
      if (!orbit) return;
      orbit.rotation.y = t * (0.2 + i * 0.08);
      orbit.rotation.z = Math.sin(t * (0.5 + i * 0.12)) * 0.4;
    });

    timeLayersRef.current.forEach((layer, i) => {
      if (!layer) return;
      layer.rotation.z = t * (0.24 + i * 0.05);
      layer.position.y = Math.sin(t * 0.8 + i * 0.6) * 0.02;
    });

    windRibbonsRef.current.forEach((ribbon, i) => {
      if (!ribbon) return;
      ribbon.rotation.z = Math.sin(t * (1.4 + i * 0.2)) * 0.6;
      ribbon.rotation.y = Math.cos(t * (0.9 + i * 0.18)) * 0.45;
    });

    darkSpikesRef.current.forEach((spike, i) => {
      if (!spike) return;
      spike.rotation.z = Math.sin(t * (1.2 + i * 0.2)) * 0.35;
      spike.position.y = -0.12 + i * 0.08 + Math.sin(t * (0.7 + i * 0.1)) * 0.02;
    });

    robotBitsRef.current.forEach((bit, i) => {
      if (!bit) return;
      bit.position.y = 0.1 + i * 0.08 + Math.sin(t * (2.5 + i)) * 0.01;
    });
  });

  const material = (
    <meshStandardMaterial
      color={primaryColor}
      emissive={emissive}
      emissiveIntensity={0.2 + glowIntensity * 0.4}
      roughness={0.34}
      metalness={0.08}
    />
  );

  const accentMaterial = (
    <meshStandardMaterial
      color={secondaryColor}
      emissive={emissive}
      emissiveIntensity={0.15 + glowIntensity * 0.28}
      roughness={0.3}
      metalness={0.06}
      transparent
      opacity={0.92}
    />
  );

  return (
    <group ref={rootRef}>
      {element === 'fire' && (
        <>
          <mesh position={[0, -0.04, 0]} scale={[0.28, 0.48, 0.28]}>
            <coneGeometry args={[1, 1, 20]} />
            {material}
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                flameTipsRef.current[i] = el;
              }}
              position={[i === 0 ? -0.12 : i === 1 ? 0 : 0.12, 0.2 + i * 0.08, 0]}
              scale={[0.12 - i * 0.02, 0.22 - i * 0.03, 0.11 - i * 0.02]}
            >
              <coneGeometry args={[1, 1, 14]} />
              {accentMaterial}
            </mesh>
          ))}
        </>
      )}

      {element === 'water' && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                waterNodesRef.current[i] = el;
              }}
              position={[0, -0.06 + i * 0.12, 0]}
              scale={[0.22 - i * 0.02, 0.2 - i * 0.015, 0.2 - i * 0.02]}
            >
              <sphereGeometry args={[1, 24, 20]} />
              {i < 2 ? material : accentMaterial}
            </mesh>
          ))}
          <mesh position={[0, 0.32, 0]} scale={[0.08, 0.16, 0.08]}>
            <sphereGeometry args={[1, 20, 18]} />
            {accentMaterial}
          </mesh>
        </>
      )}

      {element === 'lightning' && (
        <>
          <mesh position={[0, 0.02, 0]} scale={[0.2, 0.34, 0.2]}>
            <octahedronGeometry args={[1, 0]} />
            {material}
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                lightningRef.current[i] = el;
              }}
              position={[i % 2 === 0 ? -0.14 : 0.14, -0.04 + i * 0.09, 0]}
              rotation={[0, 0, i % 2 === 0 ? -0.6 : 0.6]}
              scale={[0.06, 0.22, 0.05]}
            >
              <boxGeometry args={[1, 1, 1]} />
              {accentMaterial}
            </mesh>
          ))}
        </>
      )}

      {element === 'void' && (
        <>
          <mesh position={[0, 0.01, 0]} scale={[0.3, 0.38, 0.34]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={primaryColor} emissive={emissive} emissiveIntensity={0.18 + glowIntensity * 0.3} roughness={0.56} metalness={0.02} />
          </mesh>
          {[0, 1].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                voidRingsRef.current[i] = el;
              }}
              rotation={[i * 0.6, i * 0.8, i * 0.2]}
              scale={[0.32 + i * 0.08, 0.32 + i * 0.08, 0.32 + i * 0.08]}
            >
              <torusKnotGeometry args={[1, 0.14, 70, 10, 2, 3]} />
              <meshStandardMaterial color={secondaryColor} emissive={emissive} emissiveIntensity={0.14 + glowIntensity * 0.24} roughness={0.48} transparent opacity={0.58} />
            </mesh>
          ))}
        </>
      )}

      {element === 'space' && (
        <>
          <mesh position={[0, 0, 0]} scale={[0.32, 0.4, 0.3]}>
            <sphereGeometry args={[1, 26, 24]} />
            <meshStandardMaterial color={primaryColor} emissive={emissive} emissiveIntensity={0.22 + glowIntensity * 0.3} roughness={0.28} metalness={0.08} />
          </mesh>
          {[0, 1].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                spaceOrbitsRef.current[i] = el;
              }}
              rotation={[i === 0 ? Math.PI / 2 : Math.PI / 4, 0, i === 0 ? 0 : Math.PI / 2.2]}
              scale={[0.34 + i * 0.1, 0.34 + i * 0.1, 0.34 + i * 0.1]}
            >
              <torusGeometry args={[1, 0.05, 10, 44]} />
              <meshStandardMaterial color={secondaryColor} emissive={emissive} emissiveIntensity={0.2 + glowIntensity * 0.18} roughness={0.22} transparent opacity={0.74} />
            </mesh>
          ))}
          {[-0.12, -0.03, 0.07, 0.14].map((x, i) => (
            <mesh key={i} position={[x, -0.05 + i * 0.08, 0.08]} scale={[0.02, 0.02, 0.02]}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} roughness={0.1} />
            </mesh>
          ))}
        </>
      )}

      {element === 'time' && (
        <>
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                timeLayersRef.current[i] = el;
              }}
              position={[0, -0.02 + i * 0.12, 0]}
              scale={[0.28 - i * 0.04, 0.1, 0.24 - i * 0.03]}
            >
              <cylinderGeometry args={[1, 1, 1, 16]} />
              {i === 1 ? accentMaterial : material}
            </mesh>
          ))}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.44, 0.44, 0.44]}>
            <torusGeometry args={[1, 0.04, 8, 42]} />
            {accentMaterial}
          </mesh>
        </>
      )}

      {element === 'ice' && (
        <>
          <mesh position={[0, 0.01, 0]} scale={[0.28, 0.42, 0.28]}>
            <octahedronGeometry args={[1, 0]} />
            {material}
          </mesh>
          {[-0.15, 0, 0.15].map((x, i) => (
            <mesh key={i} position={[x, 0.28, 0]} scale={[0.05, 0.16 - i * 0.02, 0.05]}>
              <octahedronGeometry args={[1, 0]} />
              {accentMaterial}
            </mesh>
          ))}
        </>
      )}

      {element === 'wind' && (
        <>
          <mesh position={[0, 0.02, 0]} scale={[0.26, 0.3, 0.24]}>
            <sphereGeometry args={[1, 24, 20]} />
            {material}
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                windRibbonsRef.current[i] = el;
              }}
              position={[0, -0.03 + i * 0.1, 0]}
              rotation={[Math.PI / 2, 0, i * 0.55]}
              scale={[0.26 + i * 0.08, 0.26 + i * 0.08, 0.26 + i * 0.08]}
            >
              <torusGeometry args={[1, 0.03, 10, 36]} />
              {accentMaterial}
            </mesh>
          ))}
        </>
      )}

      {element === 'soil' && (
        <>
          <mesh position={[0, -0.02, 0]} scale={[0.33, 0.29, 0.31]}>
            <dodecahedronGeometry args={[1, 0]} />
            {material}
          </mesh>
          <mesh position={[0, 0.14, 0]} scale={[0.22, 0.18, 0.2]}>
            <dodecahedronGeometry args={[1, 0]} />
            {accentMaterial}
          </mesh>
          <mesh position={[0, -0.2, 0]} scale={[0.4, 0.08, 0.33]}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
            {accentMaterial}
          </mesh>
        </>
      )}

      {element === 'trees' && (
        <>
          <mesh position={[0, -0.04, 0]} scale={[0.12, 0.26, 0.12]}>
            <cylinderGeometry args={[1, 1, 1, 10]} />
            {accentMaterial}
          </mesh>
          <mesh position={[0, 0.12, 0]} scale={[0.3, 0.24, 0.28]}>
            <sphereGeometry args={[1, 24, 20]} />
            {material}
          </mesh>
          {[-0.17, 0.17].map((x, i) => (
            <mesh key={i} position={[x, 0.18, 0]} scale={[0.09, 0.16, 0.08]} rotation={[0, 0, i === 0 ? 0.5 : -0.5]}>
              <sphereGeometry args={[1, 16, 14]} />
              {accentMaterial}
            </mesh>
          ))}
        </>
      )}

      {element === 'dark' && (
        <>
          <mesh position={[0, 0.02, 0]} scale={[0.3, 0.38, 0.3]}>
            <icosahedronGeometry args={[1, 1]} />
            {material}
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                darkSpikesRef.current[i] = el;
              }}
              position={[i === 0 ? -0.15 : i === 1 ? 0 : 0.15, -0.12 + i * 0.08, 0]}
              scale={[0.06, 0.2, 0.06]}
            >
              <coneGeometry args={[1, 1, 10]} />
              {accentMaterial}
            </mesh>
          ))}
        </>
      )}

      {element === 'light' && (
        <>
          <mesh position={[0, 0.03, 0]} scale={[0.28, 0.32, 0.28]}>
            <sphereGeometry args={[1, 24, 20]} />
            {material}
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.23, Math.sin(a) * 0.18 + 0.03, 0]} rotation={[0, 0, a]} scale={[0.06, 0.18, 0.06]}>
                <coneGeometry args={[1, 1, 10]} />
                {accentMaterial}
              </mesh>
            );
          })}
        </>
      )}

      {element === 'healing' && (
        <>
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.12, Math.sin(a) * 0.1, 0]} scale={[0.18, 0.2, 0.18]}>
                <sphereGeometry args={[1, 20, 18]} />
                {i % 2 === 0 ? material : accentMaterial}
              </mesh>
            );
          })}
          <mesh position={[0, 0.02, 0.05]} scale={[0.08, 0.14, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            {accentMaterial}
          </mesh>
        </>
      )}

      {element === 'robot' && (
        <>
          <mesh position={[0, 0, 0]} scale={[0.3, 0.26, 0.28]}>
            <boxGeometry args={[1, 1, 1]} />
            {material}
          </mesh>
          {[0, 1].map((i) => (
            <mesh
              key={i}
              ref={(el) => {
                robotBitsRef.current[i] = el;
              }}
              position={[i === 0 ? -0.12 : 0.12, 0.1 + i * 0.08, 0]}
              scale={[0.05, 0.05, 0.05]}
            >
              <boxGeometry args={[1, 1, 1]} />
              {accentMaterial}
            </mesh>
          ))}
          <mesh position={[0, -0.14, 0]} scale={[0.26, 0.05, 0.1]}>
            <boxGeometry args={[1, 1, 1]} />
            {accentMaterial}
          </mesh>
        </>
      )}
    </group>
  );
}
