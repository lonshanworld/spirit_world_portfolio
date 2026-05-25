'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ElementType, EmotionType } from '../../../types/spirit.types';

type Gesture = 'rest' | 'wave' | 'cast' | 'cheer' | 'sad' | 'guard';
type SegmentShape = 'cylinder' | 'cone' | 'box';
type TipShape = 'orb' | 'shard' | 'leaf' | 'spark' | 'cube' | 'ring' | 'none';

interface AppendageStyle {
  x: number;
  y: number;
  len: number;
  width: number;
  tempo: number;
  lerp: number;
  swing: number;
  lift: number;
  segmentShape: SegmentShape;
  tipShape: TipShape;
}

const APPENDAGE_STYLE: Record<ElementType, AppendageStyle> = {
  fire: { x: 0.23, y: 0.08, len: 0.24, width: 0.046, tempo: 1.2, lerp: 0.16, swing: 0.18, lift: 0.14, segmentShape: 'cone', tipShape: 'spark' },
  water: { x: 0.22, y: 0.06, len: 0.25, width: 0.042, tempo: 0.8, lerp: 0.1, swing: 0.15, lift: 0.13, segmentShape: 'cylinder', tipShape: 'orb' },
  ice: { x: 0.22, y: 0.1, len: 0.21, width: 0.038, tempo: 0.82, lerp: 0.11, swing: 0.11, lift: 0.1, segmentShape: 'cone', tipShape: 'shard' },
  wind: { x: 0.23, y: 0.08, len: 0.24, width: 0.03, tempo: 1.18, lerp: 0.14, swing: 0.2, lift: 0.16, segmentShape: 'cylinder', tipShape: 'ring' },
  soil: { x: 0.24, y: 0.04, len: 0.2, width: 0.052, tempo: 0.66, lerp: 0.08, swing: 0.08, lift: 0.08, segmentShape: 'box', tipShape: 'cube' },
  trees: { x: 0.22, y: 0.05, len: 0.23, width: 0.036, tempo: 0.78, lerp: 0.09, swing: 0.1, lift: 0.11, segmentShape: 'cylinder', tipShape: 'leaf' },
  lightning: { x: 0.22, y: 0.11, len: 0.26, width: 0.03, tempo: 1.7, lerp: 0.2, swing: 0.2, lift: 0.18, segmentShape: 'box', tipShape: 'spark' },
  dark: { x: 0.24, y: 0.08, len: 0.22, width: 0.034, tempo: 0.74, lerp: 0.09, swing: 0.1, lift: 0.11, segmentShape: 'cone', tipShape: 'shard' },
  light: { x: 0.23, y: 0.09, len: 0.23, width: 0.034, tempo: 1.0, lerp: 0.12, swing: 0.14, lift: 0.14, segmentShape: 'cone', tipShape: 'spark' },
  healing: { x: 0.23, y: 0.07, len: 0.22, width: 0.038, tempo: 0.8, lerp: 0.1, swing: 0.11, lift: 0.12, segmentShape: 'cylinder', tipShape: 'leaf' },
  void: { x: 0.24, y: 0.07, len: 0.2, width: 0.033, tempo: 0.52, lerp: 0.07, swing: 0.08, lift: 0.08, segmentShape: 'cone', tipShape: 'none' },
  space: { x: 0.24, y: 0.08, len: 0.24, width: 0.032, tempo: 0.6, lerp: 0.08, swing: 0.14, lift: 0.12, segmentShape: 'cylinder', tipShape: 'orb' },
  time: { x: 0.22, y: 0.1, len: 0.22, width: 0.03, tempo: 0.58, lerp: 0.075, swing: 0.1, lift: 0.1, segmentShape: 'box', tipShape: 'ring' },
  robot: { x: 0.22, y: 0.06, len: 0.2, width: 0.045, tempo: 1.2, lerp: 0.16, swing: 0.08, lift: 0.08, segmentShape: 'box', tipShape: 'cube' },
};

function chooseGesture(emotion: EmotionType, isSpeaking: boolean, isHovered: boolean, isCasting: boolean): Gesture {
  if (isCasting) return 'cast';
  if (isHovered) return 'wave';
  if (isSpeaking) return 'cheer';
  if (emotion === 'sad' || emotion === 'sleepy') return 'sad';
  if (emotion === 'angry' || emotion === 'scared') return 'guard';
  return 'rest';
}

function orientSegment(mesh: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3, thickness: number) {
  const dir = to.clone().sub(from);
  const len = Math.max(0.0001, dir.length());
  mesh.position.copy(from.clone().add(to).multiplyScalar(0.5));
  mesh.scale.set(thickness, len, thickness);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
}

function renderTipShape(tipShape: TipShape) {
  if (tipShape === 'none') return null;
  if (tipShape === 'shard') return <octahedronGeometry args={[1, 0]} />;
  if (tipShape === 'leaf') return <sphereGeometry args={[1, 10, 8]} />;
  if (tipShape === 'spark') return <coneGeometry args={[1, 1, 8]} />;
  if (tipShape === 'cube') return <boxGeometry args={[1, 1, 1]} />;
  if (tipShape === 'ring') return <torusGeometry args={[1, 0.25, 8, 16]} />;
  return <sphereGeometry args={[1, 12, 10]} />;
}

function renderSegmentShape(shape: SegmentShape) {
  if (shape === 'cone') return <coneGeometry args={[1, 1, 10]} />;
  if (shape === 'box') return <boxGeometry args={[1, 1, 1]} />;
  return <cylinderGeometry args={[1, 1, 1, 10]} />;
}

interface AppendageRigProps {
  side: -1 | 1;
  style: AppendageStyle;
  element: ElementType;
  gesture: Gesture;
  color: string;
  isCasting: boolean;
}

function AppendageRig({ side, style, element, gesture, color, isCasting }: AppendageRigProps) {
  const segmentRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);

  const shoulder = useMemo(() => new THREE.Vector3(side * style.x, style.y, 0.05), [side, style.x, style.y]);
  const tipPos = useRef(new THREE.Vector3(side * (style.x + style.len), style.y - style.len * 0.5, 0.06));

  useFrame(({ clock }) => {
    if (!segmentRef.current) return;

    const t = clock.elapsedTime;
    let targetX = style.x + style.len * 0.95;
    let targetY = style.y - style.len * 0.45;

    if (gesture === 'wave') {
      targetX = style.x + style.len * 0.9 + Math.sin(t * 7 * style.tempo) * style.swing;
      targetY = style.y - style.len * 0.2 + Math.cos(t * 6 * style.tempo) * style.lift;
    } else if (gesture === 'cheer') {
      targetX = style.x + style.len * 0.68;
      targetY = style.y + style.lift * 0.6 + Math.sin(t * 4 * style.tempo) * 0.04;
    } else if (gesture === 'cast') {
      targetX = style.x + style.len * 1.2 + Math.sin(t * 9 * style.tempo) * style.swing * 0.5;
      targetY = style.y + style.lift * 0.25;
    } else if (gesture === 'sad') {
      targetX = style.x + style.len * 0.8;
      targetY = style.y - style.len * 0.75;
    } else if (gesture === 'guard') {
      targetX = style.x + style.len * 0.5;
      targetY = style.y + style.lift * 0.1;
    }

    if (element === 'void') {
      targetY += Math.sin(t * 0.7 + side * 0.8) * 0.015;
    }
    if (element === 'space') {
      targetX += Math.sin(t * 0.8 + side) * 0.018;
    }
    if (element === 'time') {
      targetY += Math.sin(t * 0.9 + Math.sin(t * 0.4)) * 0.012;
    }
    if (element === 'lightning') {
      targetX += Math.sin(t * 15 + side) * 0.02;
      targetY += Math.cos(t * 13 + side) * 0.015;
    }

    const signedX = side * targetX;
    tipPos.current.x += (signedX - tipPos.current.x) * style.lerp;
    tipPos.current.y += (targetY - tipPos.current.y) * style.lerp;

    orientSegment(segmentRef.current, shoulder, tipPos.current, style.width);

    if (tipRef.current) {
      tipRef.current.position.copy(tipPos.current);
      const s = style.tipShape === 'spark' ? 0.05 : style.tipShape === 'ring' ? 0.04 : 0.06;
      tipRef.current.scale.setScalar(s);
      tipRef.current.rotation.z = isCasting ? t * 4 : t * 1.4;
    }
  });

  const material = (
    <meshStandardMaterial color={color} roughness={0.32} metalness={0.08} emissive={color} emissiveIntensity={0.14} />
  );

  return (
    <group>
      <mesh ref={segmentRef}>
        {renderSegmentShape(style.segmentShape)}
        {material}
      </mesh>
      {style.tipShape !== 'none' && (
        <mesh ref={tipRef}>
          {renderTipShape(style.tipShape)}
          <meshStandardMaterial color={color} roughness={0.24} metalness={0.1} emissive={color} emissiveIntensity={0.22} transparent opacity={0.95} />
        </mesh>
      )}
    </group>
  );
}

export interface SpiritArms3DProps {
  element: ElementType;
  emotion: EmotionType;
  isSpeaking: boolean;
  isHovered: boolean;
  isListening: boolean;
  isCasting: boolean;
  primaryColor: string;
}

export function SpiritArms3D({ element, emotion, isSpeaking, isHovered, isCasting, primaryColor }: SpiritArms3DProps) {
  const gesture = chooseGesture(emotion, isSpeaking, isHovered, isCasting);
  const style = APPENDAGE_STYLE[element];

  return (
    <group renderOrder={4}>
      <AppendageRig side={-1} style={style} element={element} gesture={gesture} color={primaryColor} isCasting={isCasting} />
      <AppendageRig side={1} style={style} element={element} gesture={gesture} color={primaryColor} isCasting={isCasting} />
    </group>
  );
}
