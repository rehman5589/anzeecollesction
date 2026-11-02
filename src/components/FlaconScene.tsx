/* ─────────────────────────────────────────────────────────────────────
 AN'ZEE COLLECTION · Interactive 3D Flacon Home
 Real product photography woven into the WebGL scene — label face,
 portrait medaillon, boutique backdrop — with procedural glass & gilding.
 ───────────────────────────────────────────────────────────────────── */

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, MeshReflectorMaterial, OrbitControls, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Perfume } from '../lib/data';

interface FlaconProps {
 perfume: Perfume;
 autoRotate: boolean;
 exploded: boolean;
 onToggleExploded: () => void;
}

const PROFILE: Record<Perfume['flacon'], { body: [number, number, number, number]; shoulder: number }> = {
 classic: { body: [1.06, 1.9, 0.52, 0.16], shoulder: 1.0 },
 solaire: { body: [1.0, 1.78, 0.5, 0.2], shoulder: 1.06 },
 oud: { body: [1.02, 2.06, 0.56, 0.1], shoulder: 0.92 },
 oval: { body: [1.16, 1.66, 0.5, 0.34], shoulder: 1.12 },
 warrior: { body: [0.94, 2.12, 0.54, 0.08], shoulder: 0.86 },
 gourmand: { body: [1.22, 1.72, 0.56, 0.42], shoulder: 1.16 },
};

function Flacon({ perfume, autoRotate, exploded, onToggleExploded }: FlaconProps) {
 const group = useRef<THREE.Group>(null!);
 const capRef = useRef<THREE.Group>(null!);
 const labelRef = useRef<THREE.Mesh>(null!);
 const photoRef = useRef<THREE.Mesh>(null!);
 const split = useRef(0);

 const [productMap, labelMap] = useTexture([perfume.image, perfume.image]);
 useEffect(() => {
 [productMap, labelMap].forEach((t) => {
 t.colorSpace = THREE.SRGBColorSpace;
 t.anisotropy = 8;
 });
 }, [productMap, labelMap]);

 const profile = PROFILE[perfume.flacon] ?? PROFILE.classic;
 const [bw, bh, bd, radius] = profile.body;
 const halfH = bh / 2;
 const halfD = bd / 2;

 const liquidColor = useMemo(() => new THREE.Color(perfume.colors.liquid), [perfume.colors.liquid]);
 const glassColor = useMemo(() => new THREE.Color(perfume.colors.glass), [perfume.colors.glass]);
 const capColor = useMemo(() => new THREE.Color(perfume.colors.cap), [perfume.colors.cap]);

 useFrame((state, delta) => {
 const t = state.clock.elapsedTime;
 split.current = THREE.MathUtils.damp(split.current, exploded ? 1 : 0, 4, delta);
 const k = split.current;

 if (group.current) {
 group.current.rotation.y = autoRotate ? t * 0.35 : group.current.rotation.y;
 group.current.position.y = Math.sin(t * 1.1) * 0.05 - 0.9;
 }
 if (capRef.current) {
 capRef.current.position.y = halfH + 0.28 + k * 1.55;
 capRef.current.rotation.y = t * (autoRotate ? 0.35 : 0.12);
 capRef.current.rotation.z = k * 0.32;
 }
 if (labelRef.current) {
 labelRef.current.position.z = halfD + 0.012 + k * 0.85;
 labelRef.current.rotation.x = -k * 0.42;
 }
 if (photoRef.current) {
 photoRef.current.position.z = -(halfD + 0.012 + k * 0.85);
 photoRef.current.rotation.x = k * 0.42;
 }
 });

 return (
 <group ref={group} position={[0, -0.9, 0]}>
 {/* ── Glass body ── */}
 <RoundedBox args={[bw, bh, bd]} radius={radius} smoothness={6} castShadow receiveShadow>
 <meshPhysicalMaterial
 color={glassColor}
 transmission={0.82}
 thickness={0.72}
 roughness={0.06}
 ior={1.46}
 clearcoat={1}
 clearcoatRoughness={0.08}
 attenuationColor={glassColor}
 attenuationDistance={1.4}
 envMapIntensity={1.15}
 />
 </RoundedBox>

 {/* ── Liquid heart ── */}
 <RoundedBox args={[bw * 0.8, bh * 0.78, bd * 0.8]} radius={radius * 0.75} smoothness={4} position={[0, -bh * 0.06, 0]}>
 <meshPhysicalMaterial
 color={liquidColor}
 roughness={0.14}
 metalness={0}
 clearcoat={0.65}
 clearcoatRoughness={0.25}
 emissive={liquidColor}
 emissiveIntensity={0.32}
 />
 </RoundedBox>

 {/* ── Shoulder taper ── */}
 <mesh position={[0, halfH + 0.09, 0]} scale={[profile.shoulder, 1, profile.shoulder]}>
 <cylinderGeometry args={[0.34, 0.52, 0.26, 40]} />
 <meshPhysicalMaterial color={glassColor} transmission={0.72} thickness={0.4} roughness={0.08} ior={1.46} clearcoat={1} envMapIntensity={1.1} />
 </mesh>

 {/* ── Neck ring (gilded) ── */}
 <mesh position={[0, halfH + 0.24, 0]}>
 <cylinderGeometry args={[0.29, 0.29, 0.09, 40]} />
 <meshStandardMaterial color={capColor} metalness={1} roughness={0.22} envMapIntensity={1.4} />
 </mesh>

 {/* ── Cap — separated on exploded view, click to reassemble ── */}
 <group ref={capRef} position={[0, halfH + 0.28, 0]} onClick={(e) => { e.stopPropagation(); onToggleExploded(); }}>
 <mesh castShadow>
 <cylinderGeometry args={[0.3, 0.34, 0.52, 40]} />
 <meshStandardMaterial color={capColor} metalness={1} roughness={0.18} envMapIntensity={1.5} />
 </mesh>
 <mesh position={[0, 0.31, 0]}>
 <cylinderGeometry args={[0.34, 0.3, 0.12, 40]} />
 <meshStandardMaterial color="#f6e7be" metalness={1} roughness={0.12} envMapIntensity={1.6} />
 </mesh>
 <mesh position={[0, 0.41, 0]}>
 <sphereGeometry args={[0.09, 24, 24]} />
 <meshStandardMaterial color="#e3c07b" metalness={1} roughness={0.1} envMapIntensity={1.7} />
 </mesh>
 </group>

 {/* ── FRONT LABEL — real AN’Zee product photography, framed & gilded ── */}
 <mesh ref={labelRef} position={[0, 0.06, halfD + 0.012]} onClick={(e) => { e.stopPropagation(); onToggleExploded(); }}>
 <planeGeometry args={[0.72, 0.94]} />
 <meshStandardMaterial map={labelMap} roughness={0.34} metalness={0.06} emissiveMap={labelMap} emissive="#ffffff" emissiveIntensity={0.16} />
 </mesh>
 {/* gilded label frame */}
 <mesh position={[0, 0.06, halfD + 0.008]}>
 <planeGeometry args={[0.8, 1.02]} />
 <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.28} />
 </mesh>

 {/* ── BACK MEDAILLON — the flacon’s own portrait ── */}
 <mesh ref={photoRef} position={[0, 0.06, -(halfD + 0.012)]} rotation={[0, Math.PI, 0]}>
 <circleGeometry args={[0.36, 44]} />
 <meshStandardMaterial map={productMap} roughness={0.3} emissiveMap={productMap} emissive="#ffffff" emissiveIntensity={0.12} />
 </mesh>
 <mesh position={[0, 0.06, -(halfD + 0.007)]} rotation={[0, Math.PI, 0]}>
 <ringGeometry args={[0.35, 0.42, 44]} />
 <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.26} />
 </mesh>

 {/* ── Base gilt plaque ── */}
 <mesh position={[0, -halfH + 0.16, 0]}>
 <cylinderGeometry args={[bw * 0.34, bw * 0.36, 0.07, 40]} />
 <meshStandardMaterial color="#a67c37" metalness={1} roughness={0.3} envMapIntensity={1.2} />
 </mesh>
 </group>
 );
}

function VelvetBackdrop() {
 const tex = useTexture('/images/boutique.webp');
 useEffect(() => {
 // eslint-disable-next-line react-hooks/immutability
 tex.colorSpace = THREE.SRGBColorSpace;
 }, [tex]);
 return (
 <mesh position={[0, 2.4, -7.5]}>
 <planeGeometry args={[26, 14]} />
 <meshBasicMaterial map={tex} transparent opacity={0.34} depthWrite={false} toneMapped={false} />
 </mesh>
 );
}

function Stage({ children }: { children: React.ReactNode }) {
 return (
 <group>
 {/* Mirrored champagne home floor */}
 <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.62, 0]} receiveShadow>
 <planeGeometry args={[30, 30]} />
 <MeshReflectorMaterial
 blur={[280, 60]}
 resolution={1024}
 mixBlur={0.9}
 mixStrength={9}
 roughness={0.86}
 depthScale={1.1}
 minDepthThreshold={0.4}
 maxDepthThreshold={1.4}
 color="#2e0810"
 metalness={0.62}
 mirror={0.55}
 />
 </mesh>
 {children}
 </group>
 );
}

export default function FlaconScene({ perfume, autoRotate, exploded, onToggleExploded, className }: { perfume: Perfume; autoRotate: boolean; exploded: boolean; onToggleExploded: () => void; className?: string }) {
 const [ready, setReady] = useState(false);
 return (
 <div className={className} aria-label={`Interactive 3D flacon of ${perfume.name}`}>
 <Canvas
 shadows
 dpr={[1, 2]}
 camera={{ position: [0, 0.2, 5.6], fov: 36 }}
 gl={{ antialias: true, alpha: true }}
 onCreated={() => setReady(true)}
 className="!touch-none"
 >
 <fog attach="fog" args={['#1c030a', 9.5, 17]} />
 <ambientLight intensity={0.55} color="#f3e6d4" />
 <directionalLight position={[4.5, 6, 4]} intensity={2.1} color="#fff3dd" castShadow shadow-mapSize={[1024, 1024]} />
 <directionalLight position={[-5, 3.5, -3]} intensity={0.9} color="#c69ba2" />
 <spotLight position={[0, 6.5, 2.5]} angle={0.55} penumbra={0.9} intensity={1.6} color="#edd391" />
 <pointLight position={[0, 0.4, 2.6]} intensity={0.7} color="#e3c07b" />

 <Suspense fallback={null}>
 <Float speed={1.6} rotationIntensity={0.22} floatIntensity={0.6} floatingRange={[-0.08, 0.14]}>
 <Flacon perfume={perfume} autoRotate={autoRotate} exploded={exploded} onToggleExploded={onToggleExploded} />
 </Float>
 <VelvetBackdrop />
 <Environment preset="sunset" />
 </Suspense>

 <Stage>
 <ContactShadows position={[0, -2.6, 0]} opacity={0.62} scale={11} blur={2.6} far={3.2} color="#12030a" />
 </Stage>

 <OrbitControls
 enablePan={false}
 enableZoom
 minDistance={3.4}
 maxDistance={8}
 minPolarAngle={0.62}
 maxPolarAngle={1.62}
 autoRotate={false}
 makeDefault
 />
 </Canvas>
 {/* WebGL fallback shimmer while textures stream in */}
 <div aria-hidden className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>
 <img loading="lazy" src={perfume.image} alt="" className="h-3/4 object-contain opacity-80 blur-[1px]" />
 </div>
 </div>
 );
}
