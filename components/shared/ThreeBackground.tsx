'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Network Graph: Nodes + Connecting Lines ───────────────────────────────
function NetworkGraph({
  nodeCount,
  isReduced,
  theme,
}: {
  nodeCount: number;
  isReduced: boolean;
  theme: 'dark' | 'light';
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse for subtle parallax
  useEffect(() => {
    if (isReduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReduced]);

  // ── Generate node positions (spread across a wide plane, slight depth variance)
  const nodePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      positions.push([
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 4,
      ]);
    }
    return positions;
  }, [nodeCount]);

  // ── Build edges between nodes closer than threshold
  const { linePositions, lineColors } = useMemo(() => {
    const maxDist = isReduced ? 2.8 : 2.4;
    const posArr: number[] = [];
    const colArr: number[] = [];

    const nearColor = theme === 'dark'
      ? new THREE.Color('#087F7B')
      : new THREE.Color('#087F7B');
    const farColor = new THREE.Color(0x000000);
    farColor.set(theme === 'dark' ? '#071415' : '#F4F7F3');

    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const [x1, y1, z1] = nodePositions[i];
        const [x2, y2, z2] = nodePositions[j];
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
        if (dist < maxDist) {
          // fade opacity based on distance
          const alpha = 1 - dist / maxDist;
          posArr.push(x1, y1, z1, x2, y2, z2);
          // interpolate color by alpha for a fade-out effect
          const lc = nearColor.clone().lerp(farColor, 1 - alpha * 0.7);
          colArr.push(lc.r, lc.g, lc.b, alpha * 0.5, lc.r, lc.g, lc.b, alpha * 0.5);
        }
      }
    }
    return { linePositions: posArr, lineColors: colArr };
  }, [nodePositions, isReduced, theme]);

  // ── Build geometry for lines
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));
    return geo;
  }, [linePositions, lineColors]);

  // ── Build geometry for nodes (rendered as points)
  const { pointPositions, pointColors } = useMemo(() => {
    const posArr: number[] = [];
    const colArr: number[] = [];
    nodePositions.forEach(([x, y, z], i) => {
      posArr.push(x, y, z);
      // Alternate some nodes as lime accent nodes
      const isAccent = i % 7 === 0;
      const c = new THREE.Color(isAccent
        ? (theme === 'dark' ? '#C7F36B' : '#087F7B')
        : (theme === 'dark' ? '#087F7B' : '#0a9e99'));
      colArr.push(c.r, c.g, c.b);
    });
    return { pointPositions: posArr, pointColors: colArr };
  }, [nodePositions, theme]);

  const pointGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));
    return geo;
  }, [pointPositions, pointColors]);

  // ── Animate: slow rotation + mouse parallax
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.012;
    groupRef.current.rotation.x = t * 0.006;

    if (!isReduced) {
      const tx = mouse.current.x * 0.12;
      const ty = mouse.current.y * 0.12;
      groupRef.current.position.x += (tx - groupRef.current.position.x) * 0.04;
      groupRef.current.position.y += (ty - groupRef.current.position.y) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={theme === 'dark' ? 0.55 : 0.35}
          blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Node points */}
      <points geometry={pointGeometry}>
        <pointsMaterial
          vertexColors
          size={isReduced ? 0.045 : 0.06}
          sizeAttenuation
          transparent
          opacity={theme === 'dark' ? 0.9 : 0.7}
          blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false);
  const [performanceTier, setPerformanceTier] = useState<'high' | 'low' | 'static'>('high');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);

    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    if (prefersReducedMotion) setPerformanceTier('static');
    else if (isMobile) setPerformanceTier('low');
    else setPerformanceTier('high');

    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#071415' : '#F4F7F3';

  // ── SSR placeholder
  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-[#071415] light:bg-[#F4F7F3]" />;
  }

  // ── Static fallback (reduced motion / very low-end)
  if (performanceTier === 'static') {
    return (
      <div className={`fixed inset-0 -z-10 overflow-hidden ${isDark ? 'bg-[#071415]' : 'bg-[#F4F7F3]'}`}>
        {/* Radial center glow */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 70% 60% at 55% 45%, rgba(8,127,123,0.22) 0%, rgba(11,41,41,0.15) 50%, transparent 80%)'
              : 'radial-gradient(ellipse 70% 60% at 55% 45%, rgba(8,127,123,0.10) 0%, transparent 70%)',
          }}
        />
        {/* Corner vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(4,13,13,0.7) 100%)',
          }}
        />
      </div>
    );
  }

  const nodeCount = performanceTier === 'low' ? 60 : 160;

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${isDark ? 'bg-[#071415]' : 'bg-[#F4F7F3]'}`}>

      {/* ── Layer 1: Rich center radial glow (the dominant "orb" from the reference image) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? `radial-gradient(ellipse 75% 65% at 58% 42%,
                rgba(8,127,123,0.28) 0%,
                rgba(8,127,123,0.10) 35%,
                rgba(11,41,41,0.06) 60%,
                transparent 80%)`
            : `radial-gradient(ellipse 75% 65% at 58% 42%,
                rgba(8,127,123,0.12) 0%,
                rgba(8,127,123,0.04) 50%,
                transparent 80%)`,
        }}
      />

      {/* ── Layer 2: Secondary top-left ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 50% 40% at 15% 20%, rgba(199,243,107,0.04) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 50% 40% at 15% 20%, rgba(8,127,123,0.04) 0%, transparent 70%)',
        }}
      />

      {/* ── Layer 3: Edge vignette (dark fade from all corners to center — matches the reference) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(4,10,10,0.65) 100%)'
            : 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(230,235,230,0.5) 100%)',
        }}
      />

      {/* ── Layer 4: Three.js network graph canvas */}
      <Canvas
        className="absolute inset-0 w-full h-full"
        camera={{ position: [0, 0, 5], fov: 55 }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <color attach="background" args={[bgColor]} />
        <NetworkGraph
          nodeCount={nodeCount}
          isReduced={performanceTier === 'low'}
          theme={theme}
        />
      </Canvas>

      {/* ── Layer 5: Top fade overlay to help navbar blend */}
      <div
        className="absolute top-0 inset-x-0 h-32 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(7,20,21,0.6) 0%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(244,247,243,0.5) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
