"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── BELo brand colours ────────────────────────────────────────────── */
const GOLD = new THREE.Color("#F5C842");
const ORANGE = new THREE.Color("#FF6B35");
const WHITE_FEATHER = new THREE.Color("#FFFDF5");

/* ── Procedural shuttlecock geometry built from primitives ───────── */

/** Cork base – half-sphere + cylinder */
function CorkBase() {
  return (
    <group position={[0, -0.55, 0]}>
      {/* Round dome */}
      <mesh>
        <sphereGeometry args={[0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GOLD} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Cylinder body */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.28, 0.26, 0.24, 32]} />
        <meshStandardMaterial color={GOLD} roughness={0.55} metalness={0.1} />
      </mesh>
    </group>
  );
}

/** Single feather – tapered plane with slight curve */
function Feather({ index, total }: { index: number; total: number }) {
  const angle = (index / total) * Math.PI * 2;
  const ref = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Tapered feather shape (narrow at base, wider at tip)
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.06, 0.35, 0.04, 0.7);
    shape.lineTo(0, 0.75);
    shape.lineTo(-0.04, 0.7);
    shape.quadraticCurveTo(-0.06, 0.35, 0, 0);

    const geo = new THREE.ShapeGeometry(shape, 8);
    // Bend the feather outward
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const bendAmount = y * y * 0.3; // quadratic bend
      positions.setZ(i, bendAmount);
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      position={[
        Math.sin(angle) * 0.15,
        -0.3,
        Math.cos(angle) * 0.15,
      ]}
      rotation={[
        -0.15, // tilt outward slightly
        -angle, // rotate around Y to fan out
        0,
      ]}
    >
      <meshStandardMaterial
        color={WHITE_FEATHER}
        side={THREE.DoubleSide}
        roughness={0.4}
        metalness={0.0}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

/** Full skirt – 16 feathers arranged in cone */
function FeatherSkirt() {
  const featherCount = 16;
  return (
    <group position={[0, 0.1, 0]}>
      {Array.from({ length: featherCount }).map((_, i) => (
        <Feather key={i} index={i} total={featherCount} />
      ))}
    </group>
  );
}

/** Glow ring at the equator between cork and feathers */
function GlowRing() {
  return (
    <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.3, 0.015, 16, 48]} />
      <MeshDistortMaterial
        color={ORANGE}
        emissive={ORANGE}
        emissiveIntensity={0.8}
        speed={2}
        distort={0.15}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/** Orbiting particle dots (BELo gold accent) */
function OrbitParticles() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 40;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.2 + Math.random() * 0.6;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = Math.random() > 0.5 ? GOLD : ORANGE;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

/** Slow auto-rotate + gentle tilt */
function ShuttlecockModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle float: slow Y rotation + slight wobble
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.x =
        Math.PI * 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} scale={1.8}>
        <CorkBase />
        <FeatherSkirt />
        <GlowRing />
        <OrbitParticles />
      </group>
    </Float>
  );
}

/* ── Exported scene ──────────────────────────────────────────────── */

export function ShuttlecockScene() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} color="#FFF8E1" />
        <pointLight position={[-2, -1, 3]} intensity={0.6} color={GOLD} />

        <ShuttlecockModel />
      </Canvas>
    </div>
  );
}
