'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { logWorkout } from './actions'

interface Exercise {
  id: string
  name: string
  primary_muscle: string
  progression_tier: number
}

export default function LogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [rpe, setRpe] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const router = useRouter()
  const supabase = createClient()

  const fetchExercises = useCallback(async () => {
    const { data, error } = await supabase.from('exercises').select('*').order('name')
    if (!error && data) {
      setExercises(data)
    }
  }, [supabase])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      fetchExercises()
    }
    checkAuth()
  }, [supabase, router, fetchExercises])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const formData = new FormData()
      formData.append('exercise_id', selectedExercise)
      formData.append('sets', sets)
      formData.append('reps', reps)
      formData.append('rpe', rpe)

      await logWorkout(formData)
      setMessage({ type: 'success', text: 'Workout logged successfully!' })
      setSelectedExercise('')
      setSets('')
      setReps('')
      setRpe('')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to log workout' })
    } finally {
      setLoading(false)
    }
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading exercises...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 pt-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Log Workout</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Exercise
            </label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select an exercise</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.primary_muscle}) - Tier {ex.progression_tier}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sets
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
                placeholder="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reps
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
                placeholder="10"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                RPE (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
                placeholder="7"
                required
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 mt-4">
            <p className="text-xs text-slate-400 mb-2">RPE Guide:</p>
            <div className="grid grid-cols-5 gap-1 text-xs">
              <span className="text-green-400">1-3: Easy</span>
              <span className="text-yellow-400">4-5: Moderate</span>
              <span className="text-orange-400">6-7: Hard</span>
              <span className="text-red-400">8-9: Very Hard</span>
              <span className="text-red-600">10: Max Effort</span>
            </div>
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-900/30 border border-green-800 text-green-400' 
                : 'bg-red-900/30 border border-red-800 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            {loading ? 'Logging...' : 'Log Workout'}
          </button>
        </form>
      </div>
    </div>
  )
}