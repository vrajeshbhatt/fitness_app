'use client'

import { useState } from 'react'
import { Target, Star, Flame, Calendar, CheckCircle, Lock } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  target: number
  xpReward: number
  progress: number
  startDate: string
  endDate: string
  completed: boolean
  isActive: boolean
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Weekly Pull-up Challenge',
    description: 'Complete 50 pull-ups this week',
    target: 50,
    xpReward: 500,
    progress: 32,
    startDate: '2024-04-15',
    endDate: '2024-04-21',
    completed: false,
    isActive: true,
  },
  {
    id: '2',
    title: 'Muscle Up Master',
    description: 'Perform 20 muscle-ups total',
    target: 20,
    xpReward: 750,
    progress: 15,
    startDate: '2024-04-15',
    endDate: '2024-04-21',
    completed: false,
    isActive: true,
  },
  {
    id: '3',
    title: 'Plank Endurance',
    description: 'Hold plank for 10 minutes cumulative',
    target: 10,
    xpReward: 300,
    progress: 10,
    startDate: '2024-04-15',
    endDate: '2024-04-21',
    completed: true,
    isActive: true,
  },
  {
    id: '4',
    title: 'Dip Deluxe',
    description: 'Complete 100 dips this week',
    target: 100,
    xpReward: 400,
    progress: 78,
    startDate: '2024-04-15',
    endDate: '2024-04-21',
    completed: false,
    isActive: true,
  },
  {
    id: '5',
    title: 'Handstand Hold',
    description: 'Hold handstand for 30 seconds total',
    target: 30,
    xpReward: 600,
    progress: 0,
    startDate: '2024-04-22',
    endDate: '2024-04-28',
    completed: false,
    isActive: false,
  },
]

export default function ChallengesPage() {
  const [challenges] = useState<Challenge[]>(mockChallenges)
  const activeChallenges = challenges.filter((c) => c.isActive)
  const upcomingChallenges = challenges.filter((c) => !c.isActive)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e1e9] pb-20">
      <main className="p-5 max-w-7xl mx-auto pt-[90px]">
        <section className="mb-6 mt-2">
          <h1 className="text-5xl font-bold text-[#d2bbff] tracking-widest uppercase drop-shadow-[0_0_12px_rgba(210,187,255,0.4)]">
            CHALLENGES
          </h1>
          <p className="text-[#bbc9cf] mt-1">Push your limits and earn massive XP rewards.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#e4e1e9] mb-4 flex items-center gap-2">
            <Flame className="text-orange-400" size={20} />
            ACTIVE CHALLENGES
          </h2>
          <div className="space-y-4">
            {activeChallenges.map((challenge) => {
              const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100)
              const isCompleted = challenge.completed

              return (
                <article
                  key={challenge.id}
                  className={`bg-[#1b1b20] rounded-lg p-5 border transition-all group ${
                    isCompleted
                      ? 'border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.1)]'
                      : 'border-[#3c494e] hover:border-[#d2bbff]/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isCompleted ? 'bg-[#4ade80]/20' : 'bg-[#d2bbff]/20'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="text-[#4ade80]" size={24} />
                        ) : (
                          <Target className="text-[#d2bbff]" size={24} />
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-lg font-semibold uppercase tracking-wider ${
                            isCompleted ? 'text-[#4ade80]' : 'text-[#e4e1e9]'
                          }`}
                        >
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-[#bbc9cf] mt-1">{challenge.description}</p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded font-bold text-xs tracking-widest ${
                        isCompleted
                          ? 'bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]'
                          : 'bg-[#d2bbff]/10 border border-[#d2bbff]/30 text-[#d2bbff]'
                      }`}
                    >
                      {isCompleted ? 'COMPLETED' : 'ACTIVE'}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#859398]" />
                      <span className="text-xs text-[#859398]">
                        {new Date(challenge.startDate).toLocaleDateString()} -{' '}
                        {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-[#ffdd4c]" />
                      <span className="text-sm font-bold text-[#ffdd4c]">{challenge.xpReward} XP</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span
                        className={`text-xs font-bold tracking-widest ${
                          isCompleted ? 'text-[#4ade80]' : 'text-[#bbc9cf]'
                        }`}
                      >
                        {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                      </span>
                      <span className="text-sm font-bold text-[#e4e1e9]">
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#35343a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.5)]'
                            : 'bg-gradient-to-r from-[#d2bbff] to-[#a8e8ff] shadow-[0_0_8px_rgba(210,187,255,0.5)]'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {upcomingChallenges.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#e4e1e9] mb-4 flex items-center gap-2">
              <Lock className="text-[#859398]" size={20} />
              UPCOMING
            </h2>
            <div className="space-y-4">
              {upcomingChallenges.map((challenge) => (
                <article
                  key={challenge.id}
                  className="bg-[#1f1f25] rounded-lg p-5 border border-[#2a292f] opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#2a292f] flex items-center justify-center">
                      <Lock className="text-[#859398]" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold uppercase tracking-wider text-[#859398]">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-[#859398] mt-1">{challenge.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#859398]" />
                          <span className="text-xs text-[#859398]">
                            Starts {new Date(challenge.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-[#ffdd4c]" />
                          <span className="text-sm font-bold text-[#ffdd4c]">{challenge.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}