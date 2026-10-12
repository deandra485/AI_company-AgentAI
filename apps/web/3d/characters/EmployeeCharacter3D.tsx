'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Agent } from '@ai-company/types';
import { useAgentStore } from '@/stores/useAgentStore';
import { useUIStore } from '@/stores/useUIStore';

interface EmployeeCharacterProps {
  agent: Agent;
  currentPosition: [number, number, number];
  rotationY: number;
  isMoving: boolean;
  activityText?: string;
  activityIcon?: string;
}

export const EmployeeCharacter3D = ({
  agent,
  currentPosition,
  rotationY,
  isMoving,
  activityText,
  activityIcon = '💻',
}: EmployeeCharacterProps) => {
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId);
  const selectAgent = useAgentStore((s) => s.selectAgent);
  const setFollowAgentId = useUIStore((s) => s.setFollowAgentId);
  const setCameraMode = useUIStore((s) => s.setCameraMode);

  const isSelected = selectedAgentId === agent.id;

  // Animation limb refs
  const rootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Procedural Animation Loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedMultiplier = isMoving ? 10 : 3;

    if (isMoving) {
      // Natural Walking Cycle
      const legAngle = Math.sin(t * speedMultiplier) * 0.55;
      const armAngle = Math.sin(t * speedMultiplier) * 0.5;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle;

      // Natural vertical bobbing
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.58 + Math.abs(Math.sin(t * speedMultiplier)) * 0.04;
      }
    } else {
      // Sitting / Typing / Idle Cycle
      const isTyping = agent.status === 'WORKING';
      const isPraying = agent.status === 'PRAYING';

      if (isTyping) {
        // Arms forward on desk, hands typing
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -Math.PI / 2.6 + Math.sin(t * 14) * 0.08;
          leftArmRef.current.rotation.z = 0.2;
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = -Math.PI / 2.6 + Math.cos(t * 14) * 0.08;
          rightArmRef.current.rotation.z = -0.2;
        }
        // Seated legs bent at 90 deg
        if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI / 2.2;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI / 2.2;

        if (bodyRef.current) bodyRef.current.position.y = 0.44; // Seated height
        if (headRef.current) headRef.current.rotation.x = 0.15 + Math.sin(t * 2) * 0.04;
      } else if (isPraying) {
        // Serene prayer posture (kneeling / bowing)
        if (bodyRef.current) bodyRef.current.position.y = 0.32;
        if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI / 2;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI / 2;
        if (leftArmRef.current) leftArmRef.current.rotation.x = -0.4;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -0.4;
        if (headRef.current) headRef.current.rotation.x = 0.38;
      } else {
        // Standing / Relaxing Idle with breathing motion
        if (bodyRef.current) {
          bodyRef.current.position.y = 0.58 + Math.sin(t * 2) * 0.02;
        }
        if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
        if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 2) * 0.06;
        if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 2) * 0.06;
        if (headRef.current) headRef.current.rotation.y = Math.sin(t * 1.2) * 0.12;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectAgent(agent.id);
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    selectAgent(agent.id);
    setFollowAgentId(agent.id);
    setCameraMode('follow');
  };

  return (
    <group
      ref={rootRef}
      position={currentPosition}
      rotation={[0, rotationY, 0]}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Ground Contact Shadow / Selection Glow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[isSelected ? 0.6 : 0.35, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#38bdf8' : '#000000'}
          transparent
          opacity={isSelected ? 0.75 : 0.35}
        />
      </mesh>

      {/* Realistic Curved Human Figure */}
      <group ref={bodyRef} position={[0, 0.58, 0]}>
        {/* Contoured Torso / Shirt */}
        <mesh castShadow position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.18, 0.15, 0.44, 16]} />
          <meshStandardMaterial color={agent.avatarColor} roughness={0.65} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 0.1, 12]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>

        {/* Smooth Head */}
        <group ref={headRef} position={[0, 0.76, 0]}>
          {/* Face Sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.45} />
          </mesh>
          {/* Hair Sculpt */}
          <mesh position={[0, 0.04, -0.02]}>
            <sphereGeometry args={[0.168, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.05, 0.02, 0.145]}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <meshBasicMaterial color="#090d16" />
          </mesh>
          <mesh position={[0.05, 0.02, 0.145]}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <meshBasicMaterial color="#090d16" />
          </mesh>
        </group>

        {/* Left Arm & Hand */}
        <group ref={leftArmRef} position={[-0.24, 0.46, 0]}>
          {/* Shoulder & Arm Capsule */}
          <mesh castShadow position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.055, 0.05, 0.36, 12]} />
            <meshStandardMaterial color={agent.avatarColor} roughness={0.65} />
          </mesh>
          {/* Hand Sphere */}
          <mesh position={[0, -0.36, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>
        </group>

        {/* Right Arm & Hand */}
        <group ref={rightArmRef} position={[0.24, 0.46, 0]}>
          {/* Shoulder & Arm Capsule */}
          <mesh castShadow position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.055, 0.05, 0.36, 12]} />
            <meshStandardMaterial color={agent.avatarColor} roughness={0.65} />
          </mesh>
          {/* Hand Sphere */}
          <mesh position={[0, -0.36, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>
        </group>

        {/* Left Leg & Shoe */}
        <group ref={leftLegRef} position={[-0.1, 0.1, 0]}>
          {/* Trousers */}
          <mesh castShadow position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.065, 0.06, 0.44, 14]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.44, 0.04]}>
            <boxGeometry args={[0.12, 0.08, 0.22]} />
            <meshStandardMaterial color="#090d16" roughness={0.4} />
          </mesh>
        </group>

        {/* Right Leg & Shoe */}
        <group ref={rightLegRef} position={[0.1, 0.1, 0]}>
          {/* Trousers */}
          <mesh castShadow position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.065, 0.06, 0.44, 14]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.44, 0.04]}>
            <boxGeometry args={[0.12, 0.08, 0.22]} />
            <meshStandardMaterial color="#090d16" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Floating Thought / Activity Bubble */}
      <Html
        position={[0, 1.85, 0]}
        center
        distanceFactor={24}
        className="pointer-events-none select-none"
      >
        <div className="flex flex-col items-center animate-bounce-subtle">
          <div
            className={`px-3 py-1 rounded-2xl text-[11px] font-semibold flex items-center gap-1.5 shadow-xl backdrop-blur-md border ${
              isSelected
                ? 'bg-slate-900/95 text-white border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                : 'bg-slate-900/80 text-slate-200 border-white/20'
            }`}
          >
            <span className="text-sm">{activityIcon}</span>
            <span className="whitespace-nowrap font-medium">
              {activityText || agent.name.split(' ')[0]}
            </span>
          </div>
          <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1 border-r border-b border-white/20" />
        </div>
      </Html>
    </group>
  );
};
