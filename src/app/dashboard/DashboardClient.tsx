'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Flame, TrendingUp, Target, Zap } from 'lucide-react'
import { formatFatigueLevel, type MuscleFatigue, type WorkoutLog } from '@/utils/analytics'

interface DashboardClientProps {
  logs: WorkoutLog[]
  fatigue: MuscleFatigue[]
  recommendedMuscles: string[]
  chartData: Array<{ day: string; workouts: number }>
  userProgress?: Record<string, unknown> | null
}

export default function DashboardClient({ 
  logs, 
  fatigue, 
  recommendedMuscles,
  chartData,
  userProgress 
}: DashboardClientProps) {
  const level = userProgress?.level as number | undefined
  const xp = userProgress?.xp as number | undefined
  const gold = userProgress?.gold as number | undefined
  const streak = userProgress?.streak as number | undefined

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        <header className="pt-4">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Track your progress</p>
        </header>

        {userProgress && (
          <section className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-blue-400">{level || 1}</div>
                <div className="text-xs text-slate-400">Level</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-400">{xp || 0}</div>
                <div className="text-xs text-slate-400">XP</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">{gold || 0}</div>
                <div className="text-xs text-slate-400">Gold</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-400">{streak || 0}</div>
                <div className="text-xs text-slate-400">Streak</div>
              </div>
            </div>
          </section>
        )}

        <section className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-400" size={20} />
            <h2 className="font-semibold text-white">This Week</h2>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: '#334155' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="workouts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-500">
              No workouts this week
            </div>
          )}
        </section>

        <section className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400" size={20} />
            <h2 className="font-semibold text-white">Muscle Recovery</h2>
          </div>
          
          {fatigue.length > 0 ? (
            <div className="space-y-2">
              {fatigue.map((m) => (
                <div key={m.muscle} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-white font-medium">{m.muscle}</span>
                  <span className={`text-sm font-medium ${
                    m.fatigue === 'recovered' ? 'text-blue-400' :
                    m.fatigue === 'low' ? 'text-green-400' :
                    m.fatigue === 'moderate' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {formatFatigueLevel(m.fatigue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">Log workouts to see fatigue data</p>
          )}
        </section>

        <section className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-800/30">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-green-400" size={20} />
            <h2 className="font-semibold text-white">Ready to Train</h2>
          </div>
          {recommendedMuscles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recommendedMuscles.map((muscle) => (
                <span 
                  key={muscle}
                  className="px-3 py-1 bg-green-900/50 text-green-400 text-sm rounded-full border border-green-800"
                >
                  {muscle}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Train more to get recommendations</p>
          )}
        </section>

        <section className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="text-orange-400" size={20} />
            <h2 className="font-semibold text-white">Recent Workouts</h2>
          </div>
          
          {logs.length > 0 ? (
            <div className="space-y-2">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{log.exercises?.name}</p>
                    <p className="text-xs text-slate-400">{log.exercises?.primary_muscle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{log.sets}x{log.reps}</p>
                    <p className="text-xs text-slate-400">RPE {log.rpe}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No workouts logged yet</p>
          )}
        </section>
      </div>
    </div>
  )
}