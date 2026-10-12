import { create } from 'zustand';
import { LocationId } from '@ai-company/types';

interface UIState {
  showLabels: boolean;
  quality: 'low' | 'medium' | 'high';
  activeLocationView: LocationId | 'overview';
  isInitialized: boolean;
  showRosterPanel: boolean;
  showLogsPanel: boolean;
  cutawayMode: boolean;
  cameraMode: 'city' | 'campus' | 'office' | 'mosque' | 'follow';
  followAgentId: string | null;

  toggleLabels: () => void;
  setShowLabels: (show: boolean) => void;
  setQuality: (quality: 'low' | 'medium' | 'high') => void;
  setActiveLocationView: (view: LocationId | 'overview') => void;
  setInitialized: (initialized: boolean) => void;
  toggleRosterPanel: () => void;
  toggleLogsPanel: () => void;
  toggleCutawayMode: () => void;
  setCameraMode: (mode: 'city' | 'campus' | 'office' | 'mosque' | 'follow') => void;
  setFollowAgentId: (agentId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showLabels: true,
  quality: 'high',
  activeLocationView: 'overview',
  isInitialized: false,
  showRosterPanel: false, // Default minimized for city sim view
  showLogsPanel: false,
  cutawayMode: true, // Default open-roof so interiors are immediately visible
  cameraMode: 'campus',
  followAgentId: null,

  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  setShowLabels: (show) => set({ showLabels: show }),
  setQuality: (quality) => set({ quality }),
  setActiveLocationView: (view) => set({ activeLocationView: view }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  toggleRosterPanel: () => set((s) => ({ showRosterPanel: !s.showRosterPanel })),
  toggleLogsPanel: () => set((s) => ({ showLogsPanel: !s.showLogsPanel })),
  toggleCutawayMode: () => set((s) => ({ cutawayMode: !s.cutawayMode })),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setFollowAgentId: (agentId) => set({ followAgentId: agentId }),
}));
