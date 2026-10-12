import { LocationInfo, PrayerTimeSlot, Agent, LocationId } from '@ai-company/types';

export const CAMPUS_LOCATIONS: Record<LocationId, LocationInfo> = {
  office: {
    id: 'office',
    name: 'Main Office',
    category: 'work',
    position: [0, 0, 10],
    color: '#3b82f6',
    icon: '🏢',
    description: 'Central modern workspace for company teams'
  },
  manager_room: {
    id: 'manager_room',
    name: 'Executive Office',
    category: 'work',
    position: [-10, 0, 14],
    color: '#8b5cf6',
    icon: '👨‍💼',
    description: 'CEO & Manager strategic room'
  },
  meeting_room: {
    id: 'meeting_room',
    name: 'Conference Room',
    category: 'work',
    position: [10, 0, 14],
    color: '#6366f1',
    icon: '🤝',
    description: 'Collaborative meeting and presentation space'
  },
  dev_area: {
    id: 'dev_area',
    name: 'Engineering Hub',
    category: 'work',
    position: [-8, 0, 7],
    color: '#06b6d4',
    icon: '💻',
    description: 'Full-stack software development workstation'
  },
  design_area: {
    id: 'design_area',
    name: 'Creative Studio',
    category: 'work',
    position: [-2, 0, 7],
    color: '#ec4899',
    icon: '🎨',
    description: 'UI/UX and visual design workspace'
  },
  marketing_area: {
    id: 'marketing_area',
    name: 'Growth & Marketing',
    category: 'work',
    position: [4, 0, 7],
    color: '#f59e0b',
    icon: '📣',
    description: 'Campaigns, social and content workspace'
  },
  research_area: {
    id: 'research_area',
    name: 'Intelligence Lab',
    category: 'work',
    position: [10, 0, 7],
    color: '#10b981',
    icon: '🔬',
    description: 'Deep market & technology research area'
  },
  admin_area: {
    id: 'admin_area',
    name: 'Operations & Admin',
    category: 'work',
    position: [0, 0, 2],
    color: '#64748b',
    icon: '📋',
    description: 'Office coordination and administrative desk'
  },
  mosque: {
    id: 'mosque',
    name: 'Campus Mosque',
    category: 'worship',
    position: [0, 0, -22],
    color: '#10b981',
    icon: '🕌',
    description: 'Respectful prayer hall, courtyard and wudu area'
  },
  wudu_area: {
    id: 'wudu_area',
    name: 'Wudu Station',
    category: 'worship',
    position: [-5, 0, -18],
    color: '#38bdf8',
    icon: '💧',
    description: 'Ablution purification area before prayer'
  },
  prayer_hall: {
    id: 'prayer_hall',
    name: 'Prayer Hall',
    category: 'worship',
    position: [0, 0, -24],
    color: '#059669',
    icon: '🕋',
    description: 'Peaceful prayer hall with carpeted rows facing Qibla'
  },
  cafeteria: {
    id: 'cafeteria',
    name: 'Cafeteria & Bistro',
    category: 'dining',
    position: [-22, 0, 10],
    color: '#f97316',
    icon: '🍜',
    description: 'Delicious hot meals, drinks and dining tables'
  },
  pool: {
    id: 'pool',
    name: 'Swimming Pool',
    category: 'recreation',
    position: [22, 0, -18],
    color: '#0ea5e9',
    icon: '🏊',
    description: 'Outdoor recreation pool with sun loungers'
  },
  lounge: {
    id: 'lounge',
    name: 'Coffee Lounge',
    category: 'recreation',
    position: [22, 0, 10],
    color: '#a855f7',
    icon: '☕',
    description: 'Relaxation sofas, espresso bar, and casual chats'
  },
  garden: {
    id: 'garden',
    name: 'Botanical Garden',
    category: 'nature',
    position: [-22, 0, -18],
    color: '#22c55e',
    icon: '🌳',
    description: 'Peaceful green space with trees, paths and benches'
  }
};

export const DEFAULT_PRAYER_SCHEDULE: PrayerTimeSlot[] = [
  { name: 'Fajr', time: '04:45', hour: 4, minute: 45, durationMinutes: 20 },
  { name: 'Dhuhr', time: '12:05', hour: 12, minute: 5, durationMinutes: 30 },
  { name: 'Asr', time: '15:15', hour: 15, minute: 15, durationMinutes: 25 },
  { name: 'Maghrib', time: '18:00', hour: 18, minute: 0, durationMinutes: 20 },
  { name: 'Isha', time: '19:15', hour: 19, minute: 15, durationMinutes: 25 }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent_arya',
    name: 'Arya Pratama',
    role: 'manager',
    department: 'Management',
    avatarColor: '#8b5cf6',
    skills: ['Strategic Planning', 'Orchestration', 'Task Review', 'Team Coordination'],
    personality: {
      traits: ['Visionary', 'Organized', 'Calm'],
      breakPreference: 'lounge',
      beveragePreference: 'Espresso'
    },
    status: 'WORKING',
    energy: 95,
    progress: 78,
    currentActivity: 'Orchestrating company sprint backlog',
    currentTaskTitle: 'Q4 Product Roadmap Alignment',
    locationId: 'manager_room',
    position: [-10, 0, 14],
    rotation: 0,
    deskPosition: [-10, 0, 14]
  },
  {
    id: 'agent_bima',
    name: 'Bima Satria',
    role: 'developer',
    department: 'Engineering',
    avatarColor: '#06b6d4',
    skills: ['TypeScript', 'React / Next.js', 'Node.js', 'OpenCode CLI', 'Debugging'],
    personality: {
      traits: ['Analytical', 'Quiet', 'Focused'],
      breakPreference: 'lounge',
      beveragePreference: 'Cold Brew'
    },
    status: 'WORKING',
    energy: 88,
    progress: 65,
    currentActivity: 'Compiling 3D world WebGL shader pipeline',
    currentTaskTitle: 'Virtual Office Engine Integration',
    locationId: 'dev_area',
    position: [-8, 0, 7],
    rotation: 0,
    deskPosition: [-8, 0, 7]
  },
  {
    id: 'agent_maya',
    name: 'Maya Lestari',
    role: 'designer',
    department: 'Design & Creative',
    avatarColor: '#ec4899',
    skills: ['UI/UX Design', '3D Aesthetics', 'Design Systems', 'Micro-interactions'],
    personality: {
      traits: ['Creative', 'Empathetic', 'Vibrant'],
      breakPreference: 'cafeteria',
      beveragePreference: 'Matcha Latte'
    },
    status: 'WORKING',
    energy: 92,
    progress: 82,
    currentActivity: 'Refining glassmorphic HUD overlay and lighting',
    currentTaskTitle: 'Command Center Design Specs',
    locationId: 'design_area',
    position: [-2, 0, 7],
    rotation: 0,
    deskPosition: [-2, 0, 7]
  },
  {
    id: 'agent_ryan',
    name: 'Ryan Hidayat',
    role: 'marketing',
    department: 'Growth & Marketing',
    avatarColor: '#f59e0b',
    skills: ['Growth Strategy', 'SEO', 'Content Marketing', 'Community Engagement'],
    personality: {
      traits: ['Enthusiastic', 'Social', 'Persuasive'],
      breakPreference: 'garden',
      beveragePreference: 'Iced Lemon Tea'
    },
    status: 'WORKING',
    energy: 84,
    progress: 70,
    currentActivity: 'Drafting launch campaign & developer docs',
    currentTaskTitle: 'Autonomous AI Company Launch Plan',
    locationId: 'marketing_area',
    position: [4, 0, 7],
    rotation: 0,
    deskPosition: [4, 0, 7]
  },
  {
    id: 'agent_sarah',
    name: 'Sarah Wijaya',
    role: 'researcher',
    department: 'Intelligence & Research',
    avatarColor: '#10b981',
    skills: ['Market Intelligence', 'LLM Benchmarking', 'Data Synthesis', 'Documentation'],
    personality: {
      traits: ['Curious', 'Methodical', 'Reflective'],
      breakPreference: 'garden',
      beveragePreference: 'Earl Grey'
    },
    status: 'WORKING',
    energy: 90,
    progress: 75,
    currentActivity: 'Evaluating multi-agent orchestration frameworks',
    currentTaskTitle: 'Autonomous Agent Performance Benchmarking',
    locationId: 'research_area',
    position: [10, 0, 7],
    rotation: 0,
    deskPosition: [10, 0, 7]
  },
  {
    id: 'agent_dika',
    name: 'Dika Nugraha',
    role: 'admin',
    department: 'Operations & Admin',
    avatarColor: '#64748b',
    skills: ['Workflow Automation', 'Scheduling', 'Resource Tracking', 'Logging'],
    personality: {
      traits: ['Thorough', 'Reliable', 'Active'],
      breakPreference: 'pool',
      beveragePreference: 'Mineral Water'
    },
    status: 'WORKING',
    energy: 94,
    progress: 90,
    currentActivity: 'Syncing schedule, prayer events, and world logs',
    currentTaskTitle: 'Company Routine Audit',
    locationId: 'admin_area',
    position: [0, 0, 2],
    rotation: 0,
    deskPosition: [0, 0, 2]
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'log_1',
    timestamp: '08:00',
    agentName: 'Arya Pratama',
    role: 'manager' as const,
    message: 'Opened virtual company headquarters and initiated daily standup',
    type: 'system' as const,
    icon: '🏢'
  },
  {
    id: 'log_2',
    timestamp: '08:05',
    agentName: 'Bima Satria',
    role: 'developer' as const,
    message: 'Started task: Virtual Office Engine Integration',
    type: 'task' as const,
    icon: '💻'
  },
  {
    id: 'log_3',
    timestamp: '08:08',
    agentName: 'Maya Lestari',
    role: 'designer' as const,
    message: 'Finalized visual tokens for glassmorphism UI overlay',
    type: 'task' as const,
    icon: '🎨'
  },
  {
    id: 'log_4',
    timestamp: '08:15',
    agentName: 'Dika Nugraha',
    role: 'admin' as const,
    message: 'Synchronized prayer schedule with local timezone (Asia/Jakarta)',
    type: 'routine' as const,
    icon: '🕌'
  }
];
