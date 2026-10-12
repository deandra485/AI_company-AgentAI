'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useUIStore } from '@/stores/useUIStore';
import { useAgentStore } from '@/stores/useAgentStore';
import { CAMPUS_LOCATIONS } from '@ai-company/shared';

export const CameraController = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const activeLocationView = useUIStore((s) => s.activeLocationView);
  const cameraMode = useUIStore((s) => s.cameraMode);
  const followAgentId = useUIStore((s) => s.followAgentId);
  const setCameraMode = useUIStore((s) => s.setCameraMode);
  const setFollowAgentId = useUIStore((s) => s.setFollowAgentId);
  const setActiveLocationView = useUIStore((s) => s.setActiveLocationView);

  const livePositions = useAgentStore((s) => s.livePositions);
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId);

  // Keyboard input state
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs/textareas
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      keysPressed.current[e.key.toLowerCase()] = true;

      // 'F' key toggles Follow Employee mode
      if (e.key.toLowerCase() === 'f') {
        if (cameraMode === 'follow') {
          setCameraMode('campus');
          setFollowAgentId(null);
        } else {
          const targetAgentId = selectedAgentId || 'agent_bima';
          setFollowAgentId(targetAgentId);
          setCameraMode('follow');
        }
      }

      // 'R' key resets camera to Overview
      if (e.key.toLowerCase() === 'r') {
        setActiveLocationView('overview');
        setCameraMode('campus');
        setFollowAgentId(null);
        if (controlsRef.current) {
          camera.position.set(42, 38, 42);
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
      }

      // 'Escape' key cancels follow mode
      if (e.key === 'Escape') {
        if (cameraMode === 'follow') {
          setCameraMode('campus');
          setFollowAgentId(null);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    camera,
    cameraMode,
    selectedAgentId,
    setCameraMode,
    setFollowAgentId,
    setActiveLocationView,
  ]);

  // Smoothly reposition camera when an active campus zone is selected
  useEffect(() => {
    if (!controlsRef.current) return;

    if (activeLocationView === 'overview') {
      const targetPos = new THREE.Vector3(42, 38, 42);
      const targetLookAt = new THREE.Vector3(0, 0, 0);

      camera.position.set(targetPos.x, targetPos.y, targetPos.z);
      controlsRef.current.target.set(targetLookAt.x, targetLookAt.y, targetLookAt.z);
      controlsRef.current.update();
    } else {
      const loc = CAMPUS_LOCATIONS[activeLocationView];
      if (loc) {
        const [lx, ly, lz] = loc.position;
        camera.position.set(lx + 16, ly + 14, lz + 16);
        controlsRef.current.target.set(lx, ly + 1, lz);
        controlsRef.current.update();
      }
    }
  }, [activeLocationView, camera]);

  // RTS Camera Movement & Smooth Follow in useFrame
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // 1. Follow Employee Mode
    if (cameraMode === 'follow' && followAgentId) {
      const targetPos = livePositions[followAgentId];
      if (targetPos) {
        const [ax, ay, az] = targetPos;
        const currentTarget = controlsRef.current.target;

        // Smoothly lerp orbit target to followed agent's head
        currentTarget.x = THREE.MathUtils.lerp(currentTarget.x, ax, delta * 4);
        currentTarget.y = THREE.MathUtils.lerp(currentTarget.y, ay + 0.9, delta * 4);
        currentTarget.z = THREE.MathUtils.lerp(currentTarget.z, az, delta * 4);

        // Keep camera at comfortable trailing distance
        const desiredCamPos = new THREE.Vector3(ax + 8, ay + 7, az + 8);
        camera.position.lerp(desiredCamPos, delta * 3);
        controlsRef.current.update();
        return;
      }
    }

    // 2. Keyboard RTS Panning (WASD / Arrows) & Rotation (Q/E)
    const keys = keysPressed.current;
    const moveSpeed = 24 * delta;
    const rotSpeed = 1.8 * delta;

    // Get camera's forward and right vectors projected onto ground plane (Y = 0)
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    let moved = false;
    const panOffset = new THREE.Vector3();

    if (keys['w'] || keys['arrowup']) {
      panOffset.addScaledVector(forward, moveSpeed);
      moved = true;
    }
    if (keys['s'] || keys['arrowdown']) {
      panOffset.addScaledVector(forward, -moveSpeed);
      moved = true;
    }
    if (keys['a'] || keys['arrowleft']) {
      panOffset.addScaledVector(right, moveSpeed);
      moved = true;
    }
    if (keys['d'] || keys['arrowright']) {
      panOffset.addScaledVector(right, -moveSpeed);
      moved = true;
    }

    if (moved) {
      camera.position.add(panOffset);
      controlsRef.current.target.add(panOffset);
      controlsRef.current.update();
    }

    // Q/E Smooth Orbit Rotation
    if (keys['q']) {
      // Rotate around target to the left
      const offset = camera.position.clone().sub(controlsRef.current.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotSpeed);
      camera.position.copy(controlsRef.current.target).add(offset);
      controlsRef.current.update();
    }
    if (keys['e']) {
      // Rotate around target to the right
      const offset = camera.position.clone().sub(controlsRef.current.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotSpeed);
      camera.position.copy(controlsRef.current.target).add(offset);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={6}
      maxDistance={95}
      maxPolarAngle={Math.PI / 2.15} // Prevent clipping below the ground
      minPolarAngle={Math.PI / 8}   // Prevent top-down inversion
      panSpeed={0.8}
      rotateSpeed={0.7}
      zoomSpeed={0.9}
    />
  );
};
