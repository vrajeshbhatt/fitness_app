'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Play } from 'lucide-react';

const dayTypes: Record<number, string> = {
  1: 'Push Day',
  2: 'Pull Day',
  3: 'Leg Day',
  4: 'Rest Day',
  5: 'Push Day',
  6: 'Pull Day',
  7: 'Leg Day',
  8: 'Rest Day',
};

const dayTypeDescriptions: Record<string, string> = {
  'Push Day': 'Hypertrophy protocol targeting chest, shoulders, and triceps.',
  'Pull Day': 'Back and bicep focused hypertrophy for a balanced upper body.',
  'Leg Day': 'Lower body protocol for strength and muscular development.',
  'Rest Day': 'Recovery day. Light stretching and mobility work.',
};

export default function PlanPage() {
  const [currentDay, setCurrentDay] = useState(12);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    const loadProgram = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data } = await supabase
        .from('user_programs')
        .select('current_day')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (data) {
        setCurrentDay(data.current_day);
      }
      setLoading(false);
    };
    
    loadProgram();
  }, [supabase, router]);

  const getDayType = (day: number): string => {
    return dayTypes[(day - 1) % 8 + 1] || 'Rest Day';
  };

  const progress = (currentDay / 30) * 100;
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const currentDayType = getDayType(currentDay);
  const currentDescription = dayTypeDescriptions[currentDayType] || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-surface-tint/20">
        <div className="w-10 h-10 rounded-full border border-primary/30 overflow-hidden flex-shrink-0">
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-primary text-xs font-heading">AV</span>
          </div>
        </div>
        <h1 className="font-heading uppercase tracking-widest font-bold text-primary">SYSTEM STATUS</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-900/50 text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[24px]">notifications_active</span>
        </button>
      </header>

      <main className="pt-28 pb-24 px-5 w-full max-w-lg mx-auto flex flex-col gap-8 relative z-10">
        <section className="flex flex-col items-center text-center">
          <h2 className="font-heading text-[32px] font-bold text-on-surface drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">30-Day Transformation</h2>
          <p className="font-label-caps text-[12px] text-primary tracking-[0.2em] uppercase mt-2 opacity-80">Rank Advancement Protocol</p>
          
          <div className="relative w-48 h-48 mt-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-outline-variant/30 scale-[1.15]"></div>
            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" viewBox="0 0 100 100">
              <circle className="fill-none stroke-surface-container-high" cx="50" cy="50" r="46" strokeWidth="4"></circle>
              <circle 
                className="fill-none stroke-primary" 
                cx="50" 
                cy="50" 
                r="46" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                strokeWidth="4"
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-label-caps text-[12px] text-on-surface-variant uppercase mb-1">Day</span>
              <div className="flex items-baseline">
                <span className="font-stat-num text-[40px] text-on-surface drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{currentDay}</span>
                <span className="font-stat-num text-[20px] text-on-surface-variant">/30</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-surface-container rounded-xl border border-primary/40 p-6 flex flex-col items-center text-center gap-4 shadow-[0_0_20px_rgba(0,212,255,0.05)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-1 w-full">
            <span className="font-label-caps text-[12px] text-primary uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,212,255,1)]"></span>
              Current Objective
            </span>
            <h3 className="font-heading text-[20px] font-semibold text-on-surface mt-4">{currentDayType}</h3>
            <p className="font-body text-[16px] text-on-surface-variant mt-1 max-w-[280px]">{currentDescription}</p>
          </div>
          
          <Link href={`/plan/${currentDay}`} className="relative z-10 w-full mt-2">
            <button className="w-full py-4 px-6 bg-primary hover:bg-primary-fixed text-on-primary font-label-caps text-[12px] py-4 px-6 rounded uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(0,212,255,0.6)]">
              <Play size={20} />
              Start Today&apos;s Workout
            </button>
          </Link>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="font-heading text-[20px] font-semibold text-on-surface pl-3 border-l-2 border-primary">Program Matrix</h3>
          <div className="grid grid-cols-7 gap-y-2 gap-x-2 mt-2">
            {days.map((day) => {
              const type = getDayType(day);
              const isCompleted = day < currentDay;
              const isCurrent = day === currentDay;
              const isRest = type === 'Rest Day';
              
              if (isCompleted) {
                return (
                  <div 
                    key={day}
                    className="aspect-square rounded-full flex items-center justify-center bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] text-emerald-400 relative"
                  >
                    <span className="font-stat-num text-[14px]">{day}</span>
                  </div>
                );
              }
              
              if (isCurrent) {
                return (
                  <div 
                    key={day}
                    className="aspect-square rounded-full flex items-center justify-center bg-primary/20 border-2 border-primary text-primary shadow-[0_0_15px_rgba(0,212,255,0.6)] relative scale-110 z-10"
                  >
                    <span className="font-stat-num text-[16px] font-bold">{day}</span>
                  </div>
                );
              }
              
              if (isRest) {
                return (
                  <div 
                    key={day}
                    className="aspect-square rounded-full flex items-center justify-center bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.3)] text-orange-400"
                  >
                    <span className="font-stat-num text-[14px]">{day}</span>
                  </div>
                );
              }
              
              return (
                <div 
                  key={day}
                  className="aspect-square rounded-full flex items-center justify-center bg-surface border border-outline-variant text-on-surface-variant/50"
                >
                  <span className="font-stat-num text-[14px]">{day}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-surface-tint/20 md:hidden">
        <Link className="flex flex-col items-center justify-center text-slate-600 grayscale hover:bg-slate-900/50 rounded-lg p-2 transition-colors flex-1" href="/">
          <span className="material-symbols-outlined text-[24px] mb-1">grid_view</span>
          <span className="font-heading text-[10px] uppercase font-bold tracking-tighter">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-slate-600 grayscale hover:bg-slate-900/50 rounded-lg p-2 transition-colors flex-1" href="/quests">
          <span className="material-symbols-outlined text-[24px] mb-1">receipt_long</span>
          <span className="font-heading text-[10px] uppercase font-bold tracking-tighter">Quests</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_5px_rgba(0,212,255,0.6)] bg-primary/10 rounded-lg py-1 flex-1 scale-110 transition-transform duration-200 ease-out" href="/plan">
          <span className="material-symbols-outlined text-[24px] mb-1">fitness_center</span>
          <span className="font-heading text-[10px] uppercase font-bold tracking-tighter">Exercises</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-slate-600 grayscale hover:bg-slate-900/50 rounded-lg p-2 transition-colors flex-1" href="/profile">
          <span className="material-symbols-outlined text-[24px] mb-1">person</span>
          <span className="font-heading text-[10px] uppercase font-bold tracking-tighter">Profile</span>
        </Link>
      </nav>
    </div>
  );
}