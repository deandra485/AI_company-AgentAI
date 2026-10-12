'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '@/stores/useWorldStore';

interface RealisticCarProps {
  color: string;
  position: [number, number, number];
  rotationY?: number;
}

const RealisticCar = ({ color, position, rotationY = 0 }: RealisticCarProps) => {
  const phase = useWorldStore((s) => s.phase);
  const isNight = phase === 'EVENING' || phase === 'NIGHT' || phase === 'DAWN';

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Main Aerodynamic Lower Chassis */}
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <boxGeometry args={[3.8, 0.42, 1.76]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} />
      </mesh>

      {/* Front Sloping Hood Taper */}
      <mesh castShadow receiveShadow position={[1.2, 0.48, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[1.2, 0.22, 1.7]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} />
      </mesh>

      {/* Front Bumper & Lower Air Intake */}
      <mesh position={[1.86, 0.24, 0]}>
        <boxGeometry args={[0.16, 0.24, 1.68]} />
        <meshStandardMaterial color="#090d16" roughness={0.7} />
      </mesh>
      {/* Chrome Grille Accent */}
      <mesh position={[1.9, 0.38, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Rear Bumper & Diffuser */}
      <mesh position={[-1.86, 0.26, 0]}>
        <boxGeometry args={[0.16, 0.26, 1.68]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      {/* Dual Exhaust Tips */}
      <mesh position={[-1.94, 0.18, 0.45]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-1.94, 0.18, -0.45]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 2. Cabin Greenhouse (Roof & Glass) */}
      {/* Roof */}
      <mesh castShadow position={[-0.2, 0.94, 0]}>
        <boxGeometry args={[1.8, 0.08, 1.48]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} />
      </mesh>

      {/* Cabin Interior Base */}
      <mesh position={[-0.2, 0.68, 0]}>
        <boxGeometry args={[1.7, 0.44, 1.44]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>

      {/* Slanted Front Windshield Glass */}
      <mesh position={[0.74, 0.76, 0]} rotation={[0, 0, -Math.PI / 4.2]}>
        <boxGeometry args={[0.06, 0.58, 1.46]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.05}
          metalness={0.2}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Slanted Rear Window Glass */}
      <mesh position={[-1.12, 0.78, 0]} rotation={[0, 0, Math.PI / 4.4]}>
        <boxGeometry args={[0.06, 0.52, 1.46]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.05}
          metalness={0.2}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Side Windows (Left & Right) */}
      <mesh position={[-0.2, 0.76, 0.74]}>
        <boxGeometry args={[1.72, 0.38, 0.02]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.08}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[-0.2, 0.76, -0.74]}>
        <boxGeometry args={[1.72, 0.38, 0.02]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.08}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Aerodynamic Side Mirrors */}
      <mesh position={[0.7, 0.68, 0.9]}>
        <boxGeometry args={[0.18, 0.1, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[0.7, 0.68, -0.9]}>
        <boxGeometry args={[0.18, 0.1, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
      </mesh>

      {/* 3. Modern LED Headlights (Left & Right) */}
      <mesh position={[1.88, 0.44, 0.62]}>
        <boxGeometry args={[0.08, 0.14, 0.34]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive={isNight ? '#38bdf8' : '#e0f2fe'}
          emissiveIntensity={isNight ? 2.5 : 0.6}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[1.88, 0.44, -0.62]}>
        <boxGeometry args={[0.08, 0.14, 0.34]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive={isNight ? '#38bdf8' : '#e0f2fe'}
          emissiveIntensity={isNight ? 2.5 : 0.6}
          roughness={0.1}
        />
      </mesh>

      {/* Continuous Red LED Taillight Strip */}
      <mesh position={[-1.88, 0.46, 0]}>
        <boxGeometry args={[0.06, 0.1, 1.54]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive={isNight ? '#dc2626' : '#991b1b'}
          emissiveIntensity={isNight ? 2.2 : 0.8}
          roughness={0.2}
        />
      </mesh>

      {/* 4. Realistic 3D Alloy Wheels (4 wheels) */}
      {[
        [1.1, 0.28, 0.88],
        [-1.1, 0.28, 0.88],
        [1.1, 0.28, -0.88],
        [-1.1, 0.28, -0.88],
      ].map(([wx, wy, wz], wIdx) => (
        <group key={`wheel-${wIdx}`} position={[wx, wy, wz]}>
          {/* Outer Black Rubber Tire */}
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
            <meshStandardMaterial color="#090d16" roughness={0.88} />
          </mesh>
          {/* Inner Silver Alloy Multi-Spoke Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.23, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Center Hubcap Accent */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.24, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Red Brake Caliper */}
          <mesh position={[0.1, 0.08, 0]}>
            <boxGeometry args={[0.14, 0.1, 0.18]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const CityRoadsAndParking = () => {
  const phase = useWorldStore((s) => s.phase);
  const isNight = phase === 'EVENING' || phase === 'NIGHT' || phase === 'DAWN';

  // Realistic modern car lineup
  const parkedCars = useMemo(
    () => [
      { x: 10, z: 24.5, color: '#1d4ed8', rot: Math.PI / 2 }, // Deep Executive Royal Blue
      { x: 14, z: 24.5, color: '#b91c1c', rot: Math.PI / 2 }, // Crimson Metallic Red
      { x: 18, z: 24.5, color: '#047857', rot: Math.PI / 2 }, // Emerald Pearl Green
      { x: 22, z: 24.5, color: '#334155', rot: Math.PI / 2 }, // Slate Grey Sport
      { x: 26, z: 24.5, color: '#f8fafc', rot: Math.PI / 2 }, // Glacier White Luxury
    ],
    []
  );

  const streetLamps = useMemo(
    () => [
      { x: -32, z: 21 },
      { x: -16, z: 21 },
      { x: 0, z: 21 },
      { x: 16, z: 21 },
      { x: 32, z: 21 },
      { x: -32, z: -2 },
      { x: 32, z: -2 },
    ],
    []
  );

  return (
    <group>
      {/* 1. South Main City Avenue (Realistic Dark Aggregate Asphalt) */}
      <mesh receiveShadow position={[0, 0.02, 28]}>
        <boxGeometry args={[74, 0.04, 7]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Crisp Yellow Center Dashed Divider */}
      {[-30, -20, -10, 0, 10, 20, 30].map((lx, i) => (
        <mesh key={`dash-${i}`} receiveShadow position={[lx, 0.045, 28]}>
          <boxGeometry args={[4, 0.01, 0.32]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} />
        </mesh>
      ))}

      {/* Road Edge Solid White Safety Lines */}
      <mesh receiveShadow position={[0, 0.045, 24.8]}>
        <boxGeometry args={[74, 0.01, 0.18]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh receiveShadow position={[0, 0.045, 31.2]}>
        <boxGeometry args={[74, 0.01, 0.18]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* High-Contrast Pedestrian Zebra Crosswalks */}
      {[-1.8, -0.6, 0.6, 1.8].map((offset, i) => (
        <mesh key={`zebra-${i}`} receiveShadow position={[0, 0.046, 26 + offset * 1.5]}>
          <boxGeometry args={[4.5, 0.01, 0.55]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </mesh>
      ))}

      {/* Concrete Curbs & Sidewalk */}
      <mesh receiveShadow position={[0, 0.07, 23]}>
        <boxGeometry args={[74, 0.09, 2.5]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Curb Chamfer Stone Trim */}
      <mesh position={[0, 0.115, 24.2]}>
        <boxGeometry args={[74, 0.04, 0.12]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>

      {/* 2. Employee Parking Lot Area */}
      <group position={[18, 0, 24.5]}>
        {/* Parking Lot Ground with Asphalt Finish */}
        <mesh receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[22, 0.05, 5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* Parking Stall Dividing Lines */}
        {[-8, -4, 0, 4, 8].map((px, i) => (
          <mesh key={`stall-${i}`} receiveShadow position={[px, 0.08, 0]}>
            <boxGeometry args={[0.14, 0.01, 4.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </mesh>
        ))}

        {/* Parking Wheel Stops (Concrete barriers) */}
        {[-6, -2, 2, 6].map((bx, i) => (
          <mesh key={`stop-${i}`} castShadow receiveShadow position={[bx, 0.12, 1.8]}>
            <boxGeometry args={[1.8, 0.1, 0.18]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Parked Realistic 3D Cars */}
      {parkedCars.map((car, idx) => (
        <RealisticCar
          key={`car-${idx}`}
          color={car.color}
          position={[car.x, 0.08, car.z]}
          rotationY={car.rot}
        />
      ))}

      {/* 3. Modern Curved LED Street Lamps */}
      {streetLamps.map((lamp, idx) => (
        <group key={`lamp-${idx}`} position={[lamp.x, 0.08, lamp.z]}>
          {/* Base Mount */}
          <mesh castShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.3, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Sleek Tapered Pole */}
          <mesh castShadow position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.05, 0.09, 4.2, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Curved Gooseneck Arm */}
          <mesh position={[0, 4.35, 0.45]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 10]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Aerodynamic Luminaire Head */}
          <mesh position={[0, 4.65, 0.82]}>
            <boxGeometry args={[0.3, 0.08, 0.55]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Glowing LED Lens */}
          <mesh position={[0, 4.6, 0.82]}>
            <boxGeometry args={[0.22, 0.02, 0.42]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive={isNight ? '#fef08a' : '#475569'}
              emissiveIntensity={isNight ? 3.0 : 0.2}
            />
          </mesh>
          {/* Point Light at Night */}
          {isNight && (
            <pointLight position={[0, 4.5, 0.82]} color="#fef08a" intensity={2.0} distance={14} />
          )}
        </group>
      ))}
    </group>
  );
};
