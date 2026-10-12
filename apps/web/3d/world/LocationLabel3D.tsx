'use client';

import { Html } from '@react-three/drei';
import { LocationInfo } from '@ai-company/types';
import { useUIStore } from '@/stores/useUIStore';

interface Props {
  location: LocationInfo;
  heightOffset?: number;
}

export const LocationLabel3D = ({ location, heightOffset = 4.8 }: Props) => {
  const showLabels = useUIStore((s) => s.showLabels);
  const activeLocationView = useUIStore((s) => s.activeLocationView);
  const setActiveLocationView = useUIStore((s) => s.setActiveLocationView);

  if (!showLabels) return null;

  const isActive = activeLocationView === location.id;

  return (
    <group position={[location.position[0], location.position[1] + heightOffset, location.position[2]]}>
      <Html center distanceFactor={42} zIndexRange={[100, 0]}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveLocationView(isActive ? 'overview' : location.id);
          }}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 shadow-lg cursor-pointer whitespace-nowrap ${
            isActive
              ? 'bg-indigo-600/90 text-white border-2 border-indigo-400 ring-4 ring-indigo-500/30 scale-105'
              : 'bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-white/20 hover:border-white/40 hover:scale-105'
          }`}
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
        >
          <span className="text-sm">{location.icon}</span>
          <span className="tracking-wide">{location.name}</span>
          <span
            className="w-1.5 h-1.5 rounded-full ml-0.5 animate-pulse"
            style={{ backgroundColor: location.color }}
          />
        </button>
      </Html>
    </group>
  );
};
