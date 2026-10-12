import { create } from 'zustand';
import { DayPhase } from '@ai-company/types';

interface WorldState {
  dayName: string;
  hour: number;
  minute: number;
  second: number;
  speed: number;
  isPaused: boolean;
  phase: DayPhase;
  mode: 'SIMULATION' | 'LIVE_AI';
  isRealtime: boolean;

  // Actions
  tick: () => void;
  syncRealtimeClock: () => void;
  toggleRealtimeMode: () => void;
  setDayNightPreset: (preset: 'DAY' | 'NIGHT' | 'REALTIME' | 'MORNING' | 'AFTERNOON') => void;
  setHour: (hour: number) => void;
  setSpeed: (speed: number) => void;
  togglePause: () => void;
  resetDay: () => void;
  setMode: (mode: 'SIMULATION' | 'LIVE_AI') => void;
  calculatePhase: (hour: number) => DayPhase;
}

const getPhaseFromHour = (hour: number): DayPhase => {
  if (hour >= 4 && hour < 6) return 'DAWN';
  if (hour >= 6 && hour < 11) return 'MORNING';
  if (hour >= 11 && hour < 14) return 'NOON';
  if (hour >= 14 && hour < 17) return 'AFTERNOON';
  if (hour >= 17 && hour < 19) return 'EVENING';
  return 'NIGHT';
};

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Static initial state for deterministic SSR hydration
export const useWorldStore = create<WorldState>((set, get) => ({
  dayName: 'Senin',
  hour: 8,
  minute: 0,
  second: 0,
  speed: 1,
  isPaused: false,
  phase: 'MORNING',
  mode: 'LIVE_AI',
  isRealtime: true,

  calculatePhase: (hour: number) => getPhaseFromHour(hour),

  syncRealtimeClock: () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const currentDay = DAYS[now.getDay()];
    const currentPhase = getPhaseFromHour(currentHour);

    set({
      dayName: currentDay,
      hour: currentHour,
      minute: currentMinute,
      second: currentSecond,
      phase: currentPhase,
      isRealtime: true,
      mode: 'LIVE_AI',
      speed: 1,
      isPaused: false,
    });
  },

  toggleRealtimeMode: () => {
    const { isRealtime } = get();
    if (!isRealtime) {
      // Turn on Realtime
      get().syncRealtimeClock();
    } else {
      // Turn off Realtime, switch back to simulation
      set({
        isRealtime: false,
        mode: 'SIMULATION',
      });
    }
  },

  setDayNightPreset: (preset) => {
    if (preset === 'REALTIME') {
      get().syncRealtimeClock();
      return;
    }

    let targetHour = 12;
    let targetMinute = 0;
    if (preset === 'DAY') {
      targetHour = 12; // 12:00 Siang bolong cerah
    } else if (preset === 'NIGHT') {
      targetHour = 20; // 20:00 Malam hari elegan & lampu menyala
    } else if (preset === 'MORNING') {
      targetHour = 8; // 08:30 Pagi segar
      targetMinute = 30;
    } else if (preset === 'AFTERNOON') {
      targetHour = 16; // 16:30 Sore senja / golden hour
      targetMinute = 30;
    }

    set({
      hour: targetHour,
      minute: targetMinute,
      second: 0,
      phase: getPhaseFromHour(targetHour),
      isRealtime: false,
      mode: 'SIMULATION',
    });
  },

  setHour: (targetHour: number) => {
    const clampedHour = Math.max(0, Math.min(23, Math.floor(targetHour)));
    set({
      hour: clampedHour,
      minute: 0,
      second: 0,
      phase: getPhaseFromHour(clampedHour),
      isRealtime: false,
      mode: 'SIMULATION',
    });
  },

  tick: () => {
    const { isRealtime, hour, minute, second, speed, isPaused } = get();

    if (isRealtime) {
      // In Realtime mode, continuously lock with local system clock
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const currentDay = DAYS[now.getDay()];
      const currentPhase = getPhaseFromHour(currentHour);

      set({
        dayName: currentDay,
        hour: currentHour,
        minute: currentMinute,
        second: currentSecond,
        phase: currentPhase,
      });
      return;
    }

    if (isPaused || speed === 0) return;

    // Simulation advances speed seconds per real second
    let newSecond = second + speed;
    let newMinute = minute;
    let newHour = hour;

    if (newSecond >= 60) {
      const addedMinutes = Math.floor(newSecond / 60);
      newSecond = newSecond % 60;
      newMinute += addedMinutes;

      if (newMinute >= 60) {
        const addedHours = Math.floor(newMinute / 60);
        newMinute = newMinute % 60;
        newHour = (newHour + addedHours) % 24;
      }
    }

    const newPhase = getPhaseFromHour(newHour);

    set({
      second: newSecond,
      minute: newMinute,
      hour: newHour,
      phase: newPhase,
    });
  },

  setSpeed: (speed: number) =>
    set({
      speed,
      isPaused: speed === 0,
      isRealtime: false,
      mode: 'SIMULATION',
    }),

  togglePause: () =>
    set((state) => ({
      isPaused: !state.isPaused,
      isRealtime: false,
      mode: 'SIMULATION',
    })),

  resetDay: () => {
    set({
      dayName: 'Senin',
      hour: 8,
      minute: 0,
      second: 0,
      phase: 'MORNING',
      isPaused: false,
      speed: 1,
      isRealtime: false,
      mode: 'SIMULATION',
    });
  },

  setMode: (mode: 'SIMULATION' | 'LIVE_AI') =>
    set({
      mode,
      isRealtime: mode === 'LIVE_AI',
    }),
}));
