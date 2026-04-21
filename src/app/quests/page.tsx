'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Swords, Footprints, Bed, Timer, Star, Zap } from 'lucide-react'

type QuestStatus = 'in_progress' | 'completed' | 'skipped'
type QuestType = 'main' | 'side' | 'rest'

interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  status: QuestStatus
  currentProgress: number
  targetProgress: number
  unit: string
  xpReward: number
  goldReward: number
}

const questIcons: Record<QuestType, React.ElementType> = {
  main: Swords,
  side: Footprints,
  rest: Bed,
}

export default function QuestsPage() {
  const [timeRemaining, setTimeRemaining] = useState('14:23:59')
  const [quests, setQuests] = useState<Quest[]>([])
  const [energy, setEnergy] = useState({ current: 75, max: 100 })
  const router = useRouter()
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: questsData } = await supabase
        .from('daily_quests')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)

      if (questsData && questsData.length > 0) {
        setQuests(questsData.map(q => ({
          id: q.id,
          title: q.title,
          description: q.description,
          type: q.type,
          status: q.completed ? 'completed' : 'in_progress',
          currentProgress: q.progress,
          targetProgress: q.target,
          unit: '',
          xpReward: q.xp_reward,
          goldReward: q.gold_reward,
        })))
      }

      const { data: progress } = await supabase
        .from('user_progress')
        .select('energy')
        .eq('user_id', user.id)
        .single()

      if (progress) {
        setEnergy({ current: progress.energy || 75, max: 100 })
      }
    }

    loadData()
  }, [supabase, router, today])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClaim = async (questId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const quest = quests.find(q => q.id === questId)
    if (!quest || quest.status !== 'completed') return

    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (progress) {
      await supabase
        .from('user_progress')
        .update({
          xp: (progress.xp || 0) + quest.xpReward,
          gold: (progress.gold || 0) + quest.goldReward,
        })
        .eq('user_id', user.id)
    }

    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, status: 'in_progress' } : q
    ))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e1e9] pb-20">
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />

      <main className="relative z-10 p-5 max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-5xl font-bold text-[#a8e8ff] tracking-tight uppercase mb-2 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
              DAILY QUESTS
            </h1>
            <p className="text-[#bbc9cf]">Complete your tasks to level up.</p>
          </div>
          <div className="bg-[#35343a] border border-[#00d4ff]/30 px-6 py-3 rounded-lg flex items-center gap-2 shadow-[0_0_10px_rgba(0,212,255,0.1)]">
            <Timer className="text-[#ffdd4c]" size={20} />
            <span className="text-2xl font-bold text-[#e4e1e9]">{timeRemaining}</span>
          </div>
        </header>

        <section className="flex flex-col gap-6 mb-6">
          <div className="flex items-center gap-3">
            <Zap className="text-[#ffdd4c]" size={20} />
            <span className="text-sm font-bold uppercase tracking-widest text-[#bbc9cf]">Energy</span>
            <span className="text-[#e4e1e9]">{energy.current}/{energy.max}</span>
          </div>
          <div className="w-full h-3 bg-[#35343a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00586b] to-[#00d4ff] rounded-full transition-all duration-300"
              style={{ width: `${(energy.current / energy.max) * 100}%` }}
            />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          {quests.map((quest) => {
            const Icon = questIcons[quest.type]
            const progress =
              quest.targetProgress > 0
                ? (quest.currentProgress / quest.targetProgress) * 100
                : 0
            const isInProgress = quest.status === 'in_progress'
            const isCompleted = quest.status === 'completed'
            const isSkipped = quest.status === 'skipped'
            const isActive = isInProgress

            return (
              <div
                key={quest.id}
                className={`bg-[#14141f] rounded-xl p-6 relative overflow-hidden transition-opacity ${
                  isSkipped ? 'opacity-50' : ''
                } ${
                  isActive
                    ? 'border border-cyan-900 glow-active'
                    : isCompleted
                    ? 'border border-cyan-500 shadow-[0_0_20px_rgba(0,212,255,0.15)]'
                    : 'border border-[#35343a]'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/10 to-transparent opacity-50 pointer-events-none" />
                )}
                {isCompleted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 to-transparent opacity-80 pointer-events-none" />
                )}

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        isInProgress
                          ? 'bg-[#35343a] border border-[#00d4ff]/50 shadow-[0_0_8px_rgba(0,212,255,0.2)]'
                          : isCompleted
                          ? 'bg-[#00d4ff]/20 border border-[#00d4ff]'
                          : 'bg-[#35343a] border border-[#3c494e]'
                      }`}
                    >
                      <Icon
                        className={`text-3xl ${
                          isInProgress
                            ? 'text-[#a8e8ff]'
                            : isCompleted
                            ? 'text-[#a8e8ff]'
                            : 'text-[#859398]'
                        }`}
                        size={28}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-semibold text-[#e4e1e9] uppercase tracking-wide">
                          {quest.title}
                        </h2>
                        {isInProgress && (
                          <span className="bg-[#00d4ff] text-[#003642] text-xs font-bold px-2 py-1 rounded uppercase">
                            IN PROGRESS
                          </span>
                        )}
                        {isCompleted && (
                          <span className="bg-[#ffdd4c] text-[#3a3000] text-xs font-bold px-2 py-1 rounded uppercase">
                            COMPLETED
                          </span>
                        )}
                        {isSkipped && (
                          <span className="bg-[#35343a] text-[#bbc9cf] text-xs font-bold px-2 py-1 rounded uppercase">
                            SKIPPED
                          </span>
                        )}
                      </div>
                      <p className="text-[#bbc9cf] mb-4">{quest.description}</p>

                      {!isSkipped && (
                        <div className="w-full md:w-64">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#bbc9cf] mb-1">
                            <span>PROGRESS</span>
                            <span>
                              {quest.currentProgress} / {quest.targetProgress}
                              {quest.unit ? ` ${quest.unit}` : ''}
                            </span>
                          </div>
                          <div className="h-2 bg-[#35343a] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isInProgress
                                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_5px_rgba(0,212,255,0.8)]'
                                  : isCompleted
                                  ? 'bg-[#00d4ff]'
                                  : 'bg-[#35343a]'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isSkipped && (
                    <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                      <div className="flex gap-2">
                        {quest.xpReward > 0 && (
                          <div className="flex items-center gap-1 bg-[#1b1b20] border border-[#00d4ff]/20 px-3 py-1 rounded-full">
                            <Star className="text-[#a8e8ff]" size={14} />
                            <span className="text-xs font-bold text-[#a8e8ff]">
                              +{quest.xpReward} XP
                            </span>
                          </div>
                        )}
                        {quest.goldReward > 0 && (
                          <div className="flex items-center gap-1 bg-[#1b1b20] border border-[#ffdd4c]/20 px-3 py-1 rounded-full">
                            <Zap className="text-[#ffdd4c]" size={14} />
                            <span className="text-xs font-bold text-[#ffdd4c]">
                              +{quest.goldReward} G
                            </span>
                          </div>
                        )}
                      </div>
                      {isInProgress && (
                        <button
                          className="px-6 py-2 border border-[#00d4ff] text-[#a8e8ff] text-xs font-bold rounded uppercase hover:bg-[#00d4ff]/10 transition-colors w-full md:w-auto"
                          disabled
                        >
                          IN PROGRESS
                        </button>
                      )}
                      {isCompleted && (
                        <button
                          onClick={() => handleClaim(quest.id)}
                          className="px-8 py-2 bg-[#00d4ff] text-[#003642] text-xs font-bold rounded uppercase hover:bg-[#b4ebff] transition-colors shadow-[0_0_15px_rgba(0,212,255,0.6)] w-full md:w-auto font-bold tracking-widest"
                        >
                          CLAIM REWARD
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </section>
      </main>
    </div>
  )
}