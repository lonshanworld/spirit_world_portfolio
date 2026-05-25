'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ElementType, EmotionType } from '../../../types/spirit.types';
import { CURSOR } from '../../../utils/cursorRef';

interface EyeProfile {
  spread: number;
  y: number;
  z: number;
  eyeScale: [number, number, number];
  irisColor: string;
  pupilColor: string;
  browTilt: number;
  blinkCycle: number;
  lookMulX: number;
  lookMulY: number;
}

interface FaceAnchor {
  yOffset: number;
  zOffset: number;
  spreadMul: number;
  eyeScaleMul: number;
  browY: number;
  mouthY: number;
  mouthWidth: number;
}

const EYE_PROFILE: Record<ElementType, EyeProfile> = {
  fire: { spread: 0.14, y: 0.26, z: 0.11, eyeScale: [0.085, 0.11, 0.05], irisColor: '#ffb05c', pupilColor: '#2a1002', browTilt: 0.22, blinkCycle: 3.6, lookMulX: 1.3, lookMulY: 1.15 },
  water: { spread: 0.13, y: 0.25, z: 0.11, eyeScale: [0.09, 0.115, 0.05], irisColor: '#57b8ff', pupilColor: '#041536', browTilt: 0.08, blinkCycle: 5.8, lookMulX: 0.85, lookMulY: 0.8 },
  ice: { spread: 0.14, y: 0.27, z: 0.11, eyeScale: [0.085, 0.11, 0.05], irisColor: '#92dfff', pupilColor: '#12395c', browTilt: 0.06, blinkCycle: 5, lookMulX: 1, lookMulY: 1 },
  wind: { spread: 0.13, y: 0.26, z: 0.11, eyeScale: [0.084, 0.104, 0.05], irisColor: '#84e7c7', pupilColor: '#143d2a', browTilt: 0.1, blinkCycle: 4.6, lookMulX: 1.1, lookMulY: 1 },
  soil: { spread: 0.12, y: 0.25, z: 0.11, eyeScale: [0.082, 0.102, 0.05], irisColor: '#d1a86f', pupilColor: '#37220f', browTilt: 0.16, blinkCycle: 4.9, lookMulX: 0.9, lookMulY: 0.85 },
  trees: { spread: 0.13, y: 0.25, z: 0.11, eyeScale: [0.086, 0.108, 0.05], irisColor: '#8ddd72', pupilColor: '#153816', browTilt: 0.02, blinkCycle: 4.9, lookMulX: 0.95, lookMulY: 0.9 },
  lightning: { spread: 0.145, y: 0.28, z: 0.11, eyeScale: [0.09, 0.12, 0.05], irisColor: '#ffe86d', pupilColor: '#342a09', browTilt: 0.3, blinkCycle: 2.6, lookMulX: 1.55, lookMulY: 1.35 },
  dark: { spread: 0.15, y: 0.27, z: 0.11, eyeScale: [0.095, 0.118, 0.055], irisColor: '#ab96ff', pupilColor: '#efe8ff', browTilt: -0.1, blinkCycle: 5.2, lookMulX: 0.95, lookMulY: 0.9 },
  light: { spread: 0.14, y: 0.27, z: 0.11, eyeScale: [0.092, 0.118, 0.055], irisColor: '#ffef98', pupilColor: '#443a09', browTilt: 0, blinkCycle: 4.4, lookMulX: 1.05, lookMulY: 1 },
  healing: { spread: 0.13, y: 0.25, z: 0.11, eyeScale: [0.086, 0.11, 0.05], irisColor: '#7cf0bd', pupilColor: '#12402b', browTilt: -0.04, blinkCycle: 5.4, lookMulX: 0.85, lookMulY: 0.8 },
  void: { spread: 0.155, y: 0.27, z: 0.11, eyeScale: [0.1, 0.125, 0.058], irisColor: '#a080ff', pupilColor: '#ffffff', browTilt: -0.15, blinkCycle: 6.8, lookMulX: 0.7, lookMulY: 0.65 },
  space: { spread: 0.145, y: 0.27, z: 0.11, eyeScale: [0.096, 0.12, 0.056], irisColor: '#9fb4ff', pupilColor: '#ffffff', browTilt: -0.06, blinkCycle: 6.2, lookMulX: 0.75, lookMulY: 0.7 },
  time: { spread: 0.13, y: 0.285, z: 0.11, eyeScale: [0.085, 0.108, 0.05], irisColor: '#f2d28d', pupilColor: '#3d2c0f', browTilt: 0.02, blinkCycle: 5.1, lookMulX: 0.82, lookMulY: 0.86 },
  robot: { spread: 0.14, y: 0.25, z: 0.11, eyeScale: [0.096, 0.1, 0.05], irisColor: '#61bcff', pupilColor: '#eff8ff', browTilt: 0, blinkCycle: 3.9, lookMulX: 1.2, lookMulY: 1.1 },
};

const FACE_ANCHOR: Record<ElementType, FaceAnchor> = {
  fire: { yOffset: 0.03, zOffset: 0.01, spreadMul: 0.96, eyeScaleMul: 1.05, browY: 0.36, mouthY: 0.11, mouthWidth: 0.13 },
  water: { yOffset: 0.02, zOffset: 0.015, spreadMul: 0.92, eyeScaleMul: 1.07, browY: 0.34, mouthY: 0.1, mouthWidth: 0.12 },
  ice: { yOffset: 0.03, zOffset: 0.018, spreadMul: 0.94, eyeScaleMul: 1.0, browY: 0.35, mouthY: 0.105, mouthWidth: 0.11 },
  wind: { yOffset: 0.01, zOffset: 0.012, spreadMul: 0.9, eyeScaleMul: 1.04, browY: 0.34, mouthY: 0.1, mouthWidth: 0.12 },
  soil: { yOffset: 0.01, zOffset: 0.012, spreadMul: 0.88, eyeScaleMul: 0.98, browY: 0.33, mouthY: 0.095, mouthWidth: 0.1 },
  trees: { yOffset: 0.01, zOffset: 0.012, spreadMul: 0.9, eyeScaleMul: 1.02, browY: 0.33, mouthY: 0.1, mouthWidth: 0.11 },
  lightning: { yOffset: 0.04, zOffset: 0.018, spreadMul: 1.02, eyeScaleMul: 1.08, browY: 0.37, mouthY: 0.115, mouthWidth: 0.12 },
  dark: { yOffset: 0.02, zOffset: 0.02, spreadMul: 1.0, eyeScaleMul: 1.06, browY: 0.35, mouthY: 0.1, mouthWidth: 0.11 },
  light: { yOffset: 0.03, zOffset: 0.02, spreadMul: 0.98, eyeScaleMul: 1.08, browY: 0.36, mouthY: 0.11, mouthWidth: 0.12 },
  healing: { yOffset: 0.02, zOffset: 0.014, spreadMul: 0.9, eyeScaleMul: 1.05, browY: 0.34, mouthY: 0.1, mouthWidth: 0.115 },
  void: { yOffset: 0.01, zOffset: 0.02, spreadMul: 1.04, eyeScaleMul: 1.03, browY: 0.34, mouthY: 0.095, mouthWidth: 0.1 },
  space: { yOffset: 0.015, zOffset: 0.02, spreadMul: 1.01, eyeScaleMul: 1.03, browY: 0.35, mouthY: 0.1, mouthWidth: 0.11 },
  time: { yOffset: 0.035, zOffset: 0.018, spreadMul: 0.9, eyeScaleMul: 1.0, browY: 0.36, mouthY: 0.115, mouthWidth: 0.1 },
  robot: { yOffset: 0.005, zOffset: 0.03, spreadMul: 1.08, eyeScaleMul: 0.94, browY: 0.31, mouthY: 0.07, mouthWidth: 0.085 },
};

const EYE_EMOTION: Record<EmotionType, { open: number; mouth: number; brow: number }> = {
  neutral: { open: 1, mouth: 0.05, brow: 0 },
  excited: { open: 1.3, mouth: 0.1, brow: 0.08 },
  calm: { open: 0.8, mouth: 0.03, brow: -0.05 },
  mysterious: { open: 0.72, mouth: 0.02, brow: -0.12 },
  playful: { open: 1.12, mouth: 0.08, brow: 0.04 },
  happy: { open: 1.18, mouth: 0.1, brow: 0.02 },
  sad: { open: 0.68, mouth: 0.03, brow: -0.18 },
  surprised: { open: 1.45, mouth: 0.14, brow: 0.2 },
  angry: { open: 0.75, mouth: 0.05, brow: 0.28 },
  embarrassed: { open: 0.86, mouth: 0.04, brow: -0.02 },
  sleepy: { open: 0.45, mouth: 0.02, brow: -0.1 },
  confused: { open: 1.02, mouth: 0.06, brow: 0.12 },
  proud: { open: 0.92, mouth: 0.08, brow: 0.1 },
  curious: { open: 1.24, mouth: 0.06, brow: 0.16 },
  scared: { open: 1.5, mouth: 0.12, brow: 0.22 },
};

interface EyeUnitProps {
  side: -1 | 1;
  profile: EyeProfile;
  anchor: FaceAnchor;
  emotion: EmotionType;
}

function EyeUnit({ side, profile, anchor, emotion }: EyeUnitProps) {
  const eyeRef = useRef<THREE.Mesh>(null);
  const irisRef = useRef<THREE.Mesh>(null);
  const pupilRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const blinkOffset = useRef(Math.random() * 10);

  useFrame(({ clock }) => {
    if (!eyeRef.current || !irisRef.current || !pupilRef.current) return;

    const emo = EYE_EMOTION[emotion];
    const blinkT = (clock.elapsedTime + blinkOffset.current + (side === -1 ? 0.1 : 0)) % profile.blinkCycle;
    const blink = blinkT < 0.1 ? 0.08 : 1;
    const open = emo.open * blink;

    const ndcX = (CURSOR.x / size.width - 0.5) * 2;
    const ndcY = (CURSOR.y / size.height - 0.5) * 2;
    const lookX = THREE.MathUtils.clamp(ndcX * 0.02 * profile.lookMulX, -0.028, 0.028);
    const lookY = THREE.MathUtils.clamp(-ndcY * 0.015 * profile.lookMulY, -0.022, 0.022);

    const lightningJitter = profile.blinkCycle < 3 ? (Math.sin(clock.elapsedTime * 22) * 0.002) : 0;
    const timeLag = profile.blinkCycle > 5 && profile.lookMulX < 0.9 ? Math.sin(clock.elapsedTime * 0.8 + side * 0.6) * 0.003 : 0;

    eyeRef.current.scale.set(profile.eyeScale[0] * anchor.eyeScaleMul, profile.eyeScale[1] * open * anchor.eyeScaleMul, profile.eyeScale[2]);
    eyeRef.current.position.set(side * profile.spread * anchor.spreadMul, profile.y + anchor.yOffset, profile.z + anchor.zOffset);

    irisRef.current.position.set(side * profile.spread * anchor.spreadMul + lookX + lightningJitter + timeLag, profile.y + anchor.yOffset + lookY, profile.z + anchor.zOffset + 0.015);
    pupilRef.current.position.set(side * profile.spread * anchor.spreadMul + lookX * 1.4 + lightningJitter + timeLag, profile.y + anchor.yOffset + lookY * 1.4, profile.z + anchor.zOffset + 0.03);
  });

  return (
    <>
      <mesh ref={eyeRef}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#f4fbff" emissiveIntensity={0.18} roughness={0.22} metalness={0.02} />
      </mesh>

      <mesh ref={irisRef} scale={[0.04, 0.05, 0.02]}>
        <sphereGeometry args={[1, 18, 14]} />
        <meshStandardMaterial color={profile.irisColor} emissive={profile.irisColor} emissiveIntensity={0.25} roughness={0.2} metalness={0.03} />
      </mesh>

      <mesh ref={pupilRef} scale={[0.022, 0.03, 0.01]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={profile.pupilColor} roughness={0.35} metalness={0.02} />
      </mesh>
    </>
  );
}

function Brows({ profile, anchor, emotion, primaryColor }: { profile: EyeProfile; anchor: FaceAnchor; emotion: EmotionType; primaryColor: string }) {
  const emo = EYE_EMOTION[emotion];
  const tilt = profile.browTilt + emo.brow;

  return (
    <group position={[0, anchor.browY, profile.z + anchor.zOffset + 0.01]}>
      <mesh position={[-profile.spread * anchor.spreadMul, 0, 0]} rotation={[0, 0, tilt]} scale={[0.12, 0.018, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[profile.spread * anchor.spreadMul, 0, 0]} rotation={[0, 0, -tilt]} scale={[0.12, 0.018, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={0.15} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Mouth({ primaryColor, emotion, isSpeaking, anchor, profile }: { primaryColor: string; emotion: EmotionType; isSpeaking: boolean; anchor: FaceAnchor; profile: EyeProfile }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const emo = EYE_EMOTION[emotion];
    const talk = isSpeaking ? (0.03 + (Math.sin(clock.elapsedTime * 14) * 0.5 + 0.5) * 0.05) : emo.mouth;
    ref.current.scale.set(anchor.mouthWidth, talk, 0.03);
    ref.current.position.y = anchor.mouthY - (emo.open - 1) * 0.02;
    ref.current.position.z = profile.z + anchor.zOffset + 0.02;
  });

  return (
    <mesh ref={ref} position={[0, anchor.mouthY, profile.z + anchor.zOffset + 0.02]}>
      <sphereGeometry args={[1, 20, 14]} />
      <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={0.2} roughness={0.35} metalness={0.04} />
    </mesh>
  );
}

export interface SpiritEyes3DProps {
  element: ElementType;
  emotion: EmotionType;
  isSpeaking: boolean;
  primaryColor: string;
  worldPosition: THREE.Vector3;
  bodyScale: number;
}

export function SpiritEyes3D({ element, emotion, isSpeaking, primaryColor }: SpiritEyes3DProps) {
  const profile = EYE_PROFILE[element];
  const anchor = FACE_ANCHOR[element];

  return (
    <group renderOrder={6}>
      <EyeUnit side={-1} profile={profile} anchor={anchor} emotion={emotion} />
      <EyeUnit side={1} profile={profile} anchor={anchor} emotion={emotion} />
      <Brows profile={profile} anchor={anchor} emotion={emotion} primaryColor={primaryColor} />
      <Mouth primaryColor={primaryColor} emotion={emotion} isSpeaking={isSpeaking} anchor={anchor} profile={profile} />
    </group>
  );
}
