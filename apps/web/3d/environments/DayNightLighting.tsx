'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '@/stores/useWorldStore';

export const DayNightLighting = () => {
  const hour = useWorldStore((s) => s.hour);
  const minute = useWorldStore((s) => s.minute);
  const phase = useWorldStore((s) => s.phase);

  // Compute normalized sun angle along 24h cycle
  const { sunPosition, sunColor, sunIntensity, ambientColor, ambientIntensity, isNight } =
    useMemo(() => {
      const timeInHours = hour + minute / 60;
      // Angle: 6am is sun rising in east, 12pm is overhead, 6pm setting in west
      const sunAngle = ((timeInHours - 6) / 24) * Math.PI * 2;
      const sunHeight = Math.sin(sunAngle) * 45;
      const sunX = Math.cos(sunAngle) * 55;
      const sunZ = Math.sin(sunAngle * 0.5) * 20;

      let sunCol = '#ffffff';
      let sunInt = 1.6;
      let ambCol = '#94a3b8';
      let ambInt = 0.55;
      let night = false;

      switch (phase) {
        case 'DAWN':
          sunCol = '#e879f9';
          sunInt = 0.6;
          ambCol = '#382bf0';
          ambInt = 0.3;
          break;
        case 'MORNING':
          sunCol = '#fef08a';
          sunInt = 1.4;
          ambCol = '#bae6fd';
          ambInt = 0.6;
          break;
        case 'NOON':
          sunCol = '#ffffff';
          sunInt = 1.8;
          ambCol = '#e2e8f0';
          ambInt = 0.75;
          break;
        case 'AFTERNOON':
          sunCol = '#fed7aa';
          sunInt = 1.4;
          ambCol = '#cbd5e1';
          ambInt = 0.6;
          break;
        case 'EVENING':
          sunCol = '#f97316';
          sunInt = 0.9;
          ambCol = '#7c3aed';
          ambInt = 0.45;
          break;
        case 'NIGHT':
        default:
          sunCol = '#93c5fd';
          sunInt = 0.3;
          ambCol = '#1e1b4b';
          ambInt = 0.22;
          night = true;
          break;
      }

      return {
        sunPosition: [sunX, Math.max(sunHeight, 8), sunZ] as [number, number, number],
        sunColor: sunCol,
        sunIntensity: sunInt,
        ambientColor: ambCol,
        ambientIntensity: ambInt,
        isNight: night,
      };
    }, [hour, minute, phase]);

  return (
    <>
      {/* Ambient Fill */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* Hemisphere Light for soft ground bounce */}
      <hemisphereLight
        args={[sunColor, isNight ? '#090d16' : '#334155', isNight ? 0.3 : 0.6]}
      />

      {/* Main Directional Sun / Moon */}
      <directionalLight
        position={sunPosition}
        color={sunColor}
        intensity={sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={120}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0005}
      />

      {/* Night Architectural Accents (Only lit in evening/night) */}
      {isNight && (
        <>
          {/* Main Office Interior Glow */}
          <pointLight position={[0, 4, 10]} color="#60a5fa" intensity={2.5} distance={25} />
          {/* Mosque Courtyard & Minaret Warm Glow */}
          <pointLight position={[0, 5, -22]} color="#34d399" intensity={2.2} distance={25} />
          {/* Cafeteria Bistro Light */}
          <pointLight position={[-22, 4, 10]} color="#fb923c" intensity={2.0} distance={22} />
          {/* Pool Under-Water Neon Glow */}
          <pointLight position={[22, 1, -18]} color="#38bdf8" intensity={3.0} distance={20} />
          {/* Lounge Ambient Glow */}
          <pointLight position={[22, 4, 10]} color="#c084fc" intensity={2.0} distance={20} />
          {/* Garden Pathway Soft Lanterns */}
          <pointLight position={[-22, 2, -18]} color="#4ade80" intensity={1.5} distance={18} />
        </>
      )}
    </>
  );
};
