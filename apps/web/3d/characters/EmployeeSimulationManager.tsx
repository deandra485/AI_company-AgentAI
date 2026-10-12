'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorldStore } from '@/stores/useWorldStore';
import { useAgentStore } from '@/stores/useAgentStore';
import { useJobdeskStore } from '@/stores/useJobdeskStore';
import { useUIStore } from '@/stores/useUIStore';
import { INITIAL_AGENTS } from '@ai-company/shared';
import { Agent, LocationId } from '@ai-company/types';
import { EmployeeCharacter3D } from './EmployeeCharacter3D';

interface AgentSimState {
  currentPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  waypoints: THREE.Vector3[];
  waypointIndex: number;
  rotationY: number;
  isMoving: boolean;
  activityText: string;
  activityIcon: string;
  celebratingUntil?: number;
  nextAutonomousActionTime: number;
  autonomousActionType: string;
}

const getRoleSubSteps = (role: string, progress: number): string => {
  if (role === 'developer') {
    if (progress < 25) return 'Analisis arsitektur & deps';
    if (progress < 50) return 'Tulis unit tests & kode';
    if (progress < 75) return 'Refactoring & fix edge cases';
    if (progress < 99) return 'Build CI & compile TS';
    return 'PR Approved & Merged! 🎉';
  } else if (role === 'designer') {
    if (progress < 25) return 'Wireframe & user flow';
    if (progress < 50) return 'Komponen UI high-fidelity';
    if (progress < 75) return 'Prototipe interaksi 3D';
    if (progress < 99) return 'Ekspor token Figma';
    return 'Desain Disetujui! 🎨';
  } else if (role === 'marketing') {
    if (progress < 25) return 'Riset matriks kompetitor';
    if (progress < 50) return 'Draft copy & aset kampanye';
    if (progress < 75) return 'A/B testing variasi pesan';
    if (progress < 99) return 'Analisis conversion rate';
    return 'Kampanye Sukses Meluncur! 🚀';
  } else if (role === 'researcher') {
    if (progress < 25) return 'Review paper AI terbaru';
    if (progress < 50) return 'Tuning embeddings RAG';
    if (progress < 75) return 'Benchmarking model LLM';
    if (progress < 99) return 'Sintesis laporan akurasi';
    return 'Optimasi Model Selesai! 🧠';
  } else if (role === 'manager') {
    if (progress < 25) return 'Sprint backlog grooming';
    if (progress < 50) return 'Review PR tim & bottleneck';
    if (progress < 75) return 'Update roadmap deliverable';
    if (progress < 99) return 'Finalisasi KPI mingguan';
    return 'Milestone Sprint Tercapai! 📊';
  } else {
    if (progress < 25) return 'Sinkronisasi database';
    if (progress < 50) return 'Audit log operasional';
    if (progress < 75) return 'Otomasi deployment script';
    if (progress < 99) return 'Verifikasi infrastruktur';
    return 'Sistem Prima! ⚡';
  }
};

export const EmployeeSimulationManager = () => {
  const hour = useWorldStore((s) => s.hour);
  const minute = useWorldStore((s) => s.minute);
  const second = useWorldStore((s) => s.second);
  const speed = useWorldStore((s) => s.speed);
  const isPaused = useWorldStore((s) => s.isPaused);
  const isRealtime = useWorldStore((s) => s.isRealtime);

  const agents = useAgentStore((s) => s.agents);
  const updateAgent = useAgentStore((s) => s.updateAgent);
  const addActivityLog = useAgentStore((s) => s.addActivityLog);

  const jobdesks = useJobdeskStore((s) => s.jobdesks);
  const updateJobdeskProgress = useJobdeskStore((s) => s.updateJobdeskProgress);
  const completeJobdesk = useJobdeskStore((s) => s.completeJobdesk);

  // Key campus transit waypoints
  const transitHubs = useMemo(
    () => ({
      plaza: new THREE.Vector3(0, 0.05, 0),
      officeDoor: new THREE.Vector3(0, 0.05, 4.5),
      officeHallway: new THREE.Vector3(0, 0.05, 9),
      mosqueDoor: new THREE.Vector3(0, 0.05, -14),
      cafeteriaDoor: new THREE.Vector3(-14, 0.05, 5),
      loungeDoor: new THREE.Vector3(14, 0.05, 5),
      gardenDoor: new THREE.Vector3(-14, 0.05, -12),
      poolDoor: new THREE.Vector3(14, 0.05, -12),
      parking: new THREE.Vector3(14, 0.05, 24),
    }),
    []
  );

  // Local state tracking positions and movement for each of the 6 agents
  const simStateRef = useRef<Record<string, AgentSimState>>({});

  // Initialize sim state once with staggered timers
  if (Object.keys(simStateRef.current).length === 0) {
    INITIAL_AGENTS.forEach((agent, idx) => {
      const startPos = new THREE.Vector3(
        agent.deskPosition[0],
        agent.deskPosition[1],
        agent.deskPosition[2]
      );
      simStateRef.current[agent.id] = {
        currentPos: startPos.clone(),
        targetPos: startPos.clone(),
        waypoints: [],
        waypointIndex: 0,
        rotationY: 0,
        isMoving: false,
        activityText: 'Fokus Kerja di Meja',
        activityIcon: '💻',
        // Stagger initial autonomous choices
        nextAutonomousActionTime: Date.now() + (idx * 5000 + 10000),
        autonomousActionType: 'DESK',
      };
    });
  }

  // Helper function to build intelligent multi-point waypoints between campus hubs
  const computeWaypoints = (from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3[] => {
    const waypoints: THREE.Vector3[] = [];
    const isFromOffice = from.z > 2 && from.z < 18.5 && Math.abs(from.x) < 10.5;
    const isToOffice = to.z > 2 && to.z < 18.5 && Math.abs(to.x) < 10.5;

    if (isFromOffice && isToOffice) {
      // Internal office navigation: route through center hallway if crossing pods
      if ((from.x < 0 && to.x > 0) || (from.x > 0 && to.x < 0)) {
        waypoints.push(new THREE.Vector3(0, 0.05, (from.z + to.z) / 2));
      }
      waypoints.push(to.clone());
      return waypoints;
    }

    // Cross-building campus transit:
    if (isFromOffice) {
      waypoints.push(transitHubs.officeDoor.clone());
    }
    waypoints.push(transitHubs.plaza.clone());

    if (isToOffice) {
      waypoints.push(transitHubs.officeDoor.clone());
    } else if (to.z < -16) {
      // Mosque
      waypoints.push(transitHubs.mosqueDoor.clone());
    } else if (to.x < -16 && to.z > 0) {
      // Cafeteria
      waypoints.push(transitHubs.cafeteriaDoor.clone());
    } else if (to.x > 16 && to.z > 0) {
      // Lounge
      waypoints.push(transitHubs.loungeDoor.clone());
    } else if (to.x < -16 && to.z < 0) {
      // Garden
      waypoints.push(transitHubs.gardenDoor.clone());
    } else if (to.x > 16 && to.z < 0) {
      // Pool
      waypoints.push(transitHubs.poolDoor.clone());
    }

    waypoints.push(to.clone());
    return waypoints;
  };

  // Autonomous Simulation Loop (evaluated every tick / second)
  useEffect(() => {
    const totalMinutes = hour * 60 + minute;
    const now = Date.now();

    INITIAL_AGENTS.forEach((agent) => {
      const state = simStateRef.current[agent.id];
      if (!state) return;

      // =========================================================================
      // PRIORITAS 1: USER-ASSIGNED JOBDESK (INSTANT RETURN TO WORKSTATION)
      // =========================================================================
      const activeJob = jobdesks.find(
        (j) => j.agentId === agent.id && j.status === 'IN_PROGRESS'
      );

      if (activeJob) {
        const deskPos = new THREE.Vector3(
          agent.deskPosition[0],
          agent.deskPosition[1],
          agent.deskPosition[2]
        );

        // Calculate progress increment for this tick
        const tickStep = (100 / activeJob.durationSec) * (isRealtime ? 1 : Math.max(speed, 1));
        const newProgress = Math.min(Math.round(activeJob.progress + tickStep), 100);
        const subStep = getRoleSubSteps(agent.role, newProgress);

        updateJobdeskProgress(activeJob.id, newProgress, subStep);

        const actText = `${activeJob.title} (${newProgress}%)`;
        const actIcon = '⚡';

        // Check if agent needs to navigate back to desk
        if (state.targetPos.distanceTo(deskPos) > 0.8) {
          state.waypoints = computeWaypoints(state.currentPos, deskPos);
          state.waypointIndex = 0;
          state.targetPos = deskPos.clone();
        }

        if (newProgress >= 100) {
          completeJobdesk(activeJob.id);
          state.celebratingUntil = now + 4000;
          state.activityIcon = '🎉';
          state.activityText = `Selesai: ${activeJob.title}!`;
          // Reset autonomous timer so they can resume free agency after celebration
          state.nextAutonomousActionTime = now + 5000;

          addActivityLog({
            agentId: agent.id,
            agentName: agent.name,
            message: `Berhasil menyelesaikan jobdesk: "${activeJob.title}"`,
            icon: '🎉',
            type: 'task',
            timestamp: `${hour.toString().padStart(2, '0')}:${minute
              .toString()
              .padStart(2, '0')}:${second.toString().padStart(2, '0')}`,
          });
        } else {
          state.activityText = actText;
          state.activityIcon = actIcon;
        }

        updateAgent(agent.id, {
          status: 'WORKING',
          locationId: 'office',
          currentActivity: `${activeJob.title} — ${subStep}`,
          currentTaskTitle: activeJob.title,
          progress: newProgress,
        });
        return;
      }

      // =========================================================================
      // CELEBRATION STATE (Brief period after completing a job)
      // =========================================================================
      if (state.celebratingUntil && now < state.celebratingUntil) {
        state.activityIcon = '🎉';
        state.activityText = 'Pekerjaan Berhasil!';
        return;
      }

      // =========================================================================
      // PRIORITAS 2: PRAYER TIMES (AZAN / SHOLAT DI MASJID KAMPUS)
      // Subuh: 04:25-04:55 | Zuhur: 12:00-12:35 | Ashar: 15:00-15:30
      // Maghrib: 18:00-18:25 | Isya: 19:15-19:45
      // =========================================================================
      const isSubuh = totalMinutes >= 265 && totalMinutes < 295;
      const isZuhur = totalMinutes >= 720 && totalMinutes < 755;
      const isAshar = totalMinutes >= 900 && totalMinutes < 930;
      const isMaghrib = totalMinutes >= 1080 && totalMinutes < 1105;
      const isIsya = totalMinutes >= 1155 && totalMinutes < 1185;

      if (isSubuh || isZuhur || isAshar || isMaghrib || isIsya) {
        const prayerPos = new THREE.Vector3(
          agent.id === 'agent_arya' ? 0 : agent.id === 'agent_bima' ? -2 : 2,
          0.05,
          -22
        );

        if (state.targetPos.distanceTo(prayerPos) > 1.2) {
          state.waypoints = computeWaypoints(state.currentPos, prayerPos);
          state.waypointIndex = 0;
          state.targetPos = prayerPos.clone();
        }

        const prayerName = isSubuh
          ? 'Salat Subuh di Masjid'
          : isZuhur
          ? 'Salat Zuhur di Masjid'
          : isAshar
          ? 'Salat Ashar di Masjid'
          : isMaghrib
          ? 'Salat Maghrib di Masjid'
          : 'Salat Isya di Masjid';

        state.activityText = prayerName;
        state.activityIcon = '🕌';

        updateAgent(agent.id, {
          status: 'PRAYING',
          locationId: 'mosque',
          currentActivity: prayerName,
          progress: 50,
        });
        return;
      }

      // =========================================================================
      // PRIORITAS 3: BREAK & MEAL TIMES (KAFETERIA)
      // Morning Break: 10:00 - 10:25 | Lunch: 12:35 - 13:10 | Dinner: 19:45 - 20:15
      // =========================================================================
      const isMorningBreak = totalMinutes >= 600 && totalMinutes < 625;
      const isLunchTime = totalMinutes >= 755 && totalMinutes < 790;
      const isDinnerTime = totalMinutes >= 1185 && totalMinutes < 1215;

      if (isMorningBreak || isLunchTime || isDinnerTime) {
        const cafeteriaPos = new THREE.Vector3(-22 + (Math.random() - 0.5) * 2, 0.05, 10);

        if (state.targetPos.distanceTo(cafeteriaPos) > 2.0) {
          state.waypoints = computeWaypoints(state.currentPos, cafeteriaPos);
          state.waypointIndex = 0;
          state.targetPos = cafeteriaPos.clone();
        }

        const mealText = isLunchTime
          ? 'Makan Siang di Kafeteria'
          : isDinnerTime
          ? 'Makan Malam di Kafeteria'
          : 'Istirahat Kopi Pagi';

        state.activityText = mealText;
        state.activityIcon = isLunchTime || isDinnerTime ? '🍜' : '☕';

        updateAgent(agent.id, {
          status: isLunchTime || isDinnerTime ? 'EATING' : 'BREAK',
          locationId: 'cafeteria',
          currentActivity: mealText,
        });
        return;
      }

      // =========================================================================
      // PRIORITAS 4: AUTONOMOUS OFFICE LIFE (24/7 LIVING AI COMPANY)
      // Karyawan bergerak bebas & aktif 24 jam sehari selayaknya AI agent sejati!
      // =========================================================================
      const isNightHours = totalMinutes < 360 || totalMinutes >= 1260; // 21:00 - 06:00

      if (now >= state.nextAutonomousActionTime && state.waypoints.length === 0) {
        const roll = Math.random();
        let nextDestination: THREE.Vector3;
        let actText = '';
        let actIcon = '💻';
        let actionDurationSec = 20;

        if (roll < 0.38) {
          // 1. BEKERJA DI MEJA KERJA SENDIRI
          nextDestination = new THREE.Vector3(
            agent.deskPosition[0],
            agent.deskPosition[1],
            agent.deskPosition[2]
          );
          if (agent.role === 'developer') {
            actText = isNightHours ? 'Nocturnal Coding & Refactor' : 'Coding & Refactoring';
            actIcon = '💻';
          } else if (agent.role === 'designer') {
            actText = isNightHours ? 'Desain UI Dark Mode' : 'Desain 3D UI & Mockup';
            actIcon = '🎨';
          } else if (agent.role === 'marketing') {
            actText = isNightHours ? 'Review Analitik Global' : 'Analisis Funnel & Ads';
            actIcon = '📣';
          } else if (agent.role === 'researcher') {
            actText = isNightHours ? 'Training Model LLM Semalaman' : 'Riset Model AI & Prompt';
            actIcon = '🔬';
          } else if (agent.role === 'manager') {
            actText = isNightHours ? 'Review Backlog & KPI' : 'Sprint Review & Roadmap';
            actIcon = '📊';
          } else {
            actText = isNightHours ? 'Maintenance Server & Log' : 'Audit Log Infrastruktur';
            actIcon = '📋';
          }
          actionDurationSec = 20 + Math.floor(Math.random() * 15);
        } else if (roll < 0.58) {
          // 2. MENDATANGI MEJA REKAN KERJA UNTUK DISKUSI / PAIR PROGRAMMING
          const otherColleagues = INITIAL_AGENTS.filter((a) => a.id !== agent.id);
          const buddy = otherColleagues[Math.floor(Math.random() * otherColleagues.length)];
          nextDestination = new THREE.Vector3(
            buddy.deskPosition[0] + (buddy.deskPosition[0] > 0 ? -1.0 : 1.0),
            0.05,
            buddy.deskPosition[2] + 0.3
          );
          actText = `Diskusi bareng ${buddy.name.split(' ')[0]}`;
          actIcon = '💬';
          actionDurationSec = 14 + Math.floor(Math.random() * 10);
        } else if (roll < 0.74) {
          // 3. RUANG RAPAT (CONFERENCE / MEETING ROOM)
          nextDestination = new THREE.Vector3(
            5.5 + (Math.random() - 0.5) * 1.5,
            0.05,
            14.5 + (Math.random() - 0.5) * 0.8
          );
          actText = isNightHours ? 'Night Standup di Ruang Rapat' : 'Cek Papan Tulis di Ruang Rapat';
          actIcon = '📋';
          actionDurationSec = 15 + Math.floor(Math.random() * 12);
        } else if (roll < 0.88) {
          // 4. PANTRY / COFFEE LOUNGE (BIKIN KOPI / MINUM AIR)
          nextDestination = new THREE.Vector3(
            22 + (Math.random() - 0.5) * 2,
            0.05,
            10 + (Math.random() - 0.5) * 2
          );
          actText = isNightHours ? 'Seduh Kopi Hangat di Pantry' : 'Bikin Kopi di Pantry Lounge';
          actIcon = '☕';
          actionDurationSec = 14 + Math.floor(Math.random() * 8);
        } else {
          // 5. JALAN KE TAMAN / PLAZA (PEREGANGAN & CARI UDARA SEGAR)
          nextDestination = new THREE.Vector3(
            -22 + (Math.random() - 0.5) * 3,
            0.05,
            -18 + (Math.random() - 0.5) * 3
          );
          actText = isNightHours ? 'Jalan Santai Lampu Taman' : 'Jalan Santai di Taman';
          actIcon = '🌿';
          actionDurationSec = 15 + Math.floor(Math.random() * 10);
        }

        // Set next action timestamp
        state.nextAutonomousActionTime = now + actionDurationSec * 1000;
        state.activityText = actText;
        state.activityIcon = actIcon;

        // Build route if moving away from current spot
        if (state.targetPos.distanceTo(nextDestination) > 0.8) {
          state.waypoints = computeWaypoints(state.currentPos, nextDestination);
          state.waypointIndex = 0;
          state.targetPos = nextDestination.clone();
        }

        updateAgent(agent.id, {
          status: actText.includes('Coding') || actText.includes('Desain') ? 'WORKING' : 'WALKING',
          locationId: nextDestination.z > 2 && nextDestination.z < 18 ? 'office' : 'lounge',
          currentActivity: actText,
        });
      }
    });
  }, [
    hour,
    minute,
    second,
    speed,
    isRealtime,
    jobdesks,
    transitHubs,
    updateAgent,
    updateJobdeskProgress,
    completeJobdesk,
    addActivityLog,
  ]);

  // Frame update: Smooth character movement along waypoints
  const [, setRenderTrigger] = useState(0);

  useFrame((_, delta) => {
    if (isPaused) return;

    const moveSpeed = 3.6 * (speed > 1 ? Math.min(speed, 5) : 1);
    const step = moveSpeed * delta;

    let hasMoved = false;

    INITIAL_AGENTS.forEach((agent) => {
      const state = simStateRef.current[agent.id];
      if (!state || state.waypoints.length === 0) return;

      const currentWaypoint = state.waypoints[state.waypointIndex];
      if (!currentWaypoint) {
        state.isMoving = false;
        return;
      }

      const dist = state.currentPos.distanceTo(currentWaypoint);

      if (dist < 0.35) {
        // Advance to next waypoint
        if (state.waypointIndex < state.waypoints.length - 1) {
          state.waypointIndex += 1;
        } else {
          state.waypoints = [];
          state.isMoving = false;
          hasMoved = true;
          return;
        }
      } else {
        // Move towards waypoint
        const dir = new THREE.Vector3().subVectors(currentWaypoint, state.currentPos).normalize();
        state.currentPos.addScaledVector(dir, Math.min(step, dist));
        state.rotationY = Math.atan2(dir.x, dir.z);
        state.isMoving = true;
        hasMoved = true;
      }
    });

    if (hasMoved) {
      INITIAL_AGENTS.forEach((agent) => {
        const s = simStateRef.current[agent.id];
        if (s) {
          useAgentStore
            .getState()
            .setLivePosition(agent.id, [s.currentPos.x, s.currentPos.y, s.currentPos.z]);
        }
      });
      setRenderTrigger((v) => (v + 1) % 1000);
    }
  });

  return (
    <group>
      {INITIAL_AGENTS.map((agent) => {
        const state = simStateRef.current[agent.id];
        if (!state) return null;

        return (
          <EmployeeCharacter3D
            key={agent.id}
            agent={agent}
            currentPosition={[state.currentPos.x, state.currentPos.y, state.currentPos.z]}
            rotationY={state.rotationY}
            isMoving={state.isMoving}
            activityText={state.activityText}
            activityIcon={state.activityIcon}
          />
        );
      })}
    </group>
  );
};
