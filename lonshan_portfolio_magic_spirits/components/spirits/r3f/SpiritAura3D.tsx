'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ElementType } from '../../../types/spirit.types';

interface AuraStyle {
  color: string;
  secondary: string;
  speed: number;
  radius: number;
  vertical: number;
  count: number;
}

const AURA_STYLE: Record<ElementType, AuraStyle> = {
  fire: { color: '#ff7b3a', secondary: '#ffd27a', speed: 0.9, radius: 0.52, vertical: 0.14, count: 16 },
  water: { color: '#57b7ff', secondary: '#c6ebff', speed: 0.45, radius: 0.5, vertical: 0.12, count: 14 },
  ice: { color: '#9edfff', secondary: '#e6f8ff', speed: 0.38, radius: 0.5, vertical: 0.1, count: 12 },
  wind: { color: '#96f2d6', secondary: '#e2fff2', speed: 0.7, radius: 0.5, vertical: 0.15, count: 14 },
  soil: { color: '#d8aa72', secondary: '#f7d8b0', speed: 0.3, radius: 0.5, vertical: 0.09, count: 10 },
  trees: { color: '#7bde70', secondary: '#d9ffd5', speed: 0.35, radius: 0.5, vertical: 0.12, count: 12 },
  lightning: { color: '#ffe86d', secondary: '#fffdf2', speed: 1.3, radius: 0.52, vertical: 0.17, count: 12 },
  dark: { color: '#7e5cff', secondary: '#2c1a56', speed: -0.28, radius: 0.53, vertical: 0.1, count: 12 },
  light: { color: '#fff2a0', secondary: '#ffffff', speed: 0.44, radius: 0.52, vertical: 0.11, count: 13 },
  healing: { color: '#8effc7', secondary: '#e8fff3', speed: 0.4, radius: 0.5, vertical: 0.12, count: 14 },
  void: { color: '#8e6aff', secondary: '#271447', speed: -0.2, radius: 0.55, vertical: 0.07, count: 10 },
  space: { color: '#a9b7ff', secondary: '#ffffff', speed: 0.24, radius: 0.56, vertical: 0.09, count: 12 },
  time: { color: '#f4d38d', secondary: '#fff3d4', speed: 0.2, radius: 0.53, vertical: 0.08, count: 11 },
  robot: { color: '#72bdff', secondary: '#d6f0ff', speed: 0.52, radius: 0.52, vertical: 0.06, count: 10 },
};

function AuraHalo({ style }: { style: AuraStyle }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.elapsedTime;
    ringRef.current.rotation.z = t * style.speed * 0.35;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.8) * 0.2;
    const m = ringRef.current.material as THREE.MeshStandardMaterial;
    m.opacity = 0.2 + Math.sin(t * 1.7) * 0.06;
  });

  return (
    <mesh ref={ringRef} position={[0, 0.02, -0.02]}>
      <torusGeometry args={[style.radius, 0.03, 12, 64]} />
      <meshStandardMaterial color={style.color} emissive={style.secondary} emissiveIntensity={0.2} roughness={0.4} metalness={0.05} transparent opacity={0.24} depthWrite={false} />
    </mesh>
  );
}

function OrbitMotes({ style }: { style: AuraStyle }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const points = useMemo(
    () =>
      Array.from({ length: style.count }, (_, i) => ({
        angle: (i / style.count) * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        r: style.radius - 0.08 + Math.random() * 0.12,
      })),
    [style.count, style.radius],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    points.forEach((p, i) => {
      const a = p.angle + t * style.speed;
      dummy.position.set(
        Math.cos(a) * p.r,
        Math.sin(t * 1.3 + p.phase) * style.vertical,
        Math.sin(a) * p.r,
      );
      const s = 0.035 + (Math.sin(t * 2 + p.phase) * 0.5 + 0.5) * 0.02;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, style.count]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial color={style.secondary} emissive={style.color} emissiveIntensity={0.35} roughness={0.26} metalness={0.05} transparent opacity={0.7} depthWrite={false} />
    </instancedMesh>
  );
}

function AccentLines({ style, element }: { style: AuraStyle; element: ElementType }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const spikes = element === 'lightning' ? 8 : 6;
    for (let i = 0; i < spikes; i++) {
      const a = (i / spikes) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * (style.radius - 0.12), 0, Math.sin(a) * (style.radius - 0.12)));
      pts.push(new THREE.Vector3(Math.cos(a) * (style.radius + 0.03), 0, Math.sin(a) * (style.radius + 0.03)));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [element, style.radius]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const t = clock.elapsedTime;
    lineRef.current.rotation.y = t * style.speed * 0.45;
    lineRef.current.position.y = Math.sin(t * 1.7) * 0.03;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.2 + Math.sin(t * 2.5) * 0.12;
  });

  return <lineSegments ref={lineRef} geometry={geometry} material={new THREE.LineBasicMaterial({ color: style.color, transparent: true, opacity: 0.28 })} />;
}

function FireOverlay() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => Array.from({ length: 10 }, () => ({ p: Math.random() * Math.PI * 2, r: 0.4 + Math.random() * 0.1 })), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const rise = ((t * 0.8 + i * 0.1) % 1);
      dummy.position.set(Math.cos(s.p + t * 0.7) * s.r * (1 - rise * 0.25), -0.22 + rise * 0.45, Math.sin(s.p + t * 0.7) * s.r * 0.7);
      dummy.scale.setScalar(0.03 + (1 - rise) * 0.035);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 10]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ffd27a" emissive="#ff7b3a" emissiveIntensity={0.55} roughness={0.24} transparent opacity={0.74} depthWrite={false} />
    </instancedMesh>
  );
}

function WaterOverlay() {
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.8 + i * 0.8) * 0.25;
      ring.rotation.z = Math.sin(t * 0.5 + i) * 0.25;
      const m = ring.material as THREE.MeshStandardMaterial;
      m.opacity = 0.14 + Math.sin(t * 1.2 + i) * 0.08;
    });
  });

  return (
    <>
      {[0, 1].map((i) => (
        <mesh key={i} ref={(el) => { rings.current[i] = el; }} scale={[0.88 + i * 0.1, 0.88 + i * 0.1, 0.88 + i * 0.1]}>
          <torusGeometry args={[0.5, 0.018, 8, 40]} />
          <meshStandardMaterial color="#bfe9ff" emissive="#57b7ff" emissiveIntensity={0.22} roughness={0.35} transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function LightningOverlay() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const arr = new Float32Array(8 * 6);
    return new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(arr, 3));
  }, []);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const t = clock.elapsedTime;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t * 2.5;
      const r0 = 0.32;
      const r1 = 0.54 + Math.sin(t * 11 + i) * 0.04;
      pos.setXYZ(i * 2, Math.cos(a) * r0, Math.sin(t * 6 + i) * 0.03, Math.sin(a) * r0 * 0.7);
      pos.setXYZ(i * 2 + 1, Math.cos(a) * r1, Math.sin(t * 9 + i) * 0.06, Math.sin(a) * r1 * 0.7);
    }
    pos.needsUpdate = true;
    const m = lineRef.current.material as THREE.LineBasicMaterial;
    m.opacity = 0.34 + Math.sin(t * 16) * 0.18;
  });

  return <lineSegments ref={lineRef} geometry={geometry} material={new THREE.LineBasicMaterial({ color: '#fff7b3', transparent: true, opacity: 0.45 })} />;
}

function VoidOverlay() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.z = -t * 0.2;
    ref.current.position.y = Math.sin(t * 0.5) * 0.02;
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.opacity = 0.2 + Math.sin(t * 1.3) * 0.08;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.04]}>
      <torusGeometry args={[0.58, 0.045, 10, 52]} />
      <meshStandardMaterial color="#3b255f" emissive="#8e6aff" emissiveIntensity={0.2} roughness={0.55} transparent opacity={0.26} depthWrite={false} />
    </mesh>
  );
}

function SpaceOverlay() {
  const stars = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(42 * 3);
    for (let i = 0; i < 42; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.34 + Math.random() * 0.28;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      arr[i * 3 + 2] = Math.sin(a) * r * 0.8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!stars.current) return;
    const t = clock.elapsedTime;
    stars.current.rotation.y = t * 0.18;
    stars.current.rotation.z = Math.sin(t * 0.35) * 0.18;
  });

  return (
    <points ref={stars}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.02} transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

function TimeOverlay() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.z = t * 0.22;
    ref.current.position.y = Math.sin(t * 0.6) * 0.015;
  });

  return (
    <group ref={ref}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.5, 0, Math.sin(a) * 0.32]} rotation={[0, 0, -a]} scale={[0.03, 0.14, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#fff3d4" emissive="#f4d38d" emissiveIntensity={0.25} roughness={0.35} transparent opacity={0.8} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function IceOverlay() {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push(new THREE.Vector3(0, 0, 0));
      pts.push(new THREE.Vector3(Math.cos(a) * 0.44, Math.sin(a) * 0.44, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.z = t * 0.3;
    const m = ref.current.material as THREE.LineBasicMaterial;
    m.opacity = 0.3 + Math.sin(t * 1.4) * 0.1;
  });

  return <lineSegments ref={ref} geometry={geo} material={new THREE.LineBasicMaterial({ color: '#d9f4ff', transparent: true, opacity: 0.38 })} />;
}

function WindOverlay() {
  const loops = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    loops.current.forEach((loop, i) => {
      if (!loop) return;
      loop.rotation.z = Math.sin(t * (1 + i * 0.25)) * 0.5;
      loop.rotation.y = t * (0.25 + i * 0.08);
    });
  });

  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { loops.current[i] = el; }} scale={[0.8 + i * 0.16, 0.8 + i * 0.16, 0.8 + i * 0.16]} rotation={[Math.PI / 2, 0, i * 0.6]}>
          <torusGeometry args={[0.42, 0.014, 8, 40]} />
          <meshStandardMaterial color="#dffef1" emissive="#96f2d6" emissiveIntensity={0.28} roughness={0.28} transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function SoilOverlay() {
  return <OrbitMotes style={{ color: '#c08957', secondary: '#e3be8a', speed: 0.12, radius: 0.43, vertical: 0.05, count: 9 }} />;
}

function TreesOverlay() {
  const leaves = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ a: (i / 10) * Math.PI * 2, p: Math.random() * Math.PI * 2 })), []);

  useFrame(({ clock }) => {
    if (!leaves.current) return;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      dummy.position.set(Math.cos(s.a + t * 0.18) * 0.42, -0.12 + ((t * 0.25 + i * 0.08) % 0.7), Math.sin(s.a + t * 0.18) * 0.28);
      dummy.scale.set(0.03, 0.06, 0.02);
      dummy.rotation.z = s.a;
      dummy.updateMatrix();
      leaves.current!.setMatrixAt(i, dummy.matrix);
    });
    leaves.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={leaves} args={[undefined, undefined, 10]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#d7ffd8" emissive="#7bde70" emissiveIntensity={0.22} roughness={0.35} transparent opacity={0.55} depthWrite={false} />
    </instancedMesh>
  );
}

function DarkOverlay() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = clock.elapsedTime;
    ring.current.rotation.y = -t * 0.18;
    ring.current.rotation.z = Math.sin(t * 0.8) * 0.25;
  });
  return (
    <mesh ref={ring}>
      <torusKnotGeometry args={[0.48, 0.05, 90, 12, 2, 3]} />
      <meshStandardMaterial color="#2f2257" emissive="#7e5cff" emissiveIntensity={0.18} roughness={0.56} transparent opacity={0.32} depthWrite={false} />
    </mesh>
  );
}

function HealingOverlay() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.z = t * 0.22;
  });
  return (
    <group ref={group}>
      <mesh scale={[0.4, 0.02, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e8fff3" emissive="#8effc7" emissiveIntensity={0.3} transparent opacity={0.62} depthWrite={false} />
      </mesh>
      <mesh scale={[0.02, 0.4, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e8fff3" emissive="#8effc7" emissiveIntensity={0.3} transparent opacity={0.62} depthWrite={false} />
      </mesh>
    </group>
  );
}

function RobotOverlay() {
  const scans = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    scans.current.forEach((scan, i) => {
      if (!scan) return;
      scan.position.y = -0.2 + ((t * (0.45 + i * 0.1) + i * 0.3) % 0.4);
    });
  });

  return (
    <>
      {[0, 1].map((i) => (
        <mesh key={i} ref={(el) => { scans.current[i] = el; }} position={[0, 0, 0]} scale={[0.5, 0.015, 0.18]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#d6f0ff" emissive="#72bdff" emissiveIntensity={0.35} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

export interface SpiritAura3DProps {
  element: ElementType;
  isActive?: boolean;
}

export function SpiritAura3D({ element, isActive = true }: SpiritAura3DProps) {
  if (!isActive) return null;
  const style = AURA_STYLE[element];

  if (element === 'fire') {
    return (
      <group renderOrder={1}>
        <FireOverlay />
        <AccentLines style={style} element={element} />
      </group>
    );
  }

  if (element === 'water') {
    return (
      <group renderOrder={1}>
        <WaterOverlay />
        <OrbitMotes style={{ ...style, count: 8, radius: 0.46, vertical: 0.09, speed: 0.22 }} />
      </group>
    );
  }

  if (element === 'lightning') {
    return (
      <group renderOrder={1}>
        <LightningOverlay />
        <AccentLines style={style} element={element} />
      </group>
    );
  }

  if (element === 'void') {
    return (
      <group renderOrder={1}>
        <VoidOverlay />
        <OrbitMotes style={{ ...style, count: 7, radius: 0.48, vertical: 0.04, speed: -0.1 }} />
      </group>
    );
  }

  if (element === 'space') {
    return (
      <group renderOrder={1}>
        <SpaceOverlay />
        <AuraHalo style={{ ...style, radius: 0.58, speed: 0.16, vertical: style.vertical, count: style.count }} />
      </group>
    );
  }

  if (element === 'time') {
    return (
      <group renderOrder={1}>
        <TimeOverlay />
        <AuraHalo style={{ ...style, radius: 0.5, speed: 0.14, vertical: style.vertical, count: style.count }} />
      </group>
    );
  }

  if (element === 'ice') {
    return (
      <group renderOrder={1}>
        <IceOverlay />
        <AuraHalo style={{ ...style, radius: 0.48, speed: 0.12, vertical: style.vertical, count: style.count }} />
      </group>
    );
  }

  if (element === 'wind') {
    return (
      <group renderOrder={1}>
        <WindOverlay />
        <OrbitMotes style={{ ...style, count: 10, radius: 0.44, vertical: 0.12, speed: 0.4 }} />
      </group>
    );
  }

  if (element === 'soil') {
    return (
      <group renderOrder={1}>
        <SoilOverlay />
        <AuraHalo style={{ ...style, radius: 0.45, speed: 0.08, vertical: style.vertical, count: style.count }} />
      </group>
    );
  }

  if (element === 'trees') {
    return (
      <group renderOrder={1}>
        <TreesOverlay />
        <AuraHalo style={{ ...style, radius: 0.46, speed: 0.1, vertical: style.vertical, count: style.count }} />
      </group>
    );
  }

  if (element === 'dark') {
    return (
      <group renderOrder={1}>
        <DarkOverlay />
        <OrbitMotes style={{ ...style, count: 8, radius: 0.5, vertical: 0.06, speed: -0.14 }} />
      </group>
    );
  }

  if (element === 'healing') {
    return (
      <group renderOrder={1}>
        <HealingOverlay />
        <OrbitMotes style={{ ...style, count: 11, radius: 0.44, vertical: 0.12, speed: 0.2 }} />
      </group>
    );
  }

  if (element === 'robot') {
    return (
      <group renderOrder={1}>
        <RobotOverlay />
        <AuraHalo style={{ ...style, radius: 0.47, speed: 0.3, vertical: style.vertical, count: style.count }} />
      </group>
    );
  }

  return (
    <group renderOrder={1}>
      <AuraHalo style={style} />
      <OrbitMotes style={style} />
      {element === 'light' && (
        <AccentLines style={style} element={element} />
      )}
    </group>
  );
}
