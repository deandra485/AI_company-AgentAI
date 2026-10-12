'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/useUIStore';

export const LoadingScreen = () => {
  const isInitialized = useUIStore((s) => s.isInitialized);
  const setInitialized = useUIStore((s) => s.setInitialized);
  const [progress, setProgress] = useState(15);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(55), 350);
    const timer2 = setTimeout(() => setProgress(88), 750);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setFading(true);
      setTimeout(() => setInitialized(true), 600);
    }, 1150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setInitialized]);

  if (isInitialized) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090d16] text-white transition-opacity duration-700 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm text-center px-6">
        {/* Company Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-4xl shadow-glow mb-6 animate-pulse-glow">
          🏢
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black tracking-wider text-slate-100 uppercase mb-2">
          AI COMPANY
        </h1>

        <p className="text-sm font-medium text-indigo-300/90 mb-6">
          Initializing Virtual Office...
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/10 mb-4">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 font-mono tracking-wider">
          {progress < 40 && 'Generating campus geometry...'}
          {progress >= 40 && progress < 80 && 'Calibrating day/night lighting...'}
          {progress >= 80 && progress < 100 && 'Awakening AI employee agents...'}
          {progress === 100 && 'Ready'}
        </p>
      </div>
    </div>
  );
};
