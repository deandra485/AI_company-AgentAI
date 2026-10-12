'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const DetailedAmenities = () => {
  const poolWaterRef = useRef<THREE.Mesh>(null);

  // Subtle wave shimmer on the pool water surface
  useFrame(({ clock }) => {
    if (poolWaterRef.current) {
      const t = clock.getElapsedTime();
      poolWaterRef.current.position.y = 0.22 + Math.sin(t * 1.8) * 0.015;
    }
  });

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. CAFETERIA & BISTRO RESTAURANT at [-22, 0, 10] */}
      {/* ============================================================ */}
      <group position={[-22, 0, 10]}>
        {/* Modern Polished Terrazzo Cafe Floor */}
        <mesh receiveShadow position={[0, 0.06, 0]}>
          <boxGeometry args={[16, 0.1, 14]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Cutaway Perimeter Walls */}
        <mesh castShadow receiveShadow position={[0, 0.65, -6.8]}>
          <boxGeometry args={[16, 1.2, 0.25]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[-7.8, 0.65, 0]}>
          <boxGeometry args={[0.25, 1.2, 14]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Stainless Steel Culinary Service Counter */}
        <group position={[0, 0.1, -4.5]}>
          <mesh castShadow position={[0, 0.55, 0]}>
            <boxGeometry args={[10, 1.0, 1.3]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.08, 0]}>
            <boxGeometry args={[10.2, 0.06, 1.4]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Glass Sneeze Guard */}
          <mesh position={[0, 1.28, 0.4]}>
            <boxGeometry args={[9.8, 0.35, 0.02]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* Gourmet Hot Food Warming Trays */}
          {[-3, -1, 1, 3].map((tx, i) => (
            <mesh key={`tray-${i}`} position={[tx, 1.13, -0.1]}>
              <boxGeometry args={[1.5, 0.04, 0.8]} />
              <meshStandardMaterial
                color={['#f59e0b', '#ef4444', '#10b981', '#3b82f6'][i]}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>

        {/* Modern Round Bistro Dining Tables & Curved Chairs */}
        {[
          [-4, 1],
          [4, 1],
          [-4, 4.5],
          [4, 4.5],
        ].map(([tx, tz], i) => (
          <group key={`cafe-table-${i}`} position={[tx, 0.1, tz]}>
            {/* Round Oak Tabletop */}
            <mesh castShadow receiveShadow position={[0, 0.68, 0]}>
              <cylinderGeometry args={[0.85, 0.85, 0.04, 24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} />
            </mesh>
            {/* Center Pedestal Base */}
            <mesh position={[0, 0.34, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.68, 12]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.03, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>

            {/* 3 Modern Molded Dining Chairs */}
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, ci) => (
              <group
                key={`c-${ci}`}
                position={[Math.cos(angle) * 1.25, 0, Math.sin(angle) * 1.25]}
                rotation={[0, -angle - Math.PI / 2, 0]}
              >
                {/* Curved Seat Shell */}
                <mesh castShadow position={[0, 0.42, 0]}>
                  <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.5} />
                </mesh>
                {/* Curved Backrest */}
                <mesh castShadow position={[0, 0.66, 0.18]}>
                  <boxGeometry args={[0.38, 0.42, 0.04]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.5} />
                </mesh>
                {/* Slim Wooden Chair Legs */}
                {[-0.14, 0.14].map((lx, li) => (
                  <mesh key={`leg-${li}`} position={[lx, 0.2, 0]}>
                    <cylinderGeometry args={[0.018, 0.015, 0.42, 8]} />
                    <meshStandardMaterial color="#78350f" roughness={0.5} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 2. SWIMMING POOL & RESORT PATIO at [22, 0, -18] */}
      {/* ============================================================ */}
      <group position={[22, 0, -18]}>
        {/* Teak Wood Sun Deck Platform */}
        <mesh receiveShadow position={[0, 0.06, 0]}>
          <boxGeometry args={[16, 0.1, 14]} />
          <meshStandardMaterial color="#573624" roughness={0.5} metalness={0.05} />
        </mesh>

        {/* Recessed Ceramic Tiled Pool Coping Rim */}
        <mesh position={[-2, 0.15, 0]}>
          <boxGeometry args={[9.6, 0.14, 11.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>

        {/* Shimmering Translucent Water Surface with Wave Animation */}
        <mesh ref={poolWaterRef} position={[-2, 0.22, 0]}>
          <boxGeometry args={[8.9, 0.03, 10.4]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.02}
            metalness={0.15}
            transparent
            opacity={0.82}
          />
        </mesh>

        {/* Ergonomic Sun Loungers (3) */}
        {[
          [4.5, -3.5],
          [4.5, 0],
          [4.5, 3.5],
        ].map(([lx, lz], i) => (
          <group key={`lounger-${i}`} position={[lx, 0.12, lz]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Lounger Frame */}
            <mesh castShadow position={[0, 0.16, 0]}>
              <boxGeometry args={[0.82, 0.08, 2.3]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            {/* Cushion Bed */}
            <mesh castShadow position={[0, 0.24, 0.1]}>
              <boxGeometry args={[0.78, 0.08, 1.5]} />
              <meshStandardMaterial color="#0284c7" roughness={0.8} />
            </mesh>
            {/* Inclined Head Cushion */}
            <mesh castShadow position={[0, 0.42, -0.72]} rotation={[Math.PI / 5, 0, 0]}>
              <boxGeometry args={[0.78, 0.08, 0.7]} />
              <meshStandardMaterial color="#0284c7" roughness={0.8} />
            </mesh>
            {/* Resort Parasol Sun Umbrella */}
            <group position={[0.95, 0, -0.6]}>
              <mesh position={[0, 1.4, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 2.8, 10]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
              <mesh position={[0, 2.65, 0]}>
                <coneGeometry args={[1.35, 0.45, 16]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.6} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 3. COFFEE LOUNGE & RELAXATION SUITE at [22, 0, 10] */}
      {/* ============================================================ */}
      <group position={[22, 0, 10]}>
        <mesh receiveShadow position={[0, 0.06, 0]}>
          <boxGeometry args={[16, 0.1, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Soft Designer Rug */}
        <mesh receiveShadow position={[0, 0.12, 0]}>
          <boxGeometry args={[13, 0.015, 9]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>

        {/* L-Shaped Sectional Fabric Sofa */}
        <group position={[-2, 0.1, 0]}>
          {/* Main Sofa Cushion Base */}
          <mesh castShadow position={[0, 0.34, 0]}>
            <boxGeometry args={[5.2, 0.38, 1.4]} />
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </mesh>
          <mesh castShadow position={[0, 0.65, -0.55]}>
            <boxGeometry args={[5.2, 0.48, 0.3]} />
            <meshStandardMaterial color="#334155" roughness={0.85} />
          </mesh>
          {/* Chaise Lounge L-Extension */}
          <mesh castShadow position={[-2.0, 0.34, 1.8]}>
            <boxGeometry args={[1.2, 0.38, 2.2]} />
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </mesh>
        </group>

        {/* Round Glass Coffee Table */}
        <group position={[-0.5, 0.1, 1.2]}>
          <mesh castShadow position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.04, 24]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.05}
              metalness={0.2}
              transparent
              opacity={0.65}
            />
          </mesh>
          {/* Metal Legs */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
        </group>

        {/* Stainless Espresso Bar Counter */}
        <group position={[4.5, 0.1, -2]}>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[1.6, 1.1, 4.5]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[1.7, 0.05, 4.6]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.2} />
          </mesh>
          {/* Espresso Machine */}
          <mesh castShadow position={[0, 1.45, 0]}>
            <boxGeometry args={[0.8, 0.55, 1.1]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 4. BOTANICAL GARDEN (Multi-Layer Organic Trees) at [-22, 0, -18] */}
      {/* ============================================================ */}
      <group position={[-22, 0, -18]}>
        {/* Soft Landscaped Green Mound */}
        <mesh receiveShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[14, 0.12, 12]} />
          <meshStandardMaterial color="#14532d" roughness={0.95} />
        </mesh>

        {/* Cobblestone Garden Walking Path */}
        {[-4, -2, 0, 2, 4].map((px, i) => (
          <mesh key={`path-${i}`} receiveShadow position={[px, 0.15, 0]}>
            <boxGeometry args={[1.8, 0.02, 2.2]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
        ))}

        {/* Multi-Layered Clustered Organic Trees (4 Trees) */}
        {[
          [-4.5, -3.5],
          [4.5, -3.5],
          [-4.5, 3.5],
          [4.5, 3.5],
        ].map(([tx, tz], i) => (
          <group key={`tree-${i}`} position={[tx, 0.14, tz]}>
            {/* Trunk with slight organic taper */}
            <mesh castShadow position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.16, 0.28, 2.4, 10]} />
              <meshStandardMaterial color="#573624" roughness={0.85} />
            </mesh>
            {/* Multi-Sphere Foliage Clusters (Realistic Clustered Canopy) */}
            <mesh castShadow position={[0, 2.5, 0]}>
              <sphereGeometry args={[1.2, 14, 14]} />
              <meshStandardMaterial color="#166534" roughness={0.75} />
            </mesh>
            <mesh castShadow position={[0.3, 3.2, 0.2]}>
              <sphereGeometry args={[0.95, 14, 14]} />
              <meshStandardMaterial color="#15803d" roughness={0.75} />
            </mesh>
            <mesh castShadow position={[-0.3, 2.9, -0.2]}>
              <sphereGeometry args={[0.85, 14, 14]} />
              <meshStandardMaterial color="#22c55e" roughness={0.75} />
            </mesh>
          </group>
        ))}

        {/* Wooden Park Benches with Cast Iron Supports */}
        {[
          [0, -3.2, 0],
          [0, 3.2, Math.PI],
        ].map(([bx, bz, rot], i) => (
          <group key={`bench-${i}`} position={[bx, 0.14, bz]} rotation={[0, rot, 0]}>
            <mesh castShadow position={[0, 0.35, 0]}>
              <boxGeometry args={[2.0, 0.05, 0.48]} />
              <meshStandardMaterial color="#78350f" roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, 0.6, -0.2]}>
              <boxGeometry args={[2.0, 0.42, 0.05]} />
              <meshStandardMaterial color="#78350f" roughness={0.6} />
            </mesh>
            {/* Cast Iron Legs */}
            {[-0.85, 0.85].map((lx, li) => (
              <mesh key={`bleg-${li}`} position={[lx, 0.18, 0]}>
                <boxGeometry args={[0.06, 0.36, 0.44]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
};
