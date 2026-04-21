'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Dumbbell, Clock, LogOut, ChevronRight, User, Bell } from 'lucide-react';

interface UserStats {
  totalXp: number;
  xpToNextLevel: number;
  level: number;
  gold: number;
  streak: number;
  workoutsCompleted: number;
}

export default function ProfilePage() {
  const [stats] = useState<UserStats>({
    totalXp: 8450,
    xpToNextLevel: 10000,
    level: 12,
    gold: 1240,
    streak: 14,
    workoutsCompleted: 87,
  });
  const [preferences, setPreferences] = useState({
    equipment: 'bodyweight' as 'bodyweight' | 'equipment',
    fitnessLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    goal: 'muscle' as 'muscle' | 'weightloss' | 'endurance',
    workoutDays: 4,
    notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          const fitnessLevelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
            beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced'
          };
          const goalMap: Record<string, 'muscle' | 'weightloss' | 'endurance'> = {
            build_muscle: 'muscle', lose_weight: 'weightloss', endurance: 'endurance'
          };
          setPreferences(prev => ({
            ...prev,
            fitnessLevel: fitnessLevelMap[data.fitness_level as string] || 'intermediate',
            goal: goalMap[data.goal as string] || 'muscle',
            workoutDays: data.workout_days_per_week || 4,
          }));
        }

        setLoading(false);
    };

    loadData();
  }, [supabase, router]);

  const getRankTitle = (level: number) => {
    if (level < 10) return 'F-Rank Hunter';
    if (level < 20) return 'E-Rank Hunter';
    if (level < 30) return 'D-Rank Hunter';
    if (level < 40) return 'C-Rank Hunter';
    if (level < 50) return 'B-Rank Hunter';
    if (level < 60) return 'A-Rank Hunter';
    return 'S-Rank Hunter';
  };

  const xpProgress = (stats.totalXp / stats.xpToNextLevel) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading uppercase tracking-widest font-bold text-primary">SYSTEM STATUS</h1>
          <button className="text-primary hover:text-primary/80 transition-colors">
            <Bell size={24} />
          </button>
        </div>

        <section className="flex flex-col items-center mb-10 relative">
          <div className="w-32 h-32 rounded-full border-2 border-primary shadow-glow overflow-hidden relative z-10 p-1 bg-surface-highest">
            <div className="w-full h-full rounded-full overflow-hidden bg-surface">
              <div className="w-full h-full bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                <User className="text-slate-500 w-16 h-16" />
              </div>
            </div>
          </div>
          <div className="absolute top-28 z-20 bg-surface border border-tertiary px-3 py-1 rounded shadow-glow-tertiary">
            <span className="text-xs font-bold text-tertiary tracking-widest">LVL {stats.level}</span>
          </div>
          <h2 className="font-heading text-4xl font-bold text-on-background mt-6 text-center tracking-tight">
            {getRankTitle(stats.level)}
          </h2>
          <p className="text-primary mt-1 text-center font-medium">Shadow Striker</p>
        </section>

        <section className="grid grid-cols-2 gap-3 mb-10">
          <div className="col-span-2 bg-surface border border-outline-variant rounded-lg p-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Experience</span>
              <span className="font-heading text-2xl text-primary">
                {stats.totalXp.toLocaleString()} <span className="text-on-surface-variant text-sm">/ {stats.xpToNextLevel.toLocaleString()}</span>
              </span>
            </div>
            <div className="h-3 w-full bg-surface-highest rounded-full overflow-hidden border border-outline-variant/50">
              <div
                className="h-full bg-gradient-to-r from-primary-fixed-dim to-primary shadow-glow-primary"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col justify-between aspect-[4/3]">
            <Dumbbell className="text-tertiary text-3xl mb-auto" size={28} />
            <div>
              <span className="text-xs font-bold text-on-surface-variant block mb-1">Gold Coins</span>
              <span className="font-heading text-2xl text-tertiary">{stats.gold.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col justify-between aspect-[4/3] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/10 rounded-full blur-xl" />
            <Clock className="text-error text-3xl mb-auto relative z-10" size={28} />
            <div className="relative z-10">
              <span className="text-xs font-bold text-on-surface-variant block mb-1">Daily Streak</span>
              <span className="font-heading text-2xl text-on-background">
                {stats.streak} <span className="text-sm text-on-surface-variant font-normal">Days</span>
              </span>
            </div>
          </div>

          <div className="col-span-2 bg-surface border border-outline-variant rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/50">
                <Dumbbell className="text-secondary" size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface-variant block mb-1">Quests Completed</span>
                <span className="font-heading text-2xl text-on-background">{stats.workoutsCompleted}</span>
              </div>
            </div>
            <button className="text-xs font-bold text-primary border border-primary/30 px-3 py-1 rounded hover:bg-primary/10 transition-colors">
              VIEW LOG
            </button>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-xs font-bold text-on-surface-variant mb-4 tracking-widest border-b border-outline-variant/50 pb-2">
            COMBAT PREFERENCES
          </h3>
          <div className="space-y-4">
            <div className="bg-surface border border-outline-variant rounded-lg p-2 flex gap-2">
              <button
                onClick={() => setPreferences(p => ({ ...p, equipment: 'bodyweight' }))}
                className={`flex-1 py-3 rounded bg-primary/10 border border-primary text-primary text-xs font-bold flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(168,232,255,0.1)] transition-all ${
                  preferences.equipment !== 'bodyweight' ? 'opacity-50' : ''
                }`}
              >
                BODYWEIGHT
              </button>
              <button
                onClick={() => setPreferences(p => ({ ...p, equipment: 'equipment' }))}
                className={`flex-1 py-3 rounded bg-surface border border-transparent hover:border-outline-variant text-on-surface-variant text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  preferences.equipment !== 'equipment' ? 'opacity-50' : ''
                }`}
              >
                EQUIPMENT
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Class Level</label>
                <div className="flex gap-1">
                  {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setPreferences(p => ({ ...p, fitnessLevel: level }))}
                      className={`flex-1 py-2 rounded text-xs font-bold capitalize transition-all ${
                        preferences.fitnessLevel === level
                          ? 'bg-primary/10 border border-primary text-primary'
                          : 'bg-surface border border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant">Primary Quest</label>
                <div className="flex gap-1">
                  {(['muscle', 'weightloss', 'endurance'] as const).map(goal => (
                    <button
                      key={goal}
                      onClick={() => setPreferences(p => ({ ...p, goal }))}
                      className={`flex-1 py-2 rounded text-xs font-bold capitalize transition-all ${
                        preferences.goal === goal
                          ? 'bg-primary/10 border border-primary text-primary'
                          : 'bg-surface border border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      {goal === 'muscle' ? 'Musc' : goal === 'weightloss' ? 'Loss' : 'Endur'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant">Weekly Workout Goal</label>
              <div className="flex gap-2">
                {[3, 4, 5, 6].map(days => (
                  <button
                    key={days}
                    onClick={() => setPreferences(p => ({ ...p, workoutDays: days }))}
                    className={`flex-1 py-3 rounded text-xs font-bold transition-all ${
                      preferences.workoutDays === days
                        ? 'bg-primary/10 border border-primary text-primary'
                        : 'bg-surface border border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {days}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-on-surface-variant mb-4 tracking-widest border-b border-outline-variant/50 pb-2">
            SYSTEM SETTINGS
          </h3>
          <div className="flex flex-col gap-3">
            <button className="w-full bg-surface border border-outline-variant rounded-lg p-4 flex items-center justify-between hover:bg-surface-highest transition-colors">
              <div className="flex items-center gap-3">
                <User className="text-on-surface-variant" size={20} />
                <span className="text-on-background">Hunter Profile Details</span>
              </div>
              <ChevronRight className="text-outline" size={20} />
            </button>

            <button
              onClick={() => setPreferences(p => ({ ...p, notifications: !preferences.notifications }))}
              className="w-full bg-surface border border-outline-variant rounded-lg p-4 flex items-center justify-between hover:bg-surface-highest transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="text-on-surface-variant" size={20} />
                <span className="text-on-background">Alerts & Transmissions</span>
              </div>
              <div
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  preferences.notifications ? 'bg-primary' : 'bg-outline'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.notifications ? 'left-7' : 'left-1'
                  }`}
                />
              </div>
            </button>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="w-full mt-3 bg-error-container/20 border border-error/50 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-error-container/40 transition-colors group"
            >
              <LogOut className="text-error group-hover:scale-110 transition-transform" size={20} />
              <span className="text-xs font-bold text-error tracking-widest">DISCONNECT SYSTEM</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
