'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Play } from 'lucide-react';

const dayTypes = ['Push', 'Pull', 'Legs', 'Rest'];

export default function PlanPage() {
  const [currentDay, setCurrentDay] = useState(1);
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

  const getDayType = (day: number) => dayTypes[(day - 1) % 4];

  const markDayComplete = async (day: number) => {
    if (day >= currentDay) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      await supabase.from('user_programs').upsert({
        user_id: user.id,
        current_day: day + 1,
        status: day + 1 > 30 ? 'completed' : 'active'
      }, { onConflict: 'user_id' });
      
      setCurrentDay(day + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-2">30-Day Muscle Builder</h1>
        <p className="text-slate-400 mb-4">Build muscle with progressive calisthenics</p>
        
        <div className="bg-slate-800 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(currentDay / 30) * 100}%` }}
          />
        </div>
        <p className="text-sm text-slate-400 mb-6">Day {currentDay} of 30</p>
        
        <div className="grid grid-cols-5 gap-2">
          {days.map((day) => {
            const type = getDayType(day);
            const isCompleted = day < currentDay;
            const isCurrent = day === currentDay;
            const isRest = type === 'Rest';
            
            return (
              <button
                key={day}
                onClick={() => !isRest && markDayComplete(day)}
                disabled={isRest}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors
                  ${isCompleted ? 'bg-green-600' : isCurrent ? 'bg-blue-600' : 'bg-slate-800'}
                  ${!isRest && !isCompleted && !isCurrent ? 'hover:bg-slate-700 cursor-pointer' : ''}
                  ${isRest ? 'opacity-50' : ''}
                `}
              >
                {isCompleted ? (
                  <CheckCircle size={16} className="text-white" />
                ) : (
                  <>
                    <span className="text-white font-bold">{day}</span>
                    <span className="text-white/70">{type.slice(0, 2)}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
        
        {currentDay <= 30 && (
          <Link href={`/plan/${currentDay}`} className="block mt-6">
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2">
              <Play size={20} />
              Start Day {currentDay}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}