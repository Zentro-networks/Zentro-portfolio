'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Points as ThreePoints } from 'three';

// Inside Canvas, animate particles
function ParticleField({ count, isReduced, theme }: { count: number; isReduced: boolean; theme: 'dark' | 'light' }) {
  const pointsRef = useRef<ThreePoints>(null);
  
  // Track mouse coordinates
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    if (!isReduced) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isReduced]);

  // Generate random positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Slow rotational drift
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = time * 0.01;

    // Subtle reaction to mouse
    if (!isReduced) {
      const targetX = mouse.current.x * 0.15;
      const targetY = mouse.current.y * 0.15;
      pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05;
      pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.05;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={theme === 'light' ? '#5146e5' : '#00f5d4'}
          size={0.025}
          sizeAttenuation={true}
          depthWrite={false}
          blending={theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false);
  const [performanceTier, setPerformanceTier] = useState<'high' | 'low' | 'static'>('high');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Listen to HTML class mutations to dynamically track light/dark theme toggles
  useEffect(() => {
    setMounted(true);
    
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains('light');
      setTheme(isLight ? 'light' : 'dark');
    };
    
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Detect low-end / mobile devices (simple heuristic)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    if (prefersReducedMotion) {
      setPerformanceTier('static');
    } else if (isMobile) {
      setPerformanceTier('low');
    } else {
      setPerformanceTier('high');
    }

    return () => observer.disconnect();
  }, []);

  const bgColor = theme === 'light' ? '#ffffff' : '#09090b';

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#09090b] light:bg-[#ffffff]" />;
  }

  // Under prefers-reduced-motion, render a smooth CSS gradient blob
  if (performanceTier === 'static') {
    return (
      <div className={`absolute inset-0 overflow-hidden -z-10 transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#ffffff]' : 'bg-[#09090b]'
      }`}>
        <div className={`absolute top-[20%] left-[20%] w-[30vw] h-[30vw] rounded-full blur-[100px] transition-colors duration-300 ${
          theme === 'light' ? 'bg-primary/5' : 'bg-primary/10'
        }`} />
        <div className={`absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full blur-[120px] transition-colors duration-300 ${
          theme === 'light' ? 'bg-accent/3' : 'bg-accent/5'
        }`} />
      </div>
    );
  }

  const particleCount = performanceTier === 'low' ? 300 : 1200;

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#ffffff]' : 'bg-[#09090b]'
    }`}>
      {/* Background radial gradients for ambient glow */}
      <div className={`absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full blur-[120px] pointer-events-none opacity-60 transition-colors duration-300 ${
        theme === 'light' ? 'bg-primary/5' : 'bg-primary/15'
      }`} />
      <div className={`absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full blur-[150px] pointer-events-none opacity-60 transition-colors duration-300 ${
        theme === 'light' ? 'bg-accent/3' : 'bg-accent/8'
      }`} />
      
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[bgColor]} />
        <ambientLight intensity={theme === 'light' ? 0.8 : 0.5} />
        <ParticleField count={particleCount} isReduced={performanceTier === 'low'} theme={theme} />
      </Canvas>
    </div>
  );
}
