'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useUIStore } from '@/stores/useUIStore';

export const DetailedMosqueInterior = () => {
  const cutawayMode = useUIStore((s) => s.cutawayMode);

  return (
    <group position={[0, 0, -22]}>
      {/* 1. Base Marble Courtyard & Hall Platform */}
      <mesh receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[19, 0.1, 17]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.08} />
      </mesh>

      {/* Modern Perimeter Walls (1.35m cutaway height for open-roof observation) */}
      <group position={[0, 0, 0]}>
        {/* Qibla Wall (North) */}
        <mesh castShadow receiveShadow position={[0, 0.7, -8.3]}>
          <boxGeometry args={[19, 1.35, 0.28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* West Wall */}
        <mesh castShadow receiveShadow position={[-9.3, 0.7, 0]}>
          <boxGeometry args={[0.28, 1.35, 17]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* East Wall */}
        <mesh castShadow receiveShadow position={[9.3, 0.7, 0]}>
          <boxGeometry args={[0.28, 1.35, 17]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* South Wall with Arched Entrance */}
        <mesh castShadow receiveShadow position={[-5.8, 0.7, 8.3]}>
          <boxGeometry args={[7.2, 1.35, 0.28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[5.8, 0.7, 8.3]}>
          <boxGeometry args={[7.2, 1.35, 0.28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>

      {/* Grand Marble Dome (When Cutaway is OFF, or subtle arch ribbing when ON) */}
      {!cutawayMode && (
        <group position={[0, 1.35, -2]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[4.2, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#047857" roughness={0.25} metalness={0.2} />
          </mesh>
          {/* Golden Crescent Finial on Dome Apex */}
          <mesh position={[0, 4.4, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 4.9, 0]}>
            <torusGeometry args={[0.24, 0.04, 12, 24, Math.PI * 1.5]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* 2. Classical Islamic Arched Colonnade with Marble Pillars */}
      {[-5, 0, 5].map((px, i) => (
        <group key={`pillar-${i}`} position={[px, 0.1, -1]}>
          {/* Column Base */}
          <mesh castShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.3, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
          {/* Column Shaft */}
          <mesh castShadow position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 1.7, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} />
          </mesh>
          {/* Gold Capital / Arch Spring */}
          <mesh position={[0, 2.05, 0]}>
            <cylinderGeometry args={[0.34, 0.22, 0.2, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* 3. Prayer Hall (Saf Carpet Lines Facing Qibla) */}
      <group position={[0, 0.12, -2]}>
        {/* Rich Emerald Velvet Prayer Carpet */}
        <mesh receiveShadow position={[0, 0.005, 0]}>
          <boxGeometry args={[14, 0.02, 10.5]} />
          <meshStandardMaterial color="#065f46" roughness={0.85} />
        </mesh>

        {/* Golden Embroidered Saf Lines (Rows) */}
        {[-3.6, -1.8, 0, 1.8, 3.6].map((sz, i) => (
          <group key={`saf-row-${i}`} position={[0, 0.02, sz]}>
            {/* Primary Gold Row Line */}
            <mesh receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[13.4, 0.005, 0.12]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Soft Individual Prayer Arch Marker Accents */}
            {[-4.5, -2.25, 0, 2.25, 4.5].map((ax, j) => (
              <mesh key={`arch-${j}`} position={[ax, 0, -0.45]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.35, 0.015, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.3} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 4. Mihrab Niche (Center of Qibla Wall) */}
      <group position={[0, 0.1, -8.1]}>
        {/* Ornate Arch Frame */}
        <mesh castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[3.2, 1.8, 0.4]} />
          <meshStandardMaterial color="#047857" roughness={0.4} />
        </mesh>
        {/* Inner Mihrab Concave Niche with Soft Emerald Glow */}
        <mesh position={[0, 0.85, 0.08]} rotation={[0, -Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 1.6, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>
        {/* Quran Pulpit / Minbar Wooden Steps */}
        <group position={[2.2, 0, 0.3]}>
          {[0, 1, 2].map((step) => (
            <mesh key={`minbar-${step}`} castShadow position={[0, 0.16 + step * 0.22, step * 0.28]}>
              <boxGeometry args={[0.8, 0.22, 0.32]} />
              <meshStandardMaterial color="#78350f" roughness={0.4} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 5. Courtyard Ablution (Wudu) Station */}
      <group position={[-6.2, 0.1, 5.5]}>
        {/* Octagonal Stone Fountain Basin */}
        <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
          <cylinderGeometry args={[1.5, 1.7, 0.45, 8]} />
          <meshStandardMaterial color="#64748b" roughness={0.6} />
        </mesh>
        {/* Fountain Water */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.08, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Center Water Spout */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.5, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Ablution Granite Stools (4) */}
        {[
          [0, 1.9],
          [0, -1.9],
          [1.9, 0],
          [-1.9, 0],
        ].map(([sx, sz], i) => (
          <mesh key={`stool-${i}`} castShadow position={[sx, 0.18, sz]}>
            <cylinderGeometry args={[0.22, 0.22, 0.34, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* 6. Towering Landmark Minaret Spire */}
      <group position={[8.4, 0.1, 6.8]}>
        {/* Minaret Base Plinth */}
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
          <boxGeometry args={[1.6, 1.2, 1.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Octagonal Minaret Tower */}
        <mesh castShadow position={[0, 5.2, 0]}>
          <cylinderGeometry args={[0.55, 0.72, 8.2, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Circular Balcony Gallery */}
        <mesh castShadow position={[0, 9.4, 0]}>
          <cylinderGeometry args={[1.0, 0.8, 0.35, 16]} />
          <meshStandardMaterial color="#047857" metalness={0.3} roughness={0.3} />
        </mesh>
        {/* Upper Lantern Pavilion */}
        <mesh position={[0, 10.4, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 1.6, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Conical Roof Peak */}
        <mesh position={[0, 11.6, 0]}>
          <coneGeometry args={[0.55, 1.2, 16]} />
          <meshStandardMaterial color="#047857" roughness={0.3} />
        </mesh>
        {/* Gleaming Golden Crescent Finial */}
        <mesh position={[0, 12.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 12.9, 0]}>
          <torusGeometry args={[0.2, 0.035, 12, 24, Math.PI * 1.5]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};
