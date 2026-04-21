'use client'

import Link from 'next/link'

const questData = {
  player: {
    level: 5,
    rank: 'E',
    className: 'Shadow Class',
    currentXp: 12450,
    maxXp: 15000,
    streak: 14,
    totalXp: '12.4K',
    gold: 850,
  },
  quests: [
    { id: 1, name: 'Morning Run (5km)', status: 'completed', xp: 500 },
    { id: 2, name: 'Strength Training', status: 'active', completed: 0, total: 4, xp: 800 },
    { id: 3, name: 'Evening Stretch', status: 'locked', unlockTime: '20:00', xp: 200 },
  ],
}



export default function HomeDashboard() {
  const xpPercent = (questData.player.currentXp / questData.player.maxXp) * 100

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-[100px] pt-[80px]">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-cyan-900/50 shadow-[0_4px_20px_rgba(0,212,255,0.1)]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border border-cyan-500/30 flex items-center justify-center bg-surface-container-highest shadow-[0_0_8px_rgba(0,212,255,0.3)]">
            <span className="font-heading text-primary-container font-bold text-glow">
              {questData.player.rank}
            </span>
          </div>
        </div>
        <h1 className="text-cyan-400 font-heading uppercase tracking-widest font-bold m-0 leading-none">
          SYSTEM STATUS
        </h1>
        <button className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer active:scale-95 duration-100 p-2">
          <span className="material-symbols-outlined">notifications_active</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <div className="bg-surface p-6 rounded-xl border border-surface-container-high relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/5 to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-primary-container/50 overflow-hidden shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                  <span className="text-3xl">🧙</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h2 className="font-heading text-[32px] text-on-surface m-0 uppercase tracking-wide">
                  Level {questData.player.level} Hunter
                </h2>
                <p className="font-body text-[16px] text-on-surface-variant m-0">{questData.player.className}</p>
                <div className="mt-2 flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-end">
                    <span className="font-heading text-[12px] text-primary-container font-bold leading-[1.0] tracking-[0.1em] uppercase">
                      XP PROGRESS
                    </span>
                    <span className="font-heading text-[12px] text-on-surface-variant font-bold leading-[1.0] tracking-[0.1em] uppercase">
                      {questData.player.currentXp.toLocaleString()} / {questData.player.maxXp.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant/30">
                    <div
                      className="h-full bg-gradient-to-r from-inverse-primary to-primary-container relative"
                      style={{ width: `${xpPercent}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-[2px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <div className="bg-surface p-4 rounded-lg border border-outline-variant/40 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-error/5 pointer-events-none" />
            <span className="material-symbols-outlined text-red-400 text-[32px]">local_fire_department</span>
            <span className="font-heading text-[24px] text-on-surface font-bold">{questData.player.streak}</span>
            <span className="font-heading text-[12px] text-on-surface-variant font-bold tracking-[0.1em] uppercase">
              STREAK
            </span>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-outline-variant/40 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-container/5 pointer-events-none" />
            <span className="material-symbols-outlined text-primary-container text-[32px]">star</span>
            <span className="font-heading text-[24px] text-on-surface font-bold">{questData.player.totalXp}</span>
            <span className="font-heading text-[12px] text-on-surface-variant font-bold tracking-[0.1em] uppercase">
              TOTAL XP
            </span>
          </div>
          <div className="bg-surface p-4 rounded-lg border border-outline-variant/40 flex flex-col items-center justify-center gap-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-tertiary/5 pointer-events-none" />
            <span className="material-symbols-outlined text-tertiary text-[32px]">toll</span>
            <span className="font-heading text-[24px] text-on-surface font-bold">{questData.player.gold}</span>
            <span className="font-heading text-[12px] text-on-surface-variant font-bold tracking-[0.1em] uppercase">
              GOLD
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="font-heading text-[20px] text-on-surface uppercase border-b border-surface-container-high pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">assignment</span>
            Today&apos;s Quests
          </h3>
          <div className="flex flex-col gap-2">
            {questData.quests[0].status === 'completed' && (
              <div className="bg-surface/50 p-4 rounded-lg border border-surface-container-highest flex items-center justify-between opacity-70 grayscale-[50%]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1b2a24] border border-[#2e5c46] flex items-center justify-center text-green-400">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-[20px] text-on-surface line-through decoration-on-surface-variant">
                      {questData.quests[0].name}
                    </span>
                    <span className="font-heading text-[12px] text-green-400 font-bold tracking-[0.1em] uppercase">
                      +{questData.quests[0].xp} XP Earned
                    </span>
                  </div>
                </div>
              </div>
            )}

            {questData.quests[1].status === 'active' && (
              <div className="bg-surface p-4 rounded-lg border border-primary-container shadow-[0_0_15px_rgba(0,212,255,0.2)] flex items-center justify-between relative overflow-hidden cursor-pointer hover:bg-surface-low transition-colors">
                <div className="absolute inset-y-0 left-0 w-1 bg-primary-container" />
                <div className="flex items-center gap-4 pl-2">
                  <div className="w-10 h-10 rounded-full bg-primary-container/10 border border-primary-container/50 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined">swords</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-[20px] text-primary-container text-glow">
                      {questData.quests[1].name}
                    </span>
                    <span className="font-heading text-[12px] text-on-surface-variant font-bold tracking-[0.1em] uppercase">
                      {questData.quests[1].completed} / {questData.quests[1].total} Sets Completed
                    </span>
                  </div>
                </div>
                <div className="font-heading text-[24px] text-primary-container font-bold">
                  {questData.quests[1].xp}{' '}
                  <span className="text-[14px] text-on-surface-variant font-normal">XP</span>
                </div>
              </div>
            )}

            {questData.quests[2].status === 'locked' && (
              <div className="bg-surface p-4 rounded-lg border border-outline-variant/30 flex items-center justify-between opacity-80 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/50 flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading text-[20px] text-on-surface-variant">
                      {questData.quests[2].name}
                    </span>
                    <span className="font-heading text-[12px] text-on-surface-variant font-bold tracking-[0.1em] uppercase">
                      Unlocks at {questData.quests[2].unlockTime}
                    </span>
                  </div>
                </div>
                <div className="font-heading text-[24px] text-on-surface-variant font-bold">
                  {questData.quests[2].xp}{' '}
                  <span className="text-[14px] font-normal">XP</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-cyan-900/50 shadow-[0_-4px_20px_rgba(0,212,255,0.15)]">
        <Link href="/" className="flex flex-col items-center justify-center text-cyan-400 bg-cyan-950/20 rounded-lg py-1 px-4 scale-110 transition-transform">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-heading text-[10px] uppercase font-bold tracking-tight mt-1">Home</span>
        </Link>
        <Link href="/log" className="flex flex-col items-center justify-center text-slate-600 grayscale hover:bg-slate-900/50 rounded-lg py-1 px-4 transition-colors">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-heading text-[10px] uppercase font-bold tracking-tight mt-1">Quests</span>
        </Link>
        <Link href="/exercises" className="flex flex-col items-center justify-center text-slate-600 grayscale hover:bg-slate-900/50 rounded-lg py-1 px-4 transition-colors">
          <span className="material-symbols-outlined">fitness_center</span>
          <span className="font-heading text-[10px] uppercase font-bold tracking-tight mt-1">Exercises</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center text-slate-600 grayscale hover:bg-slate-900/50 rounded-lg py-1 px-4 transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="font-heading text-[10px] uppercase font-bold tracking-tight mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  )
}