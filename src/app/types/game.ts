export type Skin = 'finance' | 'energy';
export type BuildingStatus = 'completed' | 'inprogress' | 'locked';

export interface Building {
  id: number;
  name: string;
  subtitle: string;
  emoji: string;
  position: { x: number; y: number };
  status: BuildingStatus;
  stars: number;
  level: number;
  script: string;
  tags: {
    emotion: string;
    emotionType: 'angry' | 'anxious' | 'neutral';
    riskLevel: 'high' | 'medium' | 'low';
  };
  goals: string[];
  radar: number[]; // [revenue, risk, compliance, experience, efficiency]
  size: 'sm' | 'md' | 'lg';
  unlockReq?: string;
}

export interface TaskCard {
  id: number;
  type: 'revenue' | 'compliance' | 'pressure';
  title: string;
  subtitle: string;
  difficulty: number;
  xp: number;
  duration: string;
  tag: string;
}

export interface EventAlert {
  id: number;
  position: { x: number; y: number };
  title: string;
  description: string;
  deadline: string;
  type: 'regulatory' | 'emergency';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  level: string;
  score: number;
  isMe?: boolean;
  trend: 'up' | 'down' | 'same';
}

export interface SkinConfig {
  bg: string;
  bgSecondary: string;
  accent: string;
  accentRgb: string;
  accentDim: string;
  panelBg: string;
  panelBorder: string;
  textPrimary: string;
  textSecondary: string;
  mapName: string;
  metricLabel: string;
  metricValue: number;
  gradientFrom: string;
  gradientTo: string;
  buildingColors: string[];
  completedGlow: string;
  pathColor: string;
}
