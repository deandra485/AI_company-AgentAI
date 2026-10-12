export type AgentRole = 
  | 'manager' 
  | 'developer' 
  | 'designer' 
  | 'marketing' 
  | 'researcher' 
  | 'admin';

export type AgentStatus =
  | 'IDLE'
  | 'WORKING'
  | 'THINKING'
  | 'WALKING'
  | 'MEETING'
  | 'EATING'
  | 'DRINKING'
  | 'RESTING'
  | 'BREAK'
  | 'SWIMMING'
  | 'WUDU'
  | 'GOING_TO_PRAYER'
  | 'PRAYING'
  | 'RETURNING_TO_WORK'
  | 'CELEBRATING'
  | 'ERROR'
  | 'OFFLINE';

export type LocationId =
  | 'office'
  | 'manager_room'
  | 'meeting_room'
  | 'dev_area'
  | 'design_area'
  | 'marketing_area'
  | 'research_area'
  | 'admin_area'
  | 'mosque'
  | 'wudu_area'
  | 'prayer_hall'
  | 'cafeteria'
  | 'pool'
  | 'lounge'
  | 'garden';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  department: string;
  avatarColor: string;
  skills: string[];
  personality: {
    traits: string[];
    breakPreference: LocationId;
    beveragePreference: string;
  };
  status: AgentStatus;
  energy: number; // 0 - 100
  progress: number; // 0 - 100
  currentActivity: string;
  currentTaskTitle?: string;
  locationId: LocationId;
  position: [number, number, number];
  rotation: number;
  destination?: [number, number, number];
  deskPosition: [number, number, number];
}

export type TaskStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'PAUSED'
  | 'REVIEW'
  | 'COMPLETED'
  | 'FAILED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskInterruptibility = 'SAFE_TO_PAUSE' | 'NOT_SAFE_TO_PAUSE' | 'CRITICAL';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedAgentId?: string;
  progress: number;
  interruptibility: TaskInterruptibility;
  createdAt: string;
  updatedAt: string;
}

export type DayPhase = 'DAWN' | 'MORNING' | 'NOON' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export interface WorldClock {
  dayName: string;
  hour: number;
  minute: number;
  speed: number; // 0, 1, 2, 5, 10
  isPaused: boolean;
  phase: DayPhase;
}

export interface PrayerTimeSlot {
  name: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  time: string; // "12:15"
  hour: number;
  minute: number;
  durationMinutes: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  agentId?: string;
  agentName?: string;
  role?: AgentRole;
  message: string;
  icon?: string;
  type: 'routine' | 'task' | 'prayer' | 'social' | 'system';
}

export interface LocationInfo {
  id: LocationId;
  name: string;
  category: 'work' | 'worship' | 'dining' | 'recreation' | 'nature';
  position: [number, number, number];
  color: string;
  icon: string;
  description: string;
}
