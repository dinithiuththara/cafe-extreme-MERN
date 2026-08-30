import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
// Maps a value from [start, end] of the overall progress into its own 0-1
// range — used to carve the single 0-1 scroll progress into the sequence's
// distinct beats (beans falling, pouring, steam, etc).
const phase = (progress, start, end) => clamp01((progress - start) / (end - start));

// Deterministic pseudo-random so the bean layout is stable across reloads
// (no hydration/flicker concerns) without needing a seeded RNG library.
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9973.13) * 43758.5453;
  return x - Math.floor(x);
};

const BEAN_COUNT = 14;

const beanData = Array.from({ length: BEAN_COUNT }, (_, i) => {
  const angle = seededRandom(i) * Math.PI * 2;
  const spread = 0.6 + seededRandom(i + 50) * 1.6;
  return {
    startX: Math.cos(angle) * spread * 0.4,
    startY: 4.5 + seededRandom(i + 100) * 2,
    startZ: Math.sin(angle) * spread * 0.4,
    endX: Math.cos(angle) * (0.9 + seededRandom(i + 20) * 0.7),
    endY: -0.95 + seededRandom(i + 30) * 0.15,
    endZ: Math.sin(angle) * (0.9 + seededRandom(i + 20) * 0.7),
    fallDelay: seededRandom(i + 200) * 0.15, // slight stagger so beans don't fall in lockstep
    rotSpeed: 0.8 + seededRandom(i + 300) * 1.4,
  };
});

// The animated scene. Reads a mutable progress ref every frame (rather than
// React state) so scroll updates never trigger React re-renders — this is
// what makes the interpolation buttery smooth at any scroll speed.
const BrewScene = ({ progressRef }) => {
  const smoothed = useRef(0);
  const cameraGroup = useRef();
  const beansRef = useRef();
  const fillRef = useRef();
  const streamRef = useRef();
  const cremaRef = useRef();
  const steamRefs = useRef([]);

  useFrame((state, delta) => {
    // Smooth the raw scroll progress toward its target — this is what gives
    // "smooth interpolation" even on fast, jerky scroll input.
    const target = progressRef.current;
    smoothed.current += (target - smoothed.current) * Math.min(1, delta * 6);
    const p = smoothed.current;
    const t = state.clock.elapsedTime;

    // --- Beat 1: beans fall & settle (0 -> 0.4) ---
    if (beansRef.current) {
      beansRef.current.children.forEach((mesh, i) => {
        const d = beanData[i];
        const beanP = clamp01(phase(p, d.fallDelay, 0.4 + d.fallDelay));
        const eased = 1 - Math.pow(1 - beanP, 3);
        mesh.position.x = lerp(d.startX, d.endX, eased);
        mesh.position.y = lerp(d.startY, d.endY, eased);
        mesh.position.z = lerp(d.startZ, d.endZ, eased);
        const spin = d.rotSpeed * (1 - eased * 0.7);
        mesh.rotation.x = t * spin;
        mesh.rotation.z = t * spin * 0.6;
      });
    }

    // --- Beat 2: pour & fill (0.35 -> 0.65) ---
    const fillP = phase(p, 0.35, 0.65);
    if (fillRef.current) {
      fillRef.current.position.y = lerp(-0.5, 0.38, fillP);
      fillRef.current.scale.setScalar(lerp(0.01, 1, fillP));
    }
    if (streamRef.current) {
      const streamP = phase(p, 0.32, 0.6);
      const streamOpacity = streamP < 0.85 ? Math.min(1, streamP * 4) : (1 - streamP) * 6.7;
      streamRef.current.material.opacity = Math.max(0, Math.min(0.85, streamOpacity));
      streamRef.current.scale.y = lerp(0.2, 1, clamp01(streamP * 1.2));
    }

    // --- Beat 3: crema forms (0.6 -> 0.8) ---
    if (cremaRef.current) {
      const cremaP = phase(p, 0.6, 0.8);
      cremaRef.current.scale.setScalar(lerp(0.01, 1, cremaP));
      cremaRef.current.material.opacity = cremaP * 0.9;
    }

    // --- Beat 4: steam rises (0.65 -> 1) ---
    const steamP = phase(p, 0.65, 1);
    steamRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.material.opacity = steamP * 0.35;
      mesh.position.y = 0.7 + steamP * 1.4 + Math.sin(t * 0.8 + i * 2) * 0.08;
      mesh.position.x = Math.sin(t * 0.6 + i * 3) * 0.15 * steamP;
    });

    // --- Subtle cinematic push-in across the whole sequence ---
    if (cameraGroup.current) {
      cameraGroup.current.position.z = lerp(6.2, 5.4, p);
    }
  });

  return (
    <group ref={cameraGroup}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 3]} intensity={1.2} color="#F5EDE0" />
      <pointLight position={[-3, 0, -2]} intensity={0.5} color="#C9A15A" />

      <mesh position={[0, -1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.08, 48]} />
        <meshStandardMaterial color="#F5EDE0" roughness={0.35} />
      </mesh>

      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.85, 0.65, 1.3, 48, 1, true]} />
        <meshStandardMaterial color="#2A1D15" roughness={0.3} metalness={0.1} side={2} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.66, 0.6, 0.12, 48]} />
        <meshStandardMaterial color="#3B2A20" roughness={0.3} />
      </mesh>
      <mesh position={[0.95, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.34, 0.09, 16, 32, Math.PI * 1.5]} />
        <meshStandardMaterial color="#2A1D15" roughness={0.3} metalness={0.1} />
      </mesh>

      <mesh ref={fillRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.06, 48]} />
        <meshStandardMaterial color="#3B2A20" roughness={0.15} metalness={0.2} />
      </mesh>

      <mesh ref={cremaRef} position={[0, 0.41, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.78, 48]} />
        <meshStandardMaterial color="#C9A15A" roughness={0.4} transparent opacity={0} />
      </mesh>

      <mesh ref={streamRef} position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 2.2, 12]} />
        <meshStandardMaterial color="#3B2A20" transparent opacity={0} roughness={0.2} />
      </mesh>

      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (steamRefs.current[i] = el)} position={[i * 0.15 - 0.15, 0.8, 0]}>
          <planeGeometry args={[0.12, 0.6]} />
          <meshBasicMaterial color="#F5EDE0" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}

      <group ref={beansRef}>
        {beanData.map((d, i) => (
          <mesh key={i} position={[d.startX, d.startY, d.startZ]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#3B2A20" roughness={0.4} metalness={0.1} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Public component: renders inside a tall, sticky-pinned wrapper (see
// ScrollAnimationSection.jsx). Scroll position through that wrapper maps to
// 0→1 and drives every beat of the brew sequence above. No autoplay, no
// timers — purely a function of scroll position, so it's naturally
// reversible and frame-exact for both fast and slow scrolling.
const ScrollCoffeeAnimation = ({ progressRef }) => (
  <div className="relative h-full w-full overflow-hidden bg-charcoal">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,42,32,0.4),transparent_70%)]" />
    <Canvas camera={{ position: [0, 0.2, 6.2], fov: 38 }} gl={{ antialias: true }} dpr={[1, 1.75]}>
      <BrewScene progressRef={progressRef} />
    </Canvas>
  </div>
);

export default ScrollCoffeeAnimation;
