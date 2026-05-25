'use client';

import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { SpiritMagicSeal } from '../../effects/SpiritMagicSeal';
import { useDialogueStore } from '../../../store/dialogueStore';
import { ElementType, EmotionType, SpiritInstance, SpiritInstanceId } from '../../../types/spirit.types';
import { SPIRIT_DEFINITIONS } from '../../../systems/elementData';
import { SpiritArms3D } from './SpiritArms3D';
import { SpiritAura3D } from './SpiritAura3D';
import { SpiritBody3D } from './SpiritBody3D';
import { SpiritEyes3D } from './SpiritEyes3D';
import { MagicEffect3D } from './MagicEffect3D';

const EMOTION_GLOW: Record<EmotionType, number> = {
  neutral: 0.45,
  excited: 0.95,
  calm: 0.3,
  mysterious: 0.55,
  playful: 0.72,
  happy: 0.76,
  sad: 0.2,
  surprised: 0.88,
  angry: 0.82,
  embarrassed: 0.48,
  sleepy: 0.15,
  confused: 0.5,
  proud: 0.62,
  curious: 0.58,
  scared: 0.78,
};

const EMOTION_TILT: Record<EmotionType, number> = {
  neutral: 0,
  excited: -4,
  calm: 1,
  mysterious: 3,
  playful: -6,
  happy: -3,
  sad: 4,
  surprised: -5,
  angry: -4,
  embarrassed: 2,
  sleepy: 6,
  confused: 5,
  proud: -2,
  curious: -4,
  scared: 3,
};

const MOVE_PROFILE: Record<ElementType, { speed: number; ampX: number; ampY: number; roamMin: number; roamMax: number }> = {
  fire: { speed: 1.25, ampX: 0.02, ampY: 0.026, roamMin: 24000, roamMax: 56000 },
  water: { speed: 0.8, ampX: 0.016, ampY: 0.022, roamMin: 30000, roamMax: 70000 },
  ice: { speed: 0.7, ampX: 0.013, ampY: 0.018, roamMin: 32000, roamMax: 76000 },
  wind: { speed: 1.35, ampX: 0.024, ampY: 0.03, roamMin: 20000, roamMax: 48000 },
  soil: { speed: 0.55, ampX: 0.01, ampY: 0.015, roamMin: 36000, roamMax: 86000 },
  trees: { speed: 0.7, ampX: 0.013, ampY: 0.018, roamMin: 34000, roamMax: 78000 },
  lightning: { speed: 1.65, ampX: 0.028, ampY: 0.035, roamMin: 18000, roamMax: 42000 },
  dark: { speed: 0.65, ampX: 0.014, ampY: 0.017, roamMin: 34000, roamMax: 76000 },
  light: { speed: 0.76, ampX: 0.015, ampY: 0.02, roamMin: 30000, roamMax: 68000 },
  healing: { speed: 0.68, ampX: 0.014, ampY: 0.018, roamMin: 32000, roamMax: 76000 },
  void: { speed: 0.52, ampX: 0.01, ampY: 0.014, roamMin: 42000, roamMax: 90000 },
  space: { speed: 0.45, ampX: 0.009, ampY: 0.012, roamMin: 46000, roamMax: 96000 },
  time: { speed: 0.58, ampX: 0.012, ampY: 0.014, roamMin: 38000, roamMax: 86000 },
  robot: { speed: 0.82, ampX: 0.01, ampY: 0.012, roamMin: 26000, roamMax: 62000 },
};

const PERSONALITY_MOTION: Record<ElementType, { extraX: number; extraY: number; extraSpin: number; jitter: number }> = {
  fire: { extraX: 0.02, extraY: 0.024, extraSpin: 0.014, jitter: 0.004 },
  water: { extraX: 0.015, extraY: 0.02, extraSpin: 0.007, jitter: 0.0015 },
  ice: { extraX: 0.01, extraY: 0.012, extraSpin: 0.005, jitter: 0.001 },
  wind: { extraX: 0.022, extraY: 0.025, extraSpin: 0.01, jitter: 0.003 },
  soil: { extraX: 0.008, extraY: 0.011, extraSpin: 0.004, jitter: 0.001 },
  trees: { extraX: 0.012, extraY: 0.016, extraSpin: 0.005, jitter: 0.0015 },
  lightning: { extraX: 0.03, extraY: 0.032, extraSpin: 0.02, jitter: 0.009 },
  dark: { extraX: 0.01, extraY: 0.013, extraSpin: 0.006, jitter: 0.002 },
  light: { extraX: 0.015, extraY: 0.018, extraSpin: 0.007, jitter: 0.002 },
  healing: { extraX: 0.01, extraY: 0.014, extraSpin: 0.005, jitter: 0.0015 },
  void: { extraX: 0.006, extraY: 0.008, extraSpin: 0.016, jitter: 0.001 },
  space: { extraX: 0.012, extraY: 0.01, extraSpin: 0.018, jitter: 0.0008 },
  time: { extraX: 0.009, extraY: 0.009, extraSpin: 0.014, jitter: 0.0008 },
  robot: { extraX: 0.007, extraY: 0.008, extraSpin: 0.004, jitter: 0.003 },
};

const CHARACTER_SCALE = 0.58;

function pxToThree(pxX: number, pxY: number, vpW: number, vpH: number): [number, number] {
  const halfW = (vpW / vpH) * 2.887;
  const halfH = 2.887;
  const tx = (pxX / vpW - 0.5) * halfW * 2;
  const ty = -(pxY / vpH - 0.5) * halfH * 2;
  return [tx, ty];
}

function DialogueBubble({ instance }: { instance: SpiritInstance }) {
  const current = useDialogueStore((s) => s.current);
  const isCurrent =
    current?.spiritInstanceId === instance.instanceId ||
    (!current?.spiritInstanceId && current?.spiritId === instance.element);

  if (!isCurrent || !current) return null;

  return (
    <Html
      position={[0, 0.72, 0.05]}
      zIndexRange={[140, 220]}
      style={{ pointerEvents: 'none', transform: 'translate(-50%, -100%)' }}
    >
      <div
        style={{
          background: 'rgba(9, 8, 18, 0.92)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '16px',
          padding: '10px 16px',
          minWidth: '240px',
          maxWidth: '380px',
          color: '#f8f7ff',
          fontSize: '13px',
          lineHeight: 1.45,
          textAlign: 'center',
          boxShadow: '0 8px 26px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          userSelect: 'none',
          whiteSpace: 'pre-wrap',
        }}
      >
        <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px', fontWeight: 700 }}>
          {instance.name} · {instance.typeLabel}
        </div>
        {current.text}
      </div>
    </Html>
  );
}

export interface Spirit3DProps {
  instance: SpiritInstance;
  scrollY: React.MutableRefObject<number>;
  docHeight: React.MutableRefObject<number>;
  onTap: (element: ElementType, instanceId: SpiritInstanceId) => void;
  onHover: (instanceId: SpiritInstanceId, hovered: boolean) => void;
  onScreenPosition?: (instanceId: SpiritInstanceId, element: ElementType, x: number, y: number) => void;
  tapPulse?: number;
}

export function Spirit3D({ instance, scrollY, docHeight, onTap: _onTap, onHover: _onHover, onScreenPosition, tapPulse = 0 }: Spirit3DProps) {
  const { size } = useThree();
  const def = SPIRIT_DEFINITIONS[instance.element];
  const move = MOVE_PROFILE[instance.element];
  const personality = PERSONALITY_MOTION[instance.element];

  const groupRef = useRef<THREE.Group>(null);
  const worldPosition = useRef(new THREE.Vector3());

  const worldX = useRef(instance.worldX);
  const worldY = useRef(instance.worldY);
  const targetX = useRef(instance.worldX);
  const targetY = useRef(instance.worldY);
  const floatPhase = useRef(instance.personalityOffset * Math.PI * 2);

  const [magicTrigger, setMagicTrigger] = useState(0);
  const [sealVisible, setSealVisible] = useState(false);
  const sealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const combatScale = useRef(1);
  const combatShake = useRef({ active: false, x: 0.08, y: 0.04 });

  const scheduleWander = useCallback(() => {
    const wait = move.roamMin + Math.random() * (move.roamMax - move.roamMin);
    const timer = setTimeout(() => {
      targetX.current = THREE.MathUtils.clamp(worldX.current + (Math.random() - 0.5) * 10, 4, 96);
      targetY.current = THREE.MathUtils.clamp(worldY.current + (Math.random() - 0.5) * 7, 4, 96);
      scheduleWander();
    }, wait);
    return timer;
  }, [move.roamMax, move.roamMin]);

  useEffect(() => {
    const timer = scheduleWander();
    return () => clearTimeout(timer);
  }, [scheduleWander]);

  useEffect(() => {
    if (instance.combatStatus === 'casting') {
      setMagicTrigger((v) => v + 1);
      setSealVisible(true);
      combatScale.current = 1.14;
    } else if (instance.combatStatus === 'hit') {
      combatScale.current = 0.92;
      combatShake.current.active = true;
    } else if (instance.combatStatus === 'victorious') {
      combatScale.current = 1.1;
    } else {
      combatScale.current = 1;
      combatShake.current.active = false;
    }

    if (sealTimer.current) clearTimeout(sealTimer.current);
    if (instance.combatStatus === 'casting') {
      sealTimer.current = setTimeout(() => {
        setSealVisible(false);
        sealTimer.current = null;
      }, 950);
    }
  }, [instance.combatStatus]);

  useEffect(() => {
    if (tapPulse <= 0) return;
    setMagicTrigger((v) => v + 1);
    setSealVisible(true);
    if (sealTimer.current) clearTimeout(sealTimer.current);
    sealTimer.current = setTimeout(() => {
      setSealVisible(false);
      sealTimer.current = null;
    }, 820);
  }, [tapPulse]);

  useEffect(
    () => () => {
      if (sealTimer.current) clearTimeout(sealTimer.current);
    },
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    worldX.current += (targetX.current - worldX.current) * 0.004;
    worldY.current += (targetY.current - worldY.current) * 0.004;

    const pxX = (worldX.current / 100) * size.width;
    const pxY = (worldY.current / 100) * Math.max(docHeight.current, size.height) - scrollY.current;
    const [baseX, baseY] = pxToThree(pxX, pxY, size.width, size.height);
    onScreenPosition?.(instance.instanceId, instance.element, pxX, pxY);

    const t = clock.elapsedTime + floatPhase.current;
    const floatX = Math.sin(t * move.speed * 0.8) * move.ampX * (size.width / size.height);
    const floatY = Math.sin(t * move.speed) * move.ampY;

    const signatureX = Math.sin(t * (move.speed * 0.45 + 0.3)) * personality.extraX * (size.width / size.height);
    const signatureY = Math.sin(t * (move.speed * 0.6 + 0.2) + Math.sin(t * 0.25)) * personality.extraY;
    const fireKick = instance.element === 'fire' ? Math.max(0, Math.sin(t * 3.2)) * 0.01 : 0;
    const waterLag = instance.element === 'water' ? Math.sin(t * 0.9) * 0.008 : 0;
    const lightningBurst = instance.element === 'lightning' ? Math.sin(t * 16) * 0.014 : 0;
    const voidGlide = instance.element === 'void' ? Math.sin(t * 0.45 + Math.sin(t * 0.2)) * 0.01 : 0;
    const spaceOrbit = instance.element === 'space' ? Math.sin(t * 0.55) * 0.012 : 0;
    const timeEcho = instance.element === 'time' ? Math.sin(t * 0.8 + Math.sin(t * 0.35)) * 0.01 : 0;

    const jitterX = (Math.random() - 0.5) * personality.jitter;
    const jitterY = (Math.random() - 0.5) * personality.jitter;

    const shakeX = combatShake.current.active ? (Math.random() - 0.5) * combatShake.current.x : jitterX;
    const shakeY = combatShake.current.active ? (Math.random() - 0.5) * combatShake.current.y : jitterY;

    const x = baseX + floatX + signatureX + spaceOrbit + lightningBurst + shakeX;
    const y = baseY + floatY + signatureY + fireKick + waterLag + voidGlide + timeEcho + shakeY;
    groupRef.current.position.set(x, y, 0);
    worldPosition.current.set(x, y, 0);

    const movingLeft = targetX.current < worldX.current - 0.6;
    const flip = movingLeft ? -1 : 1;
    const targetScale = CHARACTER_SCALE * instance.sizeVariant * combatScale.current;
    const current = Math.abs(groupRef.current.scale.x) || targetScale;
    const s = current + (targetScale - current) * 0.1;

    groupRef.current.scale.set(s * flip, s, s);
    groupRef.current.rotation.z = Math.sin(t * 0.7 + floatPhase.current) * personality.extraSpin;
  });

  const glow = useMemo(() => {
    if (instance.isHovered) return 0.95;
    if (instance.combatStatus === 'casting') return 0.9;
    return EMOTION_GLOW[instance.emotion] ?? 0.45;
  }, [instance.combatStatus, instance.emotion, instance.isHovered]);

  return (
    <group ref={groupRef}>
      <SpiritAura3D element={instance.element} isActive />

      <SpiritBody3D
        element={instance.element}
        primaryColor={def.primaryColor}
        secondaryColor={def.secondaryColor}
        glowColor={def.glowColor}
        glowIntensity={glow}
        tiltDeg={EMOTION_TILT[instance.emotion] ?? 0}
        scaleFactor={1}
        facingLeft={false}
      />

      <SpiritEyes3D
        element={instance.element}
        emotion={instance.emotion}
        isSpeaking={instance.isSpeaking}
        primaryColor={def.primaryColor}
        worldPosition={worldPosition.current}
        bodyScale={CHARACTER_SCALE}
      />

      <SpiritArms3D
        element={instance.element}
        emotion={instance.emotion}
        isSpeaking={instance.isSpeaking}
        isHovered={instance.isHovered}
        isListening={false}
        isCasting={instance.combatStatus === 'casting'}
        primaryColor={def.primaryColor}
      />

      <MagicEffect3D element={instance.element} trigger={magicTrigger} />

      <Html position={[0, 0.1, 0.08]} center style={{ pointerEvents: 'none' }}>
        <SpiritMagicSeal
          element={instance.element}
          primaryColor={def.primaryColor}
          secondaryColor={def.secondaryColor}
          glowColor={def.glowColor}
          castId={magicTrigger}
          visible={sealVisible}
          variant="mini"
        />
      </Html>

      <DialogueBubble instance={instance} />
    </group>
  );
}
