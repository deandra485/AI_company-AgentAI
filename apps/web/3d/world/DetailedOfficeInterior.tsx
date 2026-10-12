'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useUIStore } from '@/stores/useUIStore';

interface WorkstationProps {
  x: number;
  z: number;
  colorTheme: string;
  codeTheme: string;
}

const ErgonomicOfficeChair = ({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* 5-Star Caster Base */}
    <mesh position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.26, 0.26, 0.03, 10]} />
      <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
    </mesh>
    {/* Rolling Casters */}
    {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
      <mesh
        key={`wheel-${i}`}
        position={[Math.cos(angle) * 0.24, 0.03, Math.sin(angle) * 0.24]}
      >
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>
    ))}
    {/* Chrome Pneumatic Gas Cylinder */}
    <mesh position={[0, 0.24, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 0.32, 12]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
    </mesh>
    {/* Contoured Mesh Seat Cushion */}
    <mesh castShadow position={[0, 0.44, 0]}>
      <boxGeometry args={[0.46, 0.08, 0.44]} />
      <meshStandardMaterial color="#1e293b" roughness={0.7} />
    </mesh>
    {/* Lumbar Curved Backrest */}
    <mesh castShadow position={[0, 0.72, -0.2]}>
      <boxGeometry args={[0.42, 0.48, 0.06]} />
      <meshStandardMaterial color="#0f172a" roughness={0.6} />
    </mesh>
    {/* Adjustable Armrests */}
    <mesh position={[-0.24, 0.58, -0.02]}>
      <boxGeometry args={[0.06, 0.22, 0.24]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
    <mesh position={[0.24, 0.58, -0.02]}>
      <boxGeometry args={[0.06, 0.22, 0.24]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
  </group>
);

const ModernWorkstation = ({ x, z, colorTheme, codeTheme }: WorkstationProps) => (
  <group position={[x, 0, z]}>
    {/* Modern Desk Surface (White Oak Top) */}
    <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
      <boxGeometry args={[1.5, 0.04, 0.82]} />
      <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
    </mesh>

    {/* Sleek Trestle Metal Desk Legs */}
    {[-0.68, 0.68].map((lx, i) => (
      <group key={`leg-${i}`} position={[lx, 0.36, 0]}>
        <mesh position={[0, 0, -0.36]}>
          <cylinderGeometry args={[0.02, 0.02, 0.72, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.36]}>
          <cylinderGeometry args={[0.02, 0.02, 0.72, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.04, 0.74, 0.03]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      </group>
    ))}

    {/* Primary Monitor 1 (Main IDE Screen) */}
    <group position={[-0.28, 0.98, -0.22]} rotation={[0, 0.12, 0]}>
      {/* Aluminum Stand */}
      <mesh position={[0, -0.16, -0.05]}>
        <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      {/* Bezel */}
      <mesh castShadow>
        <boxGeometry args={[0.62, 0.38, 0.02]} />
        <meshStandardMaterial color="#090d16" roughness={0.3} />
      </mesh>
      {/* Glowing High-Res Code Screen */}
      <mesh position={[0, 0, 0.012]}>
        <boxGeometry args={[0.58, 0.34, 0.005]} />
        <meshStandardMaterial
          color={codeTheme}
          emissive={codeTheme}
          emissiveIntensity={0.65}
          roughness={0.2}
        />
      </mesh>
    </group>

    {/* Secondary Monitor 2 (Vertical or Side Screen) */}
    <group position={[0.34, 0.98, -0.18]} rotation={[0, -0.25, 0]}>
      <mesh position={[0, -0.16, -0.05]}>
        <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.54, 0.36, 0.02]} />
        <meshStandardMaterial color="#090d16" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <boxGeometry args={[0.5, 0.32, 0.005]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.55}
          roughness={0.2}
        />
      </mesh>
    </group>

    {/* Mechanical Keyboard & Precision Mouse */}
    <mesh position={[0, 0.745, 0.14]}>
      <boxGeometry args={[0.42, 0.015, 0.14]} />
      <meshStandardMaterial color="#0f172a" roughness={0.6} />
    </mesh>
    <mesh position={[0.3, 0.745, 0.14]}>
      <boxGeometry args={[0.08, 0.02, 0.12]} />
      <meshStandardMaterial color="#334155" roughness={0.3} />
    </mesh>

    {/* Coffee Mug with Department Accent Color */}
    <group position={[0.54, 0.745, 0.2]}>
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 14]} />
        <meshStandardMaterial color={colorTheme} roughness={0.3} />
      </mesh>
    </group>

    {/* Ergonomic Office Chair Facing Desk */}
    <ErgonomicOfficeChair position={[0, 0, 0.58]} rotationY={0} />
  </group>
);

export const DetailedOfficeInterior = () => {
  const cutawayMode = useUIStore((s) => s.cutawayMode);

  return (
    <group position={[0, 0, 10]}>
      {/* 1. Office Floor Platform (Modern Walnut Wood Parquet Finish) */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[21, 0.08, 17]} />
        <meshStandardMaterial color="#2d1d17" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Modern Low-Profile Perimeter Walls (Cutaway mode: 1.35m height) */}
      <group position={[0, 0, 0]}>
        {/* Back Wall (North) */}
        <mesh castShadow receiveShadow position={[0, 0.7, -8.4]}>
          <boxGeometry args={[21, 1.35, 0.24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Left Wall (West) */}
        <mesh castShadow receiveShadow position={[-10.4, 0.7, 0]}>
          <boxGeometry args={[0.24, 1.35, 17]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Right Wall (East) */}
        <mesh castShadow receiveShadow position={[10.4, 0.7, 0]}>
          <boxGeometry args={[0.24, 1.35, 17]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Front Wall with Double Glass Door Entrance (South) */}
        <mesh castShadow receiveShadow position={[-6.2, 0.7, 8.4]}>
          <boxGeometry args={[8.4, 1.35, 0.24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[6.2, 0.7, 8.4]}>
          <boxGeometry args={[8.4, 1.35, 0.24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>

      {/* Full Roof if Cutaway is toggled off */}
      {!cutawayMode && (
        <mesh castShadow receiveShadow position={[0, 3.6, 0]}>
          <boxGeometry args={[21.4, 0.35, 17.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      )}

      {/* 2. Glass Partition Wall between Workstations & Conference Room */}
      <mesh position={[2.5, 0.8, -4]}>
        <boxGeometry args={[0.08, 1.45, 8.5]} />
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.05}
          metalness={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 3. Developer Pod Workstations (Aligned to INITIAL_AGENTS positions) */}
      {/* Bima (Lead Developer): [-6, 0, 7] in global coordinates => [-6, 0, -3] local */}
      <ModernWorkstation x={-6} z={-3} colorTheme="#3b82f6" codeTheme="#10b981" />
      {/* Maya (UI/UX Designer): [-6, 0, 11] => [-6, 0, 1] local */}
      <ModernWorkstation x={-6} z={1} colorTheme="#ec4899" codeTheme="#f43f5e" />
      {/* Ryan (Growth & Marketing): [-2, 0, 7] => [-2, 0, -3] local */}
      <ModernWorkstation x={-2} z={-3} colorTheme="#f59e0b" codeTheme="#fbbf24" />
      {/* Sarah (AI Researcher): [-2, 0, 11] => [-2, 0, 1] local */}
      <ModernWorkstation x={-2} z={1} colorTheme="#8b5cf6" codeTheme="#a855f7" />

      {/* 4. Executive Manager Office (Arya Pratama) at [6, 0, 7] => [6, 0, -3] local */}
      <group position={[6, 0, -3]}>
        {/* Executive L-Shaped Desk */}
        <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
          <boxGeometry args={[1.8, 0.05, 0.9]} />
          <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.8, 0.72, 0.5]}>
          <boxGeometry args={[0.6, 0.05, 1.0]} />
          <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Dual Curved Executive Monitors */}
        <mesh position={[0, 1.02, -0.2]}>
          <boxGeometry args={[0.92, 0.44, 0.02]} />
          <meshStandardMaterial color="#090d16" roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.02, -0.19]}>
          <boxGeometry args={[0.88, 0.4, 0.005]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.7}
            roughness={0.2}
          />
        </mesh>
        {/* Leather Swivel Chair */}
        <ErgonomicOfficeChair position={[0, 0, 0.65]} rotationY={0} />
      </group>

      {/* 5. Boardroom / Conference Meeting Room (East side: local z ~ 4.5, x ~ 5.5) */}
      <group position={[5.5, 0, 4.5]}>
        {/* Conference Racetrack Oval Table */}
        <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
          <boxGeometry args={[3.4, 0.06, 1.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.3} />
        </mesh>
        {/* Center Power Track */}
        <mesh position={[0, 0.755, 0]}>
          <boxGeometry args={[2.2, 0.008, 0.22]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* 6 Conference Chairs around table */}
        {[-1.0, 0, 1.0].map((cx, i) => (
          <group key={`conf-chair-${i}`}>
            <ErgonomicOfficeChair position={[cx, 0, -1.05]} rotationY={0} />
            <ErgonomicOfficeChair position={[cx, 0, 1.05]} rotationY={Math.PI} />
          </group>
        ))}
        {/* Wall-Mounted 75" Presentation Monitor */}
        <group position={[0, 1.0, -1.9]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 1.25, 0.04]} />
            <meshStandardMaterial color="#090d16" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[2.42, 1.18, 0.005]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#059669"
              emissiveIntensity={0.65}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* 6. Potted Fiddle-Leaf Fig Indoor Plants */}
      {[
        [-9.2, 0.05, -7.2],
        [-9.2, 0.05, 7.2],
        [9.2, 0.05, -7.2],
        [1.8, 0.05, -7.2],
      ].map(([px, py, pz], pIdx) => (
        <group key={`plant-${pIdx}`} position={[px, py, pz]}>
          {/* Ceramic Planter Pot */}
          <mesh castShadow position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.26, 0.2, 0.6, 14]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.58, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 12]} />
            <meshStandardMaterial color="#2d1d17" roughness={0.9} />
          </mesh>
          {/* Lush Green Foliage Clusters */}
          <mesh castShadow position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0.1, 1.18, 0]}>
            <sphereGeometry args={[0.34, 12, 12]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
