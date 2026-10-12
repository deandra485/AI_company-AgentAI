'use client';

import { useEffect } from 'react';
import { useWorldStore } from '@/stores/useWorldStore';
import { useUIStore } from '@/stores/useUIStore';
import { useAgentStore } from '@/stores/useAgentStore';
import { Play, Pause, RotateCcw, Eye, EyeOff, Compass, UserCheck, Sun, Moon } from 'lucide-react';

export const TimeControls = () => {
  const speed = useWorldStore((s) => s.speed);
  const isPaused = useWorldStore((s) => s.isPaused);
  const isRealtime = useWorldStore((s) => s.isRealtime);
  const toggleRealtimeMode = useWorldStore((s) => s.toggleRealtimeMode);
  const phase = useWorldStore((s) => s.phase);
  const setDayNightPreset = useWorldStore((s) => s.setDayNightPreset);
  const tick = useWorldStore((s) => s.tick);
  const setSpeed = useWorldStore((s) => s.setSpeed);
  const togglePause = useWorldStore((s) => s.togglePause);
  const resetDay = useWorldStore((s) => s.resetDay);

  const showLabels = useUIStore((s) => s.showLabels);
  const toggleLabels = useUIStore((s) => s.toggleLabels);
  const setActiveLocationView = useUIStore((s) => s.setActiveLocationView);
  const cameraMode = useUIStore((s) => s.cameraMode);
  const setCameraMode = useUIStore((s) => s.setCameraMode);
  const setFollowAgentId = useUIStore((s) => s.setFollowAgentId);

  const selectedAgentId = useAgentStore((s) => s.selectedAgentId);

  // Simulation Clock Tick Loop
  useEffect(() => {
    // Immediately synchronize with real system time
    useWorldStore.getState().syncRealtimeClock();

    const interval = setInterval(() => {
      useWorldStore.getState().tick();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const speeds = [1, 2, 5, 10];

  const handleFollow = () => {
    if (cameraMode === 'follow') {
      setCameraMode('campus');
      setFollowAgentId(null);
    } else {
      setFollowAgentId(selectedAgentId || 'agent_bima');
      setCameraMode('follow');
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex items-center justify-center pointer-events-none px-4">
      <div className="glass-panel p-2 rounded-2xl flex items-center gap-1.5 shadow-2xl pointer-events-auto border border-white/15">
        {/* Play / Pause Button */}
        <button
          onClick={togglePause}
          className={`p-2.5 rounded-xl font-medium transition-all duration-150 cursor-pointer flex items-center justify-center ${
            isPaused
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
          }`}
          title={isPaused ? 'Resume Simulation [Space]' : 'Pause Simulation [Space]'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
        </button>

        <div className="h-5 w-px bg-white/10 mx-0.5" />

        {/* Realtime / Simulation Speeds */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleRealtimeMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 ${
              isRealtime
                ? 'bg-rose-500/30 text-rose-300 border border-rose-400/60 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Sinkronisasi Jam Realtime Asli"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isRealtime ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`} />
            <span>Realtime</span>
          </button>

          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer ${
                !isRealtime && speed === s && !isPaused
                  ? 'bg-indigo-600/90 text-white border border-indigo-400/50 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={`Simulasi kecepatan ${s}x`}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-white/10 mx-0.5" />

        {/* Day / Night Quick Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDayNightPreset('DAY')}
            className={`p-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              !isRealtime && (phase === 'NOON' || phase === 'MORNING' || phase === 'AFTERNOON')
                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Set Siang Hari Cerah (12:00)"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Siang</span>
          </button>

          <button
            onClick={() => setDayNightPreset('NIGHT')}
            className={`p-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              !isRealtime && (phase === 'NIGHT' || phase === 'EVENING' || phase === 'DAWN')
                ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Set Malam Hari Berlampu (20:00)"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Malam</span>
          </button>
        </div>

        <div className="h-5 w-px bg-white/10 mx-0.5" />

        {/* Follow Employee Mode Button */}
        <button
          onClick={handleFollow}
          className={`p-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            cameraMode === 'follow'
              ? 'bg-purple-600/40 text-purple-200 border border-purple-400/40'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Follow Employee Mode [Key: F]"
        >
          <UserCheck className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">Follow</span>
        </button>

        {/* Reset View Button */}
        <button
          onClick={() => {
            setActiveLocationView('overview');
            setCameraMode('campus');
            setFollowAgentId(null);
          }}
          className="p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Reset Camera to Overview [Key: R]"
        >
          <Compass className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Toggle 3D Labels */}
        <button
          onClick={toggleLabels}
          className={`p-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            showLabels
              ? 'text-emerald-300 hover:bg-white/10'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title={showLabels ? 'Hide Floating 3D Labels' : 'Show Floating 3D Labels'}
        >
          {showLabels ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
          <span className="hidden md:inline">{showLabels ? 'Labels' : 'Labels Off'}</span>
        </button>

        {/* Reset Day */}
        <button
          onClick={resetDay}
          className="p-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
          title="Reset World Clock to Monday 08:00"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
