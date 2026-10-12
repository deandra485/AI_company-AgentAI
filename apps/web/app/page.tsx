'use client';

import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/overlay/LoadingScreen';
import { Header } from '@/components/overlay/Header';
import { TimeControls } from '@/components/overlay/TimeControls';
import { EmployeeRoster } from '@/components/overlay/EmployeeRoster';
import { SelectedAgentPanel } from '@/components/overlay/SelectedAgentPanel';
import { ActivityFeed } from '@/components/overlay/ActivityFeed';
import { AssignJobdeskModal } from '@/components/overlay/AssignJobdeskModal';

// Dynamic import of 3D Canvas with ssr disabled to guarantee clean WebGL initialization
const SceneCanvas = dynamic(
  () => import('@/3d/SceneCanvas').then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function OfficeSimulationPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#090d16]">
      {/* 1. Initial Interactive Loading Screen */}
      <LoadingScreen />

      {/* 2. WebGL 3D Campus Canvas */}
      <SceneCanvas />

      {/* 3. HUD Controls and UI Overlays */}
      <Header />
      <EmployeeRoster />
      <SelectedAgentPanel />
      <ActivityFeed />
      <TimeControls />

      {/* 4. Interactive AI Jobdesk Assignment Modal */}
      <AssignJobdeskModal />
    </main>
  );
}
