'use client';

import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { ContactShadows, Sky } from '@react-three/drei';
import { CameraController } from './camera/CameraController';
import { DayNightLighting } from './environments/DayNightLighting';
import { CampusGround } from './world/CampusGround';
import { useUIStore } from '@/stores/useUIStore';
import { useWorldStore } from '@/stores/useWorldStore';
import { EmployeeSimulationManager } from './characters/EmployeeSimulationManager';

export const SceneCanvas = () => {
  const quality = useUIStore((s) => s.quality);
  const phase = useWorldStore((s) => s.phase);

  // Background sky / fog color adapting to day/night phase
  const fogColor = useMemo(() => {
    switch (phase) {
      case 'DAWN':
        return '#2e1065';
      case 'MORNING':
        return '#38bdf8';
      case 'NOON':
        return '#0284c7';
      case 'AFTERNOON':
        return '#0369a1';
      case 'EVENING':
        return '#431407';
      case 'NIGHT':
      default:
        return '#090d16';
    }
  }, [phase]);

  // Adjust pixel ratio and shadow resolution based on quality settings
  const dpr: [number, number] = useMemo(() => {
    if (quality === 'low') return [1, 1];
    if (quality === 'medium') return [1, 1.5];
    return [1, 2];
  }, [quality]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#090d16] select-none">
      <Canvas
        shadows={quality !== 'low' ? 'soft' : false}
        dpr={dpr}
        camera={{ position: [42, 38, 42], fov: 42 }}
        gl={{
          antialias: quality !== 'low',
          powerPreference: 'high-performance',
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={[fogColor]} />
        <fog attach="fog" args={[fogColor, 45, 130]} />

        {/* Procedural Atmospheric Sky Dome */}
        {phase !== 'NIGHT' && (
          <Sky
            distance={450000}
            sunPosition={[50, phase === 'NOON' ? 60 : 30, 40]}
            inclination={0.55}
            azimuth={0.25}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
            rayleigh={phase === 'EVENING' ? 4 : 1.2}
            turbidity={8}
          />
        )}

        {/* Dynamic World Lighting */}
        <DayNightLighting />

        {/* Soft Ambient Ground Contact Occlusion */}
        <ContactShadows
          position={[0, 0.015, 0]}
          opacity={0.65}
          scale={76}
          blur={2.2}
          far={8}
          color="#020617"
        />

        {/* Campus Terrain & Architecture */}
        <CampusGround />

        {/* Living Animated AI Employees */}
        <EmployeeSimulationManager />

        {/* Interactive Isometric Controls */}
        <CameraController />
      </Canvas>
    </div>
  );
};
