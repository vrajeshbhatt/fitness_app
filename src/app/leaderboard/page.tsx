'use client'

import { useState } from 'react'
import { Medal, Crown } from 'lucide-react'

type Period = 'weekly' | 'monthly' | 'all_time'

interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  xp: number
  isCurrentUser?: boolean
}

const mockData: Record<Period, LeaderboardEntry[]> = {
  weekly: [
    { rank: 1, username: 'IronMike', avatar: '🦾', xp: 2450, isCurrentUser: true },
    { rank: 2, username: 'FlexMaster', avatar: '💪', xp: 2320 },
    { rank: 3, username: 'PullupKing', avatar: '🏅', xp: 2180 },
    { rank: 4, username: 'PlankPro', avatar: '🎯', xp: 1950 },
    { rank: 5, username: 'DipQueen', avatar: '👑', xp: 1820 },
    { rank: 6, username: 'MuscleMax', avatar: '⚡', xp: 1650 },
    { rank: 7, username: 'CalisthenicsFan', avatar: '🔥', xp: 1480 },
    { rank: 8, username: 'StrengthSeeker', avatar: '🦁', xp: 1320 },
    { rank: 9, username: 'EnduranceElite', avatar: '⭐', xp: 1190 },
    { rank: 10, username: 'GainsGoblin', avatar: '👹', xp: 1050 },
  ],
  monthly: [
    { rank: 1, username: 'GainsGoblin', avatar: '👹', xp: 12500 },
    { rank: 2, username: 'IronMike', avatar: '🦾', xp: 11200, isCurrentUser: true },
    { rank: 3, username: 'FlexMaster', avatar: '💪', xp: 10800 },
    { rank: 4, username: 'PullupKing', avatar: '🏅', xp: 9650 },
    { rank: 5, username: 'PlankPro', avatar: '🎯', xp: 8900 },
    { rank: 6, username: 'DipQueen', avatar: '👑', xp: 8200 },
    { rank: 7, username: 'MuscleMax', avatar: '⚡', xp: 7500 },
    { rank: 8, username: 'CalisthenicsFan', avatar: '🔥', xp: 6800 },
    { rank: 9, username: 'StrengthSeeker', avatar: '🦁', xp: 6100 },
    { rank: 10, username: 'EnduranceElite', avatar: '⭐', xp: 5400 },
  ],
  all_time: [
    { rank: 1, username: 'FlexMaster', avatar: '💪', xp: 89500 },
    { rank: 2, username: 'IronMike', avatar: '🦾', xp: 78200, isCurrentUser: true },
    { rank: 3, username: 'PullupKing', avatar: '🏅', xp: 72100 },
    { rank: 4, username: 'DipQueen', avatar: '👑', xp: 65400 },
    { rank: 5, username: 'PlankPro', avatar: '🎯', xp: 58900 },
    { rank: 6, username: 'GainsGoblin', avatar: '👹', xp: 51200 },
    { rank: 7, username: 'MuscleMax', avatar: '⚡', xp: 44800 },
    { rank: 8, username: 'CalisthenicsFan', avatar: '🔥', xp: 39100 },
    { rank: 9, username: 'StrengthSeeker', avatar: '🦁', xp: 33400 },
    { rank: 10, username: 'EnduranceElite', avatar: '⭐', xp: 28700 },
  ],
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-md opacity-60 animate-pulse" />
        <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] relative z-10" />
      </div>
    )
  }
  if (rank === 2) {
    return <Medal className="w-8 h-8 text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.5)]" />
  }
  if (rank === 3) {
    return <Medal className="w-8 h-8 text-amber-700 drop-shadow-[0_0_6px_rgba(180,83,9,0.5)]" />
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#1f1f25] border border-[#35343a] flex items-center justify-center">
      <span className="text-sm font-bold text-[#859398]">{rank}</span>
    </div>
  )
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Period>('weekly')
  const entries = mockData[activeTab]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e1e9] pb-20">
      <main className="p-5 max-w-7xl mx-auto pt-[90px]">
        <section className="mb-6 mt-2">
          <h1 className="text-5xl font-bold text-[#ffdd4c] tracking-widest uppercase drop-shadow-[0_0_12px_rgba(255,221,76,0.4)]">
            LEADERBOARD
          </h1>
          <p className="text-[#bbc9cf] mt-1">Compete with the community and climb the ranks.</p>
        </section>

        <div className="flex gap-2 mb-6">
          {(['weekly', 'monthly', 'all_time'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setActiveTab(period)}
              className={`px-4 py-2 rounded font-bold text-xs tracking-widest whitespace-nowrap transition-all ${
                activeTab === period
                  ? 'bg-[#ffdd4c]/10 border border-[#ffdd4c] text-[#ffdd4c] shadow-[0_0_8px_rgba(255,221,76,0.2)]'
                  : 'border border-[#3c494e] bg-[#1f1f25] text-[#bbc9cf] hover:text-[#e4e1e9] hover:border-[#859398]'
              }`}
            >
              {period === 'all_time' ? 'ALL-TIME' : period.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {entries.map((entry) => {
            const isTopThree = entry.rank <= 3
            const isCurrentUser = entry.isCurrentUser

            return (
              <article
                key={entry.rank}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all group ${
                  isCurrentUser
                    ? 'bg-[#ffdd4c]/10 border border-[#ffdd4c]/30 shadow-[0_0_15px_rgba(255,221,76,0.1)]'
                    : isTopThree
                    ? 'bg-[#1b1b20] border border-[#3c494e] hover:border-[#ffdd4c]/30'
                    : 'bg-[#1f1f25] border border-[#2a292f] hover:border-[#3c494e]'
                }`}
              >
                <div className="w-12 flex justify-center">
                  <RankBadge rank={entry.rank} />
                </div>

                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isCurrentUser ? 'bg-[#ffdd4c]/20' : 'bg-[#2a292f]'
                  }`}
                >
                  {entry.avatar}
                </div>

                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold uppercase tracking-wider ${
                      isCurrentUser ? 'text-[#ffdd4c]' : 'text-[#e4e1e9]'
                    }`}
                  >
                    {entry.username}
                    {isCurrentUser && <span className="text-[#ffdd4c]/60 text-sm ml-2">(You)</span>}
                  </h3>
                  <p className="text-xs text-[#859398]">Rank #{entry.rank}</p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      isCurrentUser ? 'text-[#ffdd4c]' : isTopThree ? 'text-[#a8e8ff]' : 'text-[#bbc9cf]'
                    }`}
                  >
                    {entry.xp.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#859398] uppercase tracking-wider">XP</p>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}