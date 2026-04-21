'use client';

import { useState } from 'react';
import { exercises } from '@/utils/exercises';
import { Dumbbell, ChevronLeft, Play } from 'lucide-react';
import Link from 'next/link';

export default function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const exercise = exercises.find(e => e.id === params.id);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'pro'>(
    exercise?.levels[1]?.level || 'intermediate'
  );
  
  if (!exercise) {
    return (
      <div className="min-h-screen bg-slate-950 p-4">
        <Link href="/exercises" className="flex items-center gap-2 text-slate-400 mb-4">
          <ChevronLeft size={20} /> Back to Exercises
        </Link>
        <h1 className="text-xl text-white">Exercise not found</h1>
      </div>
    );
  }
  
  const currentLevel = exercise.levels.find(l => l.level === selectedLevel) || exercise.levels[0];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="p-4">
        <Link href="/exercises" className="flex items-center gap-2 text-slate-400 mb-4">
          <ChevronLeft size={20} /> Back to Exercises
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-2">{exercise.name}</h1>
        <p className="text-slate-400 mb-6">{exercise.primaryMuscle}</p>
        
        <div className="aspect-video bg-slate-900 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
          {currentLevel.gifUrl ? (
            <img 
              src={currentLevel.gifUrl} 
              alt={currentLevel.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <Dumbbell className="text-slate-500" size={64} />
          )}
        </div>
        
        <div className="flex gap-2 mb-6">
          {exercise.levels.map((level) => (
            <button
              key={level.level}
              onClick={() => setSelectedLevel(level.level as 'beginner' | 'intermediate' | 'pro')}
              className={`flex-1 py-3 rounded-lg capitalize ${
                selectedLevel === level.level 
                  ? level.level === 'beginner' ? 'bg-green-600 text-white'
                    : level.level === 'intermediate' ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {level.level}
            </button>
          ))}
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4 mb-4">
          <h2 className="text-white font-semibold mb-2">{currentLevel.name}</h2>
          <p className="text-slate-400 text-sm mb-4">{currentLevel.description}</p>
          
          <h3 className="text-white font-medium mb-2">Instructions</h3>
          <ol className="space-y-2">
            {currentLevel.instructions.map((instruction, i) => (
              <li key={i} className="text-slate-300 text-sm flex gap-2">
                <span className="text-blue-400 font-medium">{i + 1}.</span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4">
          <h3 className="text-white font-medium mb-2">Target Muscles</h3>
          <div className="flex gap-2 flex-wrap">
            {currentLevel.targetMuscles.map((muscle) => (
              <span key={muscle} className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full text-sm">
                {muscle}
              </span>
            ))}
          </div>
        </div>
        
        <Link href="/log" className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <Play size={24} className="text-white" />
        </Link>
      </div>
    </div>
  );
}