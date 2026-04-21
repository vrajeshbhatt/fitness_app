'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Play } from 'lucide-react';

export default function PlanPage() {
  const [currentDay] = useState(1);
  
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const dayTypes = ['push', 'pull', 'legs', 'rest'];
  
  const getDayType = (day: number) => dayTypes[(day - 1) % 4];
  
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
            const isRest = type === 'rest';
            
            return (
              <Link key={day} href={isRest ? '#' : `/plan/${day}`}>
                <div className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors
                  ${isCompleted ? 'bg-green-600' : isCurrent ? 'bg-blue-600' : 'bg-slate-800'}
                  ${!isRest && !isCompleted && !isCurrent ? 'hover:bg-slate-700' : ''}
                `}>
                  {isCompleted ? (
                    <CheckCircle size={16} className="text-white" />
                  ) : (
                    <>
                      <span className="text-white font-bold">{day}</span>
                      <span className="text-white/70 capitalize">{type.slice(0, 2)}</span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        
        {currentDay < 30 && (
          <Link href={`/plan/${currentDay}`}>
            <button className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2">
              <Play size={20} />
              Start Day {currentDay}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}