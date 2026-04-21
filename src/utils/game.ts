export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  streak: number;
  totalWorkouts: number;
  hunterRank: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'rest';
  xpReward: number;
  goldReward: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  target: number;
  unlocked: boolean;
  xpReward: number;
  goldReward: number;
}

export const XP_PER_LEVEL = 15000;

export const HUNTER_RANKS = [
  { rank: 'E', minLevel: 1, title: 'E-Rank Hunter' },
  { rank: 'D', minLevel: 5, title: 'D-Rank Hunter' },
  { rank: 'C', minLevel: 10, title: 'C-Rank Hunter' },
  { rank: 'B', minLevel: 20, title: 'B-Rank Hunter' },
  { rank: 'A', minLevel: 35, title: 'A-Rank Hunter' },
  { rank: 'S', minLevel: 50, title: 'S-Rank Hunter' },
];

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function calculateXPProgress(xp: number): { level: number; currentXP: number; neededXP: number; percentage: number } {
  const level = calculateLevel(xp);
  const currentLevelXP = xp % XP_PER_LEVEL;
  return {
    level,
    currentXP: currentLevelXP,
    neededXP: XP_PER_LEVEL,
    percentage: (currentLevelXP / XP_PER_LEVEL) * 100,
  };
}

export function getHunterRank(level: number): { rank: string; title: string } {
  const currentRank = HUNTER_RANKS.slice().reverse().find(r => level >= r.minLevel);
  return currentRank || { rank: 'E', title: 'E-Rank Hunter' };
}

export function calculateStreak(lastWorkoutDate: Date | null): number {
  if (!lastWorkoutDate) return 0;
  
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return 0;
  return diffDays === 0 ? 0 : 1;
}

export const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'push-day',
    title: 'Push Day Attack',
    description: 'Complete 3 push exercises',
    type: 'main',
    xpReward: 50,
    goldReward: 15,
    progress: 0,
    target: 3,
    completed: false,
  },
  {
    id: 'pull-day',
    title: 'Pull Day Assault',
    description: 'Complete 3 pull exercises',
    type: 'main',
    xpReward: 50,
    goldReward: 15,
    progress: 0,
    target: 3,
    completed: false,
  },
  {
    id: 'streak',
    title: 'Streak Keeper',
    description: 'Log any workout today',
    type: 'side',
    xpReward: 25,
    goldReward: 5,
    progress: 0,
    target: 1,
    completed: false,
  },
  {
    id: 'rest',
    title: 'Recovery Day',
    description: 'Take a complete rest',
    type: 'rest',
    xpReward: 15,
    goldReward: 5,
    progress: 0,
    target: 1,
    completed: false,
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    name: 'First Blood',
    description: 'Complete your first workout',
    icon: 'swords',
    tier: 'bronze',
    progress: 0,
    target: 1,
    unlocked: false,
    xpReward: 100,
    goldReward: 25,
  },
  {
    id: 'streak-7',
    name: '7-Day Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    tier: 'bronze',
    progress: 0,
    target: 7,
    unlocked: false,
    xpReward: 250,
    goldReward: 50,
  },
  {
    id: 'streak-30',
    name: '30-Day Slayer',
    description: 'Maintain a 30-day streak',
    icon: 'flame',
    tier: 'silver',
    progress: 0,
    target: 30,
    unlocked: false,
    xpReward: 500,
    goldReward: 100,
  },
  {
    id: 'streak-100',
    name: '100-Day Monster',
    description: 'Maintain a 100-day streak',
    icon: 'crown',
    tier: 'platinum',
    progress: 0,
    target: 100,
    unlocked: false,
    xpReward: 2000,
    goldReward: 500,
  },
  {
    id: 'chest-20',
    name: 'Chest Initiate',
    description: 'Complete 20 chest exercises',
    icon: 'shield',
    tier: 'bronze',
    progress: 0,
    target: 20,
    unlocked: false,
    xpReward: 150,
    goldReward: 30,
  },
  {
    id: 'chest-50',
    name: 'Chest Knight',
    description: 'Complete 50 chest exercises',
    icon: 'shield',
    tier: 'silver',
    progress: 0,
    target: 50,
    unlocked: false,
    xpReward: 300,
    goldReward: 75,
  },
  {
    id: 'back-20',
    name: 'Back Initiate',
    description: 'Complete 20 back exercises',
    icon: 'shield',
    tier: 'bronze',
    progress: 0,
    target: 20,
    unlocked: false,
    xpReward: 150,
    goldReward: 30,
  },
  {
    id: 'legs-20',
    name: 'Legs Initiate',
    description: 'Complete 20 leg exercises',
    icon: 'shield',
    tier: 'bronze',
    progress: 0,
    target: 20,
    unlocked: false,
    xpReward: 150,
    goldReward: 30,
  },
  {
    id: 'total-10',
    name: 'Apprentice Hunter',
    description: 'Complete 10 workouts',
    icon: 'star',
    tier: 'bronze',
    progress: 0,
    target: 10,
    unlocked: false,
    xpReward: 200,
    goldReward: 50,
  },
  {
    id: 'total-50',
    name: 'Elite Hunter',
    description: 'Complete 50 workouts',
    icon: 'star',
    tier: 'gold',
    progress: 0,
    target: 50,
    unlocked: false,
    xpReward: 750,
    goldReward: 200,
  },
  {
    id: 'total-100',
    name: 'Shadow Monarch',
    description: 'Complete 100 workouts',
    icon: 'crown',
    tier: 'platinum',
    progress: 0,
    target: 100,
    unlocked: false,
    xpReward: 2500,
    goldReward: 750,
  },
];

export const XP_REWARDS = {
  perSet: 10,
  perRep: 2,
  workoutComplete: 50,
  questComplete: 25,
  streakBonus: 5,
};

export const ENERGY = {
  max: 100,
  workoutCost: 25,
  restRecovery: 20,
};
