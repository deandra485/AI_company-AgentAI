'use client';

import { useWorldStore } from '@/stores/useWorldStore';
import { useUIStore } from '@/stores/useUIStore';
import { useAgentStore } from '@/stores/useAgentStore';
import { useJobdeskStore } from '@/stores/useJobdeskStore';
import { LocationId } from '@ai-company/types';
import {
  Sun,
  Moon,
  Clock,
  Sunrise,
  Sunset,
  UserCheck,
  Layers,
  HelpCircle,
  Briefcase,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const dayName = useWorldStore((s) => s.dayName);
  const hour = useWorldStore((s) => s.hour);
  const minute = useWorldStore((s) => s.minute);
  const second = useWorldStore((s) => s.second);
  const phase = useWorldStore((s) => s.phase);
  const isRealtime = useWorldStore((s) => s.isRealtime);
  const toggleRealtimeMode = useWorldStore((s) => s.toggleRealtimeMode);
  const setDayNightPreset = useWorldStore((s) => s.setDayNightPreset);

  const quality = useUIStore((s) => s.quality);
  const setQuality = useUIStore((s) => s.setQuality);
  const activeLocationView = useUIStore((s) => s.activeLocationView);
  const setActiveLocationView = useUIStore((s) => s.setActiveLocationView);
  const cutawayMode = useUIStore((s) => s.cutawayMode);
  const toggleCutawayMode = useUIStore((s) => s.toggleCutawayMode);
  const cameraMode = useUIStore((s) => s.cameraMode);
  const setCameraMode = useUIStore((s) => s.setCameraMode);
  const followAgentId = useUIStore((s) => s.followAgentId);
  const setFollowAgentId = useUIStore((s) => s.setFollowAgentId);

  const agents = useAgentStore((s) => s.agents);
  const selectedAgentId = useAgentStore((s) => s.selectedAgentId);
  const openJobdeskModal = useJobdeskStore((s) => s.openModal);

  const [showHelp, setShowHelp] = useState(false);

  const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

  const followedAgent = agents.find((a) => a.id === (followAgentId || selectedAgentId));

  const renderPhaseIcon = () => {
    switch (phase) {
      case 'DAWN':
        return <Sunrise className="w-3.5 h-3.5 text-purple-400" />;
      case 'MORNING':
        return <Sun className="w-3.5 h-3.5 text-amber-300" />;
      case 'NOON':
        return <Sun className="w-3.5 h-3.5 text-yellow-400" />;
      case 'AFTERNOON':
        return <Sun className="w-3.5 h-3.5 text-orange-400" />;
      case 'EVENING':
        return <Sunset className="w-3.5 h-3.5 text-rose-400" />;
      case 'NIGHT':
      default:
        return <Moon className="w-3.5 h-3.5 text-indigo-300" />;
    }
  };

  const navItems: { id: LocationId | 'overview'; label: string; icon: string }[] = [
    { id: 'overview', label: 'City Overview', icon: '🌐' },
    { id: 'office', label: 'Office', icon: '🏢' },
    { id: 'mosque', label: 'Mosque', icon: '🕌' },
    { id: 'cafeteria', label: 'Cafeteria', icon: '🍜' },
    { id: 'pool', label: 'Pool', icon: '🏊' },
    { id: 'lounge', label: 'Lounge', icon: '☕' },
    { id: 'garden', label: 'Garden', icon: '🌳' },
  ];

  const handleFollowToggle = () => {
    if (cameraMode === 'follow') {
      setCameraMode('campus');
      setFollowAgentId(null);
    } else {
      const targetId = selectedAgentId || 'agent_bima';
      setFollowAgentId(targetId);
      setCameraMode('follow');
    }
  };

  return (
    <header className="fixed top-3 inset-x-3 z-40 flex flex-col md:flex-row items-center justify-between gap-2.5 pointer-events-none">
      {/* Left: Brand, Mode Switch & Action Buttons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-3 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏙️</span>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest text-slate-100 uppercase">
                AI CITY SIMULATOR
              </span>
              <span className="text-[10px] text-cyan-300 font-medium">Living Virtual Company</span>
            </div>
          </div>

          <div className="h-5 w-px bg-white/10" />

          {/* Realtime / Simulation Mode Toggle Button */}
          <button
            onClick={toggleRealtimeMode}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isRealtime
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20 hover:bg-rose-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
            }`}
            title="Klik untuk berpindah antara Jam Realtime (Waktu Asli) atau Simulasi Cepat"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isRealtime ? 'bg-rose-500 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span>{isRealtime ? '🔴 REALTIME' : '⚡ SIMULASI'}</span>
          </button>

          {/* + Beri Jobdesk AI Button */}
          <button
            onClick={() => openJobdeskModal()}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Beri Jobdesk / Tugas Baru ke Karyawan AI"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>+ Beri Jobdesk</span>
          </button>

          {/* Cutaway Toggle */}
          <button
            onClick={toggleCutawayMode}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              cutawayMode
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40 shadow-sm'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Cutaway / Open-Roof View"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Cutaway: {cutawayMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Follow Employee Button */}
          <button
            onClick={handleFollowToggle}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              cameraMode === 'follow'
                ? 'bg-purple-600/30 text-purple-200 border-purple-400/50 shadow-sm'
                : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
            }`}
            title="Follow Employee Mode [Key: F]"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {cameraMode === 'follow' && followedAgent
                ? `Following ${followedAgent.name.split(' ')[0]}`
                : 'Follow [F]'}
            </span>
          </button>
        </div>
      </div>

      {/* Center: Dynamic World Clock & Day/Night Mode Switcher */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div
          suppressHydrationWarning
          className="glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-glow border border-white/15"
        >
          <div className="flex items-center gap-1.5" suppressHydrationWarning>
            {renderPhaseIcon()}
            <span
              suppressHydrationWarning
              className="text-xs font-semibold text-slate-200 tracking-wide"
            >
              {mounted ? dayName : 'Senin'}
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isRealtime ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
              title={isRealtime ? 'Tersinkronisasi Jam Realtime' : 'Mode Simulasi'}
            />
            <div
              suppressHydrationWarning
              className="flex items-baseline gap-1.5 font-mono"
            >
              <span
                suppressHydrationWarning
                className="text-base font-extrabold text-white tracking-widest"
              >
                {mounted ? formattedTime : '08:00:00'}
              </span>
              <span className="text-[10px] font-bold text-cyan-300">WIB</span>
              <span
                suppressHydrationWarning
                className="text-[10px] font-semibold text-indigo-300/80 uppercase"
              >
                {mounted ? phase : 'MORNING'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Day / Night / Realtime Selector Pill */}
        <div className="glass-panel p-1 rounded-2xl flex items-center gap-1 border border-white/15">
          <button
            onClick={() => setDayNightPreset('DAY')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isRealtime && (phase === 'NOON' || phase === 'MORNING' || phase === 'AFTERNOON')
                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Ubah Waktu ke Siang Hari Cerah (12:00 WIB)"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Siang</span>
          </button>

          <button
            onClick={() => setDayNightPreset('NIGHT')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isRealtime && (phase === 'NIGHT' || phase === 'EVENING' || phase === 'DAWN')
                ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-400/50 shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Ubah Waktu ke Malam Hari Berlampu (20:00 WIB)"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Malam</span>
          </button>

          <button
            onClick={() => setDayNightPreset('REALTIME')}
            className={`px-2 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isRealtime
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Sinkronkan Otomatis dengan Jam Asli Komputer Anda"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Auto</span>
          </button>
        </div>
      </div>

      {/* Right: Navigation & Controls */}
      <div className="flex items-center gap-2 pointer-events-auto overflow-x-auto max-w-full pb-1 md:pb-0">
        {/* Quick Location Shortcuts */}
        <div className="glass-panel p-1 rounded-2xl flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveLocationView(item.id);
                if (cameraMode === 'follow') {
                  setCameraMode('campus');
                  setFollowAgentId(null);
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                activeLocationView === item.id && cameraMode !== 'follow'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
            >
              <span>{item.icon}</span>
              <span className="hidden xl:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Controls Help Modal Trigger */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="glass-panel p-2 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Controls Guide"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Quality Selector */}
        <div className="hidden lg:flex glass-panel p-1 rounded-2xl items-center gap-0.5 text-[11px] font-semibold text-slate-300">
          {(['low', 'medium', 'high'] as const).map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className={`px-2 py-1 rounded-xl uppercase transition-all duration-150 cursor-pointer ${
                quality === q ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-slate-400'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Quick RTS Help Overlay */}
      {showHelp && (
        <div className="fixed top-16 right-4 z-50 glass-panel p-4 rounded-2xl border border-white/20 shadow-2xl text-xs max-w-xs pointer-events-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 font-bold text-white">
            <span>🎮 SIMULATOR CONTROLS</span>
            <button
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-cyan-300 font-mono font-bold">W A S D</span>
              <span>Pan Camera</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-300 font-mono font-bold">Q / E</span>
              <span>Rotate View</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-300 font-mono font-bold">F</span>
              <span>Follow Employee</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-300 font-mono font-bold">R</span>
              <span>Reset Overview</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-300 font-mono font-bold">Scroll Wheel</span>
              <span>Zoom In / Out</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-300 font-mono font-bold">Right Click Drag</span>
              <span>Orbit Camera</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-300 font-mono font-bold">Double Click</span>
              <span>Inspect Character</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
