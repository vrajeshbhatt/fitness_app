export interface MuscleFatigue {
  muscle: string
  fatigue: 'low' | 'moderate' | 'high' | 'recovered'
  score: number
  lastTrained: string | null
}

export interface WorkoutLog {
  id: string
  user_id: string
  exercise_id: string
  sets: number
  reps: number
  rpe: number
  created_at: string
  exercises?: {
    name: string
    primary_muscle: string
    secondary_muscle: string | null
  }
}

export function calculateMuscleFatigue(
  logs: WorkoutLog[],
  recoveryHours: number = 48
): MuscleFatigue[] {
  const fatigueMap = new Map<string, { totalScore: number; lastTrained: Date | null }>()
  
  const now = new Date()
  
  logs.forEach((log) => {
    if (!log.exercises) return
    const muscle = log.exercises.primary_muscle
    const logDate = new Date(log.created_at)
    const hoursSince = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60)
    const recoveryMultiplier = Math.max(0, 1 - hoursSince / recoveryHours)
    const score = log.sets * log.reps * log.rpe * recoveryMultiplier
    
    const existing = fatigueMap.get(muscle) || { totalScore: 0, lastTrained: null }
    fatigueMap.set(muscle, {
      totalScore: existing.totalScore + score,
      lastTrained: existing.lastTrained 
        ? (logDate > existing.lastTrained ? logDate : existing.lastTrained)
        : logDate,
    })
  })
  
  const results: MuscleFatigue[] = []
  
  fatigueMap.forEach((data, muscle) => {
    let fatigue: 'low' | 'moderate' | 'high' | 'recovered'
    const score = data.totalScore
    
    if (score === 0) {
      fatigue = 'recovered'
    } else if (score < 100) {
      fatigue = 'low'
    } else if (score < 300) {
      fatigue = 'moderate'
    } else {
      fatigue = 'high'
    }
    
    results.push({
      muscle,
      fatigue,
      score: Math.round(score),
      lastTrained: data.lastTrained 
        ? data.lastTrained.toISOString() 
        : null,
    })
  })
  
  return results.sort((a, b) => b.score - a.score)
}

export function getRecommendedMuscles(
  fatigue: MuscleFatigue[]
): string[] {
  return fatigue
    .filter(f => f.fatigue === 'recovered' || f.fatigue === 'low')
    .map(f => f.muscle)
}

export function formatFatigueLevel(fatigue: 'low' | 'moderate' | 'high' | 'recovered'): string {
  const labels = {
    low: 'Ready',
    moderate: 'Somewhat Fatigued',
    high: 'High Fatigue',
    recovered: 'Recovered',
  }
  return labels[fatigue]
}