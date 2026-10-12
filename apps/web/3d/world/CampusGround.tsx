'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { CAMPUS_LOCATIONS } from '@ai-company/shared';
import { LocationLabel3D } from './LocationLabel3D';
import { CityRoadsAndParking } from './CityRoadsAndParking';
import { DetailedOfficeInterior } from './DetailedOfficeInterior';
import { DetailedMosqueInterior } from './DetailedMosqueInterior';
import { DetailedAmenities } from './DetailedAmenities';

export const CampusGround = () => {
  return (
    <group>
      {/* 1. Base Campus Terrain Platform */}
      <mesh receiveShadow position={[0, -0.4, 0]}>
        <boxGeometry args={[78, 0.8, 78]} />
        <meshStandardMaterial color="#0b1120" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Lush Flat Park Grass (Flat on ground, Y = 0.005) */}
      <mesh receiveShadow position={[0, 0.005, 0]}>
        <boxGeometry args={[76, 0.01, 76]} />
        <meshStandardMaterial color="#142c22" roughness={0.95} />
      </mesh>

      {/* 2. City Roads, Sidewalks, Street Lamps & Parking Lot with Parked Cars */}
      <CityRoadsAndParking />

      {/* 3. Central Campus Pedestrian Plaza */}
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[6.5, 6.5, 0.05, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      {/* Monument Fountain */}
      <mesh receiveShadow castShadow position={[0, 0.25, 0]}>
        <torusGeometry args={[2.5, 0.25, 16, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[2.3, 2.3, 0.15, 32]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} transparent opacity={0.85} />
      </mesh>

      {/* Paved Walkway System Connecting Plaza to All Buildings */}
      {/* North: To Mosque */}
      <mesh receiveShadow position={[0, 0.02, -11]}>
        <boxGeometry args={[4, 0.04, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* South: To Office */}
      <mesh receiveShadow position={[0, 0.02, 5]}>
        <boxGeometry args={[4.5, 0.04, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* West: To Cafeteria */}
      <mesh receiveShadow position={[-11, 0.02, 5]}>
        <boxGeometry args={[16, 0.04, 3.5]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* East: To Lounge */}
      <mesh receiveShadow position={[11, 0.02, 5]}>
        <boxGeometry args={[16, 0.04, 3.5]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Diagonal North-West: To Garden */}
      <mesh receiveShadow position={[-11, 0.02, -10]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[3.2, 0.04, 15]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Diagonal North-East: To Pool */}
      <mesh receiveShadow position={[11, 0.02, -10]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[3.2, 0.04, 15]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* 4. Detailed Cutaway Building Architectures */}
      {/* Main Office Interior (desks, computers, chairs, meeting room, manager office) */}
      <DetailedOfficeInterior />

      {/* Mosque Interior (prayer hall, saf carpet lines, mihrab, wudu station, minaret) */}
      <DetailedMosqueInterior />

      {/* Amenities (cafeteria pavilion, swimming pool, coffee lounge, botanical garden) */}
      <DetailedAmenities />

      {/* 5. 3D Floating Location Labels */}
      <LocationLabel3D location={CAMPUS_LOCATIONS.office} heightOffset={3.8} />
      <LocationLabel3D location={CAMPUS_LOCATIONS.mosque} heightOffset={5.5} />
      <LocationLabel3D location={CAMPUS_LOCATIONS.cafeteria} heightOffset={3.8} />
      <LocationLabel3D location={CAMPUS_LOCATIONS.pool} heightOffset={3.5} />
      <LocationLabel3D location={CAMPUS_LOCATIONS.lounge} heightOffset={3.8} />
      <LocationLabel3D location={CAMPUS_LOCATIONS.garden} heightOffset={4.2} />
    </group>
  );
};
