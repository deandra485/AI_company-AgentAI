import { create } from 'zustand';

export interface Jobdesk {
  id: string;
  agentId: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number; // 0 to 100
  durationSec: number;
  elapsedSec: number;
  currentSubStep: string;
  createdAt: number;
  completedAt?: number;
}

interface JobdeskState {
  jobdesks: Jobdesk[];
  isModalOpen: boolean;
  selectedAgentIdForModal: string | null;

  openModal: (agentId?: string) => void;
  closeModal: () => void;
  assignJobdesk: (data: {
    agentId: string;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    durationSec: number;
  }) => string;
  updateJobdeskProgress: (id: string, progress: number, subStep: string) => void;
  completeJobdesk: (id: string) => void;
}

const INITIAL_JOBDESKS: Jobdesk[] = [
  {
    id: 'job_init_1',
    agentId: 'agent_bima',
    title: 'Refactor Auth Middleware & JWT Session',
    description: 'Optimize token validation and add redis session caching',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    progress: 42,
    durationSec: 45,
    elapsedSec: 18,
    currentSubStep: 'Writing token verification tests',
    createdAt: Date.now() - 60000,
  },
  {
    id: 'job_init_2',
    agentId: 'agent_maya',
    title: 'Desain 3D Component Tokens & Dark Mode',
    description: 'Create responsive design tokens for 3D UI HUD overlays',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    progress: 68,
    durationSec: 40,
    elapsedSec: 26,
    currentSubStep: 'Exporting Figma design specs',
    createdAt: Date.now() - 45000,
  },
];

export const useJobdeskStore = create<JobdeskState>((set, get) => ({
  jobdesks: INITIAL_JOBDESKS,
  isModalOpen: false,
  selectedAgentIdForModal: null,

  openModal: (agentId) =>
    set({
      isModalOpen: true,
      selectedAgentIdForModal: agentId || null,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedAgentIdForModal: null,
    }),

  assignJobdesk: ({ agentId, title, description, priority, durationSec }) => {
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newJob: Jobdesk = {
      id,
      agentId,
      title,
      description,
      priority,
      status: 'IN_PROGRESS',
      progress: 0,
      durationSec: Math.max(durationSec, 10),
      elapsedSec: 0,
      currentSubStep: 'Inisialisasi requirement...',
      createdAt: Date.now(),
    };

    set((state) => ({
      // Mark any prior in_progress task of this agent as queued
      jobdesks: [
        newJob,
        ...state.jobdesks.map((j) =>
          j.agentId === agentId && j.status === 'IN_PROGRESS'
            ? { ...j, status: 'QUEUED' as const }
            : j
        ),
      ],
      isModalOpen: false,
    }));

    return id;
  },

  updateJobdeskProgress: (id, progress, subStep) => {
    set((state) => ({
      jobdesks: state.jobdesks.map((j) =>
        j.id === id ? { ...j, progress: Math.min(progress, 100), currentSubStep: subStep } : j
      ),
    }));
  },

  completeJobdesk: (id) => {
    set((state) => ({
      jobdesks: state.jobdesks.map((j) =>
        j.id === id
          ? {
              ...j,
              progress: 100,
              status: 'COMPLETED' as const,
              currentSubStep: 'Pekerjaan Selesai! 🎉',
              completedAt: Date.now(),
            }
          : j
      ),
    }));
  },
}));
