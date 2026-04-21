'use client'

import { createClient } from './client'
import type { UserProgress, Quest, Achievement } from '../game'

const XP_PER_LEVEL = 15000
const MAX_ENERGY = 100
const ENERGY_RESTORE_AMOUNT = 20

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null

  return {
    level: data.level,
    xp: data.xp,
    xpToNextLevel: XP_PER_LEVEL,
    gold: data.gold,
    streak: data.streak,
    totalWorkouts: data.total_workouts,
    hunterRank: data.hunter_rank,
  }
}

export async function updateUserProgress(
  userId: string,
  updates: Partial<Pick<UserProgress, 'xp' | 'gold' | 'level' | 'streak'>>
): Promise<void> {
  const supabase = createClient()
  const updateData: Record<string, unknown> = {}

  if (updates.xp !== undefined) updateData.xp = updates.xp
  if (updates.gold !== undefined) updateData.gold = updates.gold
  if (updates.level !== undefined) updateData.level = updates.level
  if (updates.streak !== undefined) updateData.streak = updates.streak
  if (updates.xp !== undefined) {
    const newLevel = Math.floor(updates.xp / XP_PER_LEVEL) + 1
    updateData.level = newLevel
  }

  const { error } = await supabase
    .from('user_progress')
    .update(updateData)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

export async function getDailyQuests(userId: string, date: string): Promise<Quest[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('daily_quests')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)

  if (error || !data) return []

  return data.map((q: Record<string, unknown>) => ({
    id: q.id as string,
    title: q.title as string,
    description: q.description as string,
    type: q.type as 'main' | 'side' | 'rest',
    xpReward: q.xp_reward as number,
    goldReward: q.gold_reward as number,
    progress: q.progress as number,
    target: q.target as number,
    completed: q.completed as boolean,
  }))
}

export async function updateQuestProgress(
  userId: string,
  questId: string,
  progress: number
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('daily_quests')
    .update({ progress })
    .eq('user_id', userId)
    .eq('id', questId)

  if (error) throw new Error(error.message)
}

export async function claimQuestReward(
  userId: string,
  questId: string
): Promise<{ xpReward: number; goldReward: number }> {
  const supabase = createClient()

  const { data: quest, error: questError } = await supabase
    .from('daily_quests')
    .select('*')
    .eq('user_id', userId)
    .eq('id', questId)
    .single()

  if (questError || !quest) throw new Error('Quest not found')

  const { xp_reward: xpReward, gold_reward: goldReward } = quest

  await supabase
    .from('daily_quests')
    .update({ completed: true })
    .eq('user_id', userId)
    .eq('id', questId)

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (progress) {
    await supabase
      .from('user_progress')
      .update({
        xp: (progress.xp || 0) + xpReward,
        gold: (progress.gold || 0) + goldReward,
      })
      .eq('user_id', userId)
  }

  return { xpReward, goldReward }
}

export async function resetDailyQuests(userId: string): Promise<void> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const defaultQuests = [
    {
      id: 'push-day',
      title: 'Push Day Attack',
      description: 'Complete 3 push exercises',
      type: 'main',
      xp_reward: 50,
      gold_reward: 15,
      progress: 0,
      target: 3,
      completed: false,
    },
    {
      id: 'pull-day',
      title: 'Pull Day Assault',
      description: 'Complete 3 pull exercises',
      type: 'main',
      xp_reward: 50,
      gold_reward: 15,
      progress: 0,
      target: 3,
      completed: false,
    },
    {
      id: 'streak',
      title: 'Streak Keeper',
      description: 'Log any workout today',
      type: 'side',
      xp_reward: 25,
      gold_reward: 5,
      progress: 0,
      target: 1,
      completed: false,
    },
    {
      id: 'rest',
      title: 'Recovery Day',
      description: 'Take a complete rest',
      type: 'rest',
      xp_reward: 15,
      gold_reward: 5,
      progress: 0,
      target: 1,
      completed: false,
    },
  ]

  for (const quest of defaultQuests) {
    await supabase.from('daily_quests').upsert({
      user_id: userId,
      date: today,
      ...quest,
    })
  }
}

export async function getAchievements(userId: string): Promise<Achievement[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)

  if (error || !data) return []

  return data.map((a: Record<string, unknown>) => ({
    id: a.achievement_id as string,
    name: a.name as string,
    description: a.description as string,
    icon: a.icon as string,
    tier: a.tier as 'bronze' | 'silver' | 'gold' | 'platinum',
    progress: a.progress as number,
    target: a.target as number,
    unlocked: a.unlocked as boolean,
    xpReward: a.xp_reward as number,
    goldReward: a.gold_reward as number,
  }))
}

export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_achievements')
    .update({ progress })
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)

  if (error) throw new Error(error.message)
}

export async function unlockAchievement(
  userId: string,
  achievementId: string
): Promise<{ xpReward: number; goldReward: number } | null> {
  const supabase = createClient()

  const { data: achievement, error: achError } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .single()

  if (achError || !achievement) return null

  if (achievement.unlocked) return null

  const { xp_reward: xpReward, gold_reward: goldReward } = achievement

  await supabase
    .from('user_achievements')
    .update({ unlocked: true })
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (progress) {
    await supabase
      .from('user_progress')
      .update({
        xp: (progress.xp || 0) + xpReward,
        gold: (progress.gold || 0) + goldReward,
      })
      .eq('user_id', userId)
  }

  return { xpReward, goldReward }
}

export async function getEnergy(userId: string): Promise<number> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_progress')
    .select('energy')
    .eq('user_id', userId)
    .single()

  if (error || !data) return MAX_ENERGY
  return data.energy ?? MAX_ENERGY
}

export async function useEnergy(userId: string, amount: number): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('user_progress')
    .select('energy')
    .eq('user_id', userId)
    .single()

  const currentEnergy = data?.energy ?? MAX_ENERGY

  if (currentEnergy < amount) return false

  await supabase
    .from('user_progress')
    .update({ energy: currentEnergy - amount })
    .eq('user_id', userId)

  return true
}

export async function restoreEnergy(userId: string): Promise<void> {
  const supabase = createClient()
  const { data } = await supabase
    .from('user_progress')
    .select('energy')
    .eq('user_id', userId)
    .single()

  const currentEnergy = data?.energy ?? MAX_ENERGY
  const newEnergy = Math.min(MAX_ENERGY, currentEnergy + ENERGY_RESTORE_AMOUNT)

  await supabase
    .from('user_progress')
    .update({ energy: newEnergy })
    .eq('user_id', userId)
}