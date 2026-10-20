"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DesertParticlesProps {
  particleCount?: number;
  speedMultiplier?: number;
}

/**
 * Deterministic Mulberry32 PRNG.
 * Pure and repeatable; eliminates react-hooks/purity lint errors.
 */
function createPrng(seed: number) {
  let s = seed;
  return function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Creates a soft, radial alpha texture for sand motes so particles appear as
 * organic, soft-edged grains rather than harsh square pixels.
 */
function createDustTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 248, 235, 1.0)");
    gradient.addColorStop(0.3, "rgba(230, 195, 140, 0.7)");
    gradient.addColorStop(0.7, "rgba(184, 138, 68, 0.2)");
    gradient.addColorStop(1, "rgba(184, 138, 68, 0.0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export function DesertParticles({
  particleCount = 280,
  speedMultiplier = 1.0,
}: DesertParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle buffer data deterministically
  const { positions, velocities, phases, texture } = useMemo(() => {
    const prng = createPrng(42);
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const phs = new Float32Array(particleCount);

    const xRange = 36;
    const yRange = 22;
    const zRange = 24;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (prng() - 0.5) * xRange;
      pos[i3 + 1] = (prng() - 0.5) * yRange;
      pos[i3 + 2] = (prng() - 0.5) * zRange;

      const depthFactor = 0.6 + ((pos[i3 + 2] + 12) / 24) * 0.8;
      vel[i3] = (0.35 + prng() * 0.45) * depthFactor;
      vel[i3 + 1] = (0.05 + prng() * 0.15) * depthFactor;
      vel[i3 + 2] = (prng() - 0.5) * 0.08;

      phs[i] = prng() * Math.PI * 2;
    }

    const tex = typeof window !== "undefined" ? createDustTexture() : null;

    return {
      positions: pos,
      velocities: vel,
      phases: phs,
      texture: tex,
    };
  }, [particleCount]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color("#F3E2C4"),
      size: 0.22,
      map: texture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
  }, [texture]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    const posArray = posAttr.array as Float32Array;
    const dt = Math.min(delta, 0.1) * speedMultiplier;

    const xBound = 19;
    const yBound = 12;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      const timeWave = Math.sin(phase + Date.now() * 0.0008);
      const verticalWave = Math.cos(phase + Date.now() * 0.0005);

      posArray[i3] += (velocities[i3] + timeWave * 0.08) * dt;
      posArray[i3 + 1] += (velocities[i3 + 1] + verticalWave * 0.04) * dt;
      posArray[i3 + 2] += velocities[i3 + 2] * dt;

      if (posArray[i3] > xBound) {
        posArray[i3] = -xBound;
      } else if (posArray[i3] < -xBound) {
        posArray[i3] = xBound;
      }

      if (posArray[i3 + 1] > yBound) {
        posArray[i3 + 1] = -yBound;
      } else if (posArray[i3 + 1] < -yBound) {
        posArray[i3 + 1] = yBound;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}
