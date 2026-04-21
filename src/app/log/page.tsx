'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface SetData {
  id: number
  setNumber: number
  weight: string
  reps: string
  rpe: number
  completed: boolean
}

interface MuscleLoad {
  name: string
  level: string
  percentage: number
}

const XP_PREVIEW = 350

export default function LogPage() {
  const [exerciseSets, setExerciseSets] = useState<SetData[]>([
    { id: 1, setNumber: 1, weight: '225', reps: '8', rpe: 7, completed: true },
    { id: 2, setNumber: 2, weight: '245', reps: '5', rpe: 8, completed: false },
  ])
  const [restTime, setRestTime] = useState(105)
  const muscleLoads: MuscleLoad[] = [
    { name: 'Back', level: 'High', percentage: 75 },
    { name: 'Legs', level: 'Med', percentage: 40 },
  ]
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
      }
    })
  }, [supabase, router])

  useEffect(() => {
    if (restTime <= 0) return
    const timer = setInterval(() => {
      setRestTime((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [restTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAddSet = () => {
    setExerciseSets((prev) => [
      ...prev,
      { id: prev.length + 1, setNumber: prev.length + 1, weight: '', reps: '', rpe: 7, completed: false },
    ])
  }

  const handleSetChange = (id: number, field: keyof SetData, value: string | number) => {
    setExerciseSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, [field]: value } : set))
    )
  }

  const handleToggleComplete = (id: number) => {
    setExerciseSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, completed: !set.completed } : set))
    )
    const set = exerciseSets.find((s) => s.id === id)
    if (set && !set.completed) {
      setRestTime(120)
    }
  }

  const handleCompleteWorkout = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const completedSets = exerciseSets.filter(s => s.completed)
      const totalSets = completedSets.length
      const totalReps = completedSets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0)

      await supabase.from('workout_logs').insert({
        user_id: user.id,
        exercise_id: 'barbell-deadlift',
        sets: totalSets,
        reps: totalReps,
        rpe: 7,
      })

      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (progress) {
        const xpEarned = 50 + totalSets * 10 + totalReps * 2
        const newXP = (progress.xp || 0) + xpEarned
        const newGold = (progress.gold || 0) + 10
        const newStreak = progress.streak || 0
        const newTotal = (progress.total_workouts || 0) + 1
        const newLevel = Math.floor(newXP / 15000) + 1

        await supabase
          .from('user_progress')
          .update({
            xp: newXP,
            gold: newGold,
            streak: newStreak + 1,
            total_workouts: newTotal,
            level: newLevel,
            last_workout_date: new Date().toISOString(),
          })
          .eq('user_id', user.id)
      }

      setMessage({ type: 'success', text: `Workout completed! +${50 + totalSets * 10 + totalReps * 2} XP` })
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to complete workout' })
    } finally {
      setLoading(false)
    }
  }

  const getRpeColor = (rpe: number) => {
    if (rpe <= 5) return 'text-green-400'
    if (rpe <= 7) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen pb-xl">
      <style jsx global>{`
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          margin-top: -6px;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          border: 2px solid #00d4ff;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: linear-gradient(to right, #10b981, #eab308, #ef4444);
          border-radius: 2px;
        }
      `}</style>

      <header className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-cyan-900/50 shadow-[0_4px_20px_rgba(0,212,255,0.1)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-surface-container border border-primary/50 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <span className="text-xs font-bold text-black">S</span>
            </div>
          </div>
        </div>
        <h1 className="font-heading uppercase tracking-widest font-bold text-cyan-400 text-sm">SYSTEM STATUS</h1>
        <button className="text-cyan-400 hover:text-cyan-300 transition-colors active:scale-95 duration-100 flex items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
        </button>
      </header>

      <main className="pt-[88px] px-margin max-w-3xl mx-auto space-y-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <p className="font-label-caps text-primary uppercase mb-xs tracking-widest text-xs">Active Quest</p>
            <h2 className="font-heading uppercase font-bold text-white text-2xl">STRENGTH AWAKENING</h2>
          </div>
          <div className="bg-surface-container-high border border-outline-variant rounded-full px-md py-sm flex items-center gap-sm shadow-[0_0_15px_rgba(0,212,255,0.05)]">
            <span className="material-symbols-outlined text-primary">timer</span>
            <span className="font-heading text-xl text-on-surface tracking-wider">{formatTime(restTime)}</span>
            <button onClick={() => setRestTime(120)} className="ml-sm text-outline hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            </button>
          </div>
        </div>

        <div className="space-y-lg">
          <div className="bg-surface-container rounded-xl border border-primary/30 p-md relative overflow-hidden shadow-[0_0_30px_rgba(0,212,255,0.05)]">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="flex justify-between items-start mb-md relative z-10">
              <div>
                <h3 className="font-heading uppercase text-white mb-xs text-lg">Barbell Deadlift</h3>
                <div className="flex gap-2">
                  <span className="bg-surface-bright text-on-surface-variant font-label-caps text-[10px] px-2 py-1 rounded">BACK</span>
                  <span className="bg-surface-bright text-on-surface-variant font-label-caps text-[10px] px-2 py-1 rounded">LEGS</span>
                </div>
              </div>
              <button className="text-outline hover:text-error transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            <div className="grid grid-cols-[32px_1fr_1fr_2fr_32px] gap-sm mb-xs px-2">
              <span className="font-label-caps text-outline text-center text-xs">SET</span>
              <span className="font-label-caps text-outline text-center text-xs">LBS</span>
              <span className="font-label-caps text-outline text-center text-xs">REPS</span>
              <span className="font-label-caps text-outline text-center text-xs">RPE</span>
              <span></span>
            </div>

            <div className="space-y-sm">
              {exerciseSets.map((set) => (
                <div
                  key={set.id}
                  className={`grid grid-cols-[32px_1fr_1fr_2fr_32px] gap-sm items-center bg-surface-container-low rounded-lg p-2 border ${
                    set.completed ? 'border-transparent opacity-60' : 'border-primary/50 shadow-[0_0_10px_rgba(0,212,255,0.1)] relative'
                  }`}
                >
                  {!set.completed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>}
                  <span className={`font-heading text-base text-center ${set.completed ? 'text-outline' : 'text-primary'}`}>
                    {set.setNumber}
                  </span>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => handleSetChange(set.id, 'weight', e.target.value)}
                    readOnly={set.completed}
                    className={`bg-surface-dim border border-outline-variant rounded text-center font-heading text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary w-full py-1 ${set.completed ? 'opacity-50' : ''}`}
                    placeholder="0"
                  />
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleSetChange(set.id, 'reps', e.target.value)}
                    readOnly={set.completed}
                    className={`bg-surface-dim border border-outline-variant rounded text-center font-heading text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary w-full py-1 ${set.completed ? 'opacity-50' : ''}`}
                    placeholder="0"
                  />
                  <div className="flex flex-col justify-center px-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={set.rpe}
                      onChange={(e) => handleSetChange(set.id, 'rpe', parseInt(e.target.value))}
                      disabled={set.completed}
                      className={set.completed ? 'opacity-50' : ''}
                    />
                    <div className="flex justify-between mt-1 px-1">
                      <span className="text-[10px] text-outline font-label-caps">EASY</span>
                      <span className={`text-[10px] font-label-caps ${getRpeColor(set.rpe)}`}>RPE {set.rpe}</span>
                      <span className="text-[10px] text-error font-label-caps">MAX</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleComplete(set.id)}
                    className={`flex justify-center transition-colors ${set.completed ? 'text-primary' : 'text-outline hover:text-primary'}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: set.completed ? "'FILL' 1" : "''" }}>
                      {set.completed ? 'check_circle' : 'check_circle'}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleAddSet} className="w-full mt-md border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-label-caps uppercase py-sm rounded-lg flex justify-center items-center gap-xs transition-all duration-200 text-xs">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Set
            </button>
          </div>

          <div className="bg-surface-container rounded-xl border border-surface-variant p-md opacity-80">
            <div className="flex justify-between items-start mb-md">
              <div>
                <h3 className="font-heading uppercase text-on-surface-variant mb-xs text-lg">Lat Pulldown</h3>
                <div className="flex gap-2">
                  <span className="bg-surface-bright text-on-surface-variant font-label-caps text-[10px] px-2 py-1 rounded">BACK</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center py-lg border border-dashed border-outline-variant rounded-lg">
              <p className="font-label-caps text-outline tracking-wider text-xs">AWAITING START</p>
            </div>
          </div>

          <button className="w-full bg-surface-container-high border border-outline-variant text-on-surface font-heading uppercase py-md rounded-xl flex justify-center items-center gap-sm hover:bg-surface-bright transition-colors shadow-sm text-sm">
            <span className="material-symbols-outlined text-secondary">add_circle</span>
            Add Exercise
          </button>
        </div>

        <div className="bg-surface-container-low rounded-xl border border-outline-variant p-md">
          <h4 className="font-label-caps text-outline uppercase mb-sm tracking-widest flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-[16px]">accessibility_new</span>
            Muscle Load
          </h4>
          <div className="space-y-sm">
            {muscleLoads.map((muscle) => (
              <div key={muscle.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface text-sm">{muscle.name}</span>
                  <span className={muscle.name === 'Back' ? 'text-primary font-heading text-sm' : 'text-secondary font-heading text-sm'}>
                    {muscle.level}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-bright rounded-full overflow-hidden">
                  <div className={`h-full ${muscle.name === 'Back' ? 'bg-primary' : 'bg-secondary'} shadow-[0_0_10px_rgba(0,212,255,0.8)]`} style={{ width: `${muscle.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-md pb-xl">
          {message.text && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-400' : 'bg-red-900/30 border border-red-800 text-red-400'}`}>
              {message.text}
            </div>
          )}
          <button
            onClick={handleCompleteWorkout}
            disabled={loading}
            className="w-full bg-primary text-on-primary font-heading uppercase py-4 rounded-xl flex justify-center items-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] group disabled:opacity-50"
          >
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
            {loading ? 'Completing...' : 'Complete Workout'}
            <span className="bg-on-primary/10 px-3 py-1 rounded-full font-heading text-sm ml-2 flex items-center gap-1 border border-on-primary/20">
              +{XP_PREVIEW} XP
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}