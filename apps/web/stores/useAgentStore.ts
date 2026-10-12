import { create } from 'zustand';
import { Agent, ActivityLogEntry } from '@ai-company/types';
import { INITIAL_AGENTS, INITIAL_ACTIVITY_LOGS } from '@ai-company/shared';

interface AgentState {
  agents: Agent[];
  selectedAgentId: string | null;
  activityLogs: ActivityLogEntry[];
  livePositions: Record<string, [number, number, number]>;

  selectAgent: (agentId: string | null) => void;
  updateAgent: (agentId: string, partial: Partial<Agent>) => void;
  addActivityLog: (log: Omit<ActivityLogEntry, 'id'>) => void;
  setLivePosition: (agentId: string, pos: [number, number, number]) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: INITIAL_AGENTS,
  selectedAgentId: null,
  activityLogs: INITIAL_ACTIVITY_LOGS,
  livePositions: INITIAL_AGENTS.reduce((acc, a) => {
    acc[a.id] = a.deskPosition;
    return acc;
  }, {} as Record<string, [number, number, number]>),

  selectAgent: (agentId) => set({ selectedAgentId: agentId }),

  updateAgent: (agentId, partial) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, ...partial } : agent
      ),
    })),

  setLivePosition: (agentId, pos) =>
    set((state) => ({
      livePositions: { ...state.livePositions, [agentId]: pos },
    })),

  addActivityLog: (log) =>
    set((state) => ({
      activityLogs: [
        {
          ...log,
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        },
        ...state.activityLogs.slice(0, 49), // Keep 50 recent logs
      ],
    })),
}));
