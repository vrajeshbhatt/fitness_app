'use client'

import { useState } from 'react'
import { Award, Shield, Lock, HelpCircle, Star, Coins } from 'lucide-react'

type AchievementTier = 'platinum' | 'gold' | 'silver' | 'bronze'
type AchievementStatus = 'completed' | 'in_progress' | 'locked'
type AchievementCategory = 'all' | 'streaks' | 'muscles' | 'special'

interface Achievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  tier: AchievementTier
  status: AchievementStatus
  currentProgress: number
  targetProgress: number
  unit: string
  xpReward: number
  goldReward: number
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Iron Will',
    description: 'Complete 30 consecutive daily quests.',
    category: 'streaks',
    tier: 'platinum',
    status: 'completed',
    currentProgress: 30,
    targetProgress: 30,
    unit: '',
    xpReward: 500,
    goldReward: 100,
  },
  {
    id: '2',
    name: 'Beast Master',
    description: 'Lift a total of 10,000 kg.',
    category: 'muscles',
    tier: 'gold',
    status: 'in_progress',
    currentProgress: 6420,
    targetProgress: 10000,
    unit: 'kg',
    xpReward: 300,
    goldReward: 0,
  },
  {
    id: '3',
    name: 'Endurance',
    description: 'Run 50km total distance.',
    category: 'muscles',
    tier: 'silver',
    status: 'in_progress',
    currentProgress: 15,
    targetProgress: 50,
    unit: 'km',
    xpReward: 150,
    goldReward: 0,
  },
  {
    id: '4',
    name: 'Mystery Achievement',
    description: 'Condition not yet met. Keep pushing.',
    category: 'special',
    tier: 'bronze',
    status: 'locked',
    currentProgress: 0,
    targetProgress: 100,
    unit: '',
    xpReward: 0,
    goldReward: 0,
  },
  {
    id: '5',
    name: 'Boss Hunter',
    description: 'Defeat the ultimate boss.',
    category: 'special',
    tier: 'platinum',
    status: 'locked',
    currentProgress: 0,
    targetProgress: 1,
    unit: '',
    xpReward: 1000,
    goldReward: 500,
  },
]

const tierColors: Record<AchievementTier, { text: string; glow: string }> = {
  platinum: { text: '#a8e8ff', glow: 'rgba(168, 232, 255, 0.8)' },
  gold: { text: '#ffdd4c', glow: 'rgba(255, 221, 76, 0.5)' },
  silver: { text: '#bbc9cf', glow: 'rgba(187, 201, 207, 0.3)' },
  bronze: { text: '#cd7f32', glow: 'rgba(205, 127, 50, 0.3)' },
}

const tierIcons: Record<AchievementTier, React.ElementType> = {
  platinum: Award,
  gold: Award,
  silver: Shield,
  bronze: Award,
}

export default function AchievementsPage() {
  const [activeFilter, setActiveFilter] = useState<AchievementCategory>('all')

  const filteredAchievements = mockAchievements.filter(
    (a) => activeFilter === 'all' || a.category === activeFilter
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e1e9] pb-20">
      <main className="p-5 max-w-7xl mx-auto pt-[90px]">
        <section className="mb-6 mt-2">
          <h1 className="text-5xl font-bold text-[#a8e8ff] tracking-widest uppercase drop-shadow-[0_0_12px_rgba(168,232,255,0.4)]">
            ACHIEVEMENTS
          </h1>
          <p className="text-[#bbc9cf] mt-1">Unlock your potential and claim your rewards.</p>
        </section>

        <nav className="flex gap-2 overflow-x-auto mb-6 pb-1">
          {(['all', 'streaks', 'muscles', 'special'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded font-bold text-xs tracking-widest whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-[#a8e8ff]/10 border border-[#a8e8ff] text-[#a8e8ff] shadow-[0_0_8px_rgba(0,212,255,0.2)]'
                  : 'border border-[#3c494e] bg-[#1f1f25] text-[#bbc9cf] hover:text-[#e4e1e9] hover:border-[#859398]'
              }`}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const Icon = achievement.status === 'locked' ? HelpCircle : tierIcons[achievement.tier]
            const colors = tierColors[achievement.tier]
            const progress =
              achievement.targetProgress > 0
                ? (achievement.currentProgress / achievement.targetProgress) * 100
                : 0
            const isCompleted = achievement.status === 'completed'
            const isInProgress = achievement.status === 'in_progress'
            const isLocked = achievement.status === 'locked'

            const iconStyle: React.CSSProperties = !isLocked && !isCompleted
              ? { color: colors.text, filter: `drop-shadow(0 0 5px ${colors.glow})` }
              : isCompleted
              ? { color: '#a8e8ff', filter: 'drop-shadow(0 0 8px rgba(168,232,255,0.8))' }
              : { color: '#859398' }

            const progressBarStyle: React.CSSProperties = {
              width: isCompleted ? '100%' : `${progress}%`,
              backgroundColor: isCompleted ? '#a8e8ff' : isLocked ? '#859398' : colors.text,
              boxShadow: isCompleted
                ? '0 0 5px rgba(168,232,255,0.8)'
                : isLocked
                ? undefined
                : `0 0 5px ${colors.glow}`,
            }

            return (
              <article
                key={achievement.id}
                className={`bg-[#1b1b20] rounded-lg p-4 relative overflow-hidden transition-all group ${
                  isCompleted
                    ? 'border border-[#a8e8ff]/30 shadow-[0_0_15px_rgba(0,212,255,0.05)] hover:shadow-[0_0_25px_rgba(0,212,255,0.15)]'
                    : isLocked
                    ? 'border border-[#35343a] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500'
                    : 'border border-[#3c494e] hover:border-[#a8e8ff]/50'
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#a8e8ff]/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-[#a8e8ff]/20 transition-colors" />
                )}

                <div className="flex items-start gap-4 relative z-10">
                  <div
                    className={`w-16 h-16 rounded flex items-center justify-center border ${
                      isLocked
                        ? 'bg-[#2a292f] border-[#35343a]'
                        : isCompleted
                        ? 'bg-[#1f1f25] border-[#a8e8ff]/50'
                        : 'bg-[#1f1f25]'
                    }`}
                    style={!isLocked && !isCompleted ? { borderColor: `${colors.text}30` } : undefined}
                  >
                    {isCompleted && (
                      <div className="absolute inset-0 bg-[#a8e8ff]/20 animate-pulse rounded" />
                    )}
                    <Icon className="text-4xl" style={iconStyle} />
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold uppercase tracking-wider ${
                        isLocked ? 'text-[#859398]' : 'text-[#e4e1e9]'
                      }`}
                    >
                      {isLocked ? '???' : achievement.name}
                    </h3>
                    <p className={`text-sm mt-1 ${isLocked ? 'text-[#859398]' : 'text-[#bbc9cf]'}`}>
                      {isLocked ? 'Condition not yet met. Keep pushing.' : achievement.description}
                    </p>

                    {!isLocked && (
                      <div className="flex gap-2 mt-2">
                        {achievement.xpReward > 0 && (
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded border ${
                              isCompleted ? 'bg-[#ffdd4c]/10 border-[#ffdd4c]/20 text-[#ffdd4c]' : 'bg-[#ffdd4c]/5 border-[#ffdd4c]/10 text-[#ffdd4c]'
                            }`}
                          >
                            <Star size={14} />
                            {achievement.xpReward} XP
                          </span>
                        )}
                        {achievement.goldReward > 0 && (
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded border ${
                              isCompleted ? 'bg-[#d2bbff]/10 border-[#d2bbff]/20 text-[#d2bbff]' : 'bg-[#d2bbff]/5 border-[#d2bbff]/10 text-[#d2bbff]'
                            }`}
                          >
                            <Coins size={14} />
                            {achievement.goldReward} G
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center gap-1 text-sm font-bold px-2 py-1 rounded border bg-[#1f1f25] border-[#35343a] text-[#859398]">
                            <Lock size={14} />
                            ???
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {(!isLocked || isInProgress) && (
                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-1">
                      <span className={`text-xs font-bold tracking-widest ${
                        isCompleted ? 'text-[#a8e8ff]' : isLocked ? 'text-[#859398]' : 'text-[#bbc9cf]'
                      }`}>
                        {isCompleted ? 'COMPLETED' : isLocked ? 'LOCKED' : 'IN PROGRESS'}
                      </span>
                      <span className={`text-sm font-bold ${isCompleted ? 'text-[#a8e8ff]' : isLocked ? 'text-[#859398]' : 'text-[#e4e1e9]'}`}>
                        {achievement.currentProgress}/{achievement.targetProgress}
                        {achievement.unit ? (achievement.targetProgress >= 1000 ? `(${achievement.unit})` : ` ${achievement.unit}`) : ''}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#35343a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={progressBarStyle} />
                    </div>
                  </div>
                )}

                {isLocked && !isInProgress && (
                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold tracking-widest text-[#859398]">LOCKED</span>
                      <span className="text-sm font-bold text-[#859398]">0/{achievement.targetProgress}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#35343a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#859398] w-0" />
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}