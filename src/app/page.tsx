'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell, Flame, Zap, ArrowRight } from 'lucide-react'

interface TodaysPlan {
  recommendations?: Array<{
    name: string
    muscle_group: string
    reps: number
    sets: number
  }>
  exercises?: Array<{
    name: string
    muscle_group: string
    reps: number
    sets: number
  }>
}

export default function Home() {
  const [plan, setPlan] = useState<TodaysPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [planLoading, setPlanLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser({ email: user.email || '' })
      setLoading(false)
      fetchPlan()
    }
    init()
  }, [supabase, router])

  const fetchPlan = async () => {
    setPlanLoading(true)
    try {
      const res = await fetch('/api/plan')
      if (res.ok) {
        const data = await res.json()
        setPlan(data)
      }
    } catch {
      // Fallback plan will be shown
    } finally {
      setPlanLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <header className="pt-4">
          <h1 className="text-2xl font-bold text-white">Calisthenics AI</h1>
          <p className="text-slate-400">Your intelligent fitness coach</p>
        </header>

        <section className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl p-6 border border-blue-800/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-400" size={20} />
              <h2 className="font-semibold text-white">Today&apos;s Optimal Routine</h2>
            </div>
          </div>
          
          {planLoading ? (
            <div className="py-6 text-center">
              <div className="animate-pulse text-slate-400">Generating your plan...</div>
            </div>
          ) : plan && (plan.recommendations?.length || plan.exercises?.length) ? (
            <div className="space-y-3">
              {(plan.recommendations || plan.exercises || []).map((ex, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{ex.name}</p>
                    <p className="text-xs text-slate-400">{ex.muscle_group}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{ex.sets}x{ex.reps}</p>
                  </div>
                </div>
              ))}
              <Link href="/log" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Start Workout <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-300 mb-4">No plan generated yet</p>
              <Link href="/log" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                <Dumbbell size={18} /> Log First Workout
              </Link>
            </div>
          )}
        </section>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/log" className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-colors">
            <Dumbbell className="text-blue-400 mb-2" size={24} />
            <h3 className="font-medium text-white">Log Workout</h3>
            <p className="text-xs text-slate-400">Record your sets</p>
          </Link>
          <Link href="/dashboard" className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors">
            <Flame className="text-orange-400 mb-2" size={24} />
            <h3 className="font-medium text-white">Dashboard</h3>
            <p className="text-xs text-slate-400">View progress</p>
          </Link>
        </div>

        <section className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <h2 className="font-medium text-white mb-3">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-400">0</p>
              <p className="text-xs text-slate-400">Workouts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">-</p>
              <p className="text-xs text-slate-400">Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">-</p>
              <p className="text-xs text-slate-400">Level</p>
            </div>
          </div>
        </section>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="w-full py-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          Sign Out ({user?.email})
        </button>
      </div>
    </div>
  )
}