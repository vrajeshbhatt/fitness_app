'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const XP_PER_LEVEL = 15000
const XP_REWARDS = {
  perSet: 10,
  perRep: 2,
  workoutComplete: 50,
  questComplete: 25,
  streakBonus: 5,
}

export async function completeWorkout(workoutData: {
  exerciseId: string
  sets: number
  reps: number
  exerciseType?: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .single()

  let currentXP = progress?.xp ?? 0
  let currentGold = progress?.gold ?? 0
  let currentStreak = progress?.streak ?? 0
  let totalWorkouts = progress?.total_workouts ?? 0

  const xpEarned = 
    XP_REWARDS.workoutComplete +
    workoutData.sets * XP_REWARDS.perSet +
    workoutData.reps * XP_REWARDS.perRep

  const goldEarned = 10

  currentXP += xpEarned
  currentGold += goldEarned
  totalWorkouts += 1

  const today = new Date().toDateString()
  const lastWorkout = progress?.last_workout_date
    ? new Date(progress.last_workout_date).toDateString()
    : null

  if (lastWorkout !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (lastWorkout === yesterday.toDateString()) {
      currentStreak += 1
      currentXP += XP_REWARDS.streakBonus * currentStreak
    } else if (lastWorkout !== today) {
      currentStreak = 1
    }
  }

  await supabase
    .from('user_progress')
    .update({
      xp: currentXP,
      gold: currentGold,
      streak: currentStreak,
      total_workouts: totalWorkouts,
      last_workout_date: new Date().toISOString(),
      level: Math.floor(currentXP / XP_PER_LEVEL) + 1,
    })
    .eq('user_id', user.id)

  await supabase.from('workout_logs').insert({
    user_id: user.id,
    exercise_id: workoutData.exerciseId,
    sets: workoutData.sets,
    reps: workoutData.reps,
  })

  await checkAndUpdateAchievements(user.id, {
    totalWorkouts,
    streak: currentStreak,
    exerciseType: workoutData.exerciseType,
  })

  revalidatePath('/')
  revalidatePath('/dashboard')
  revalidatePath('/quests')
  revalidatePath('/achievements')

  return {
    xpEarned,
    goldEarned,
    newStreak: currentStreak,
    newLevel: Math.floor(currentXP / XP_PER_LEVEL) + 1,
  }
}

async function checkAndUpdateAchievements(
  userId: string,
  stats: {
    totalWorkouts: number
    streak: number
    exerciseType?: string
  }
) {
  const supabase = await createClient()

  const milestoneIds = ['total-10', 'total-50', 'total-100', 'streak-7', 'streak-30', 'streak-100']
  
  for (const achievementId of milestoneIds) {
    const { data: achievement } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()

    if (!achievement || achievement.unlocked) continue

    let target = 0
    if (achievementId.startsWith('total-')) {
      target = stats.totalWorkouts
    } else if (achievementId.startsWith('streak-')) {
      target = stats.streak
    }

    if (target > 0) {
      const { target: achievementTarget } = achievement
      const newProgress = Math.min(target, achievementTarget)
      const isNowUnlocked = newProgress >= achievementTarget

      await supabase
        .from('user_achievements')
        .update({
          progress: newProgress,
          unlocked: isNowUnlocked,
        })
        .eq('user_id', userId)
        .eq('achievement_id', achievementId)

      if (isNowUnlocked && achievement.xp_reward) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (progress) {
          await supabase
            .from('user_progress')
            .update({
              xp: (progress.xp || 0) + achievement.xp_reward,
              gold: (progress.gold || 0) + (achievement.gold_reward || 0),
            })
            .eq('user_id', userId)
        }
      }
    }
  }
}

export async function claimQuest(questId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: quest, error: questError } = await supabase
    .from('daily_quests')
    .select('*')
    .eq('user_id', user.id)
    .eq('id', questId)
    .single()

  if (questError || !quest) throw new Error('Quest not found')
  if (quest.completed) throw new Error('Quest already claimed')

  const { xp_reward: xpReward, gold_reward: goldReward } = quest

  await supabase
    .from('daily_quests')
    .update({ completed: true })
    .eq('user_id', user.id)
    .eq('id', questId)

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (progress) {
    await supabase
      .from('user_progress')
      .update({
        xp: (progress.xp || 0) + xpReward,
        gold: (progress.gold || 0) + goldReward,
      })
      .eq('user_id', user.id)
  }

  revalidatePath('/')
  revalidatePath('/quests')

  return { xpReward, goldReward }
}

export async function resetDaily() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = new Date().toISOString().split('T')[0]

  const { data: existingQuests } = await supabase
    .from('daily_quests')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', today)

  if (existingQuests && existingQuests.length > 0) {
    return { message: 'Quests already reset for today' }
  }

  const defaultQuests = [
    {
      user_id: user.id,
      date: today,
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
      user_id: user.id,
      date: today,
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
      user_id: user.id,
      date: today,
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
      user_id: user.id,
      date: today,
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
    await supabase.from('daily_quests').insert(quest)
  }

  const { data: progress } = await supabase
    .from('user_progress')
    .select('energy')
    .eq('user_id', user.id)
    .single()

if (progress) {
      await supabase
        .from('user_progress')
        .update({ energy: 100 })
        .eq('user_id', user.id)
    }

  revalidatePath('/')
  revalidatePath('/quests')

  return { message: 'Daily quests reset successfully' }
}