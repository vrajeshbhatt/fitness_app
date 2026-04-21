import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { calculateMuscleFatigue, getRecommendedMuscles, type WorkoutLog } from '@/utils/analytics'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

async function getData() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: logs } = await supabase
    .from('workout_logs')
    .select(`
      id,
      user_id,
      exercise_id,
      sets,
      reps,
      rpe,
      created_at,
      exercises (
        name,
        primary_muscle,
        secondary_muscle
      )
    `)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false }) as { data: WorkoutLog[] | null }

  const { data: allLogs } = await supabase
    .from('workout_logs')
    .select(`
      id,
      user_id,
      exercise_id,
      sets,
      reps,
      rpe,
      created_at,
      exercises (
        name,
        primary_muscle,
        secondary_muscle
      )
    `)
    .order('created_at', { ascending: false }) as { data: WorkoutLog[] | null }

  return {
    recentLogs: logs || [],
    allLogs: allLogs || [],
  }
}

export default async function DashboardPage() {
  const { recentLogs, allLogs } = await getData()
  
  const fatigue = calculateMuscleFatigue(allLogs)
  const recommendedMuscles = getRecommendedMuscles(fatigue)

  const workoutsPerDay = recentLogs.reduce((acc, log) => {
    const date = new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(workoutsPerDay).map(([day, count]) => ({
    day,
    workouts: count,
  }))

  return (
    <DashboardClient 
      logs={recentLogs}
      fatigue={fatigue}
      recommendedMuscles={recommendedMuscles}
      chartData={chartData}
    />
  )
}