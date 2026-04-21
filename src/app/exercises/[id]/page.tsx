'use client';

import { useState } from 'react';
import { exercises } from '@/utils/exercises';
import { ChevronLeft, PlayCircle, Dumbbell } from 'lucide-react';
import Link from 'next/link';

function getDifficultyRank(difficulty: number): { label: string; percentage: number } {
  if (difficulty <= 3) return { label: 'E-RANK', percentage: 30 };
  if (difficulty <= 5) return { label: 'D-RANK', percentage: 45 };
  if (difficulty <= 7) return { label: 'C-RANK', percentage: 60 };
  if (difficulty <= 8) return { label: 'B-RANK', percentage: 75 };
  return { label: 'A-RANK', percentage: 90 };
}

export default function ExerciseDetailPage({ params }: { params: { id: string } }) {
  const exercise = exercises.find(e => e.id === params.id);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'pro'>(
    exercise?.levels[1]?.level || 'intermediate'
  );
  
  if (!exercise) {
    return (
      <div className="min-h-screen bg-background p-6 pt-20">
        <Link href="/exercises" className="flex items-center gap-2 text-on-surface-variant mb-4">
          <ChevronLeft size={20} /> Back to Exercises
        </Link>
        <h1 className="text-xl text-on-surface">Exercise not found</h1>
      </div>
    );
  }
  
  const currentLevel = exercise.levels.find(l => l.level === selectedLevel) || exercise.levels[0];
  const difficultyRank = getDifficultyRank(currentLevel.difficulty);

  const allMuscles = [exercise.primaryMuscle, ...exercise.secondaryMuscles];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 md:px-0 md:max-w-screen-md md:mx-auto w-full flex flex-col gap-6 pt-4">
        <Link href="/exercises" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
          <ChevronLeft size={20} /> Back
        </Link>
        
        <section className="relative w-full aspect-[4/3] md:aspect-video rounded-xl overflow-hidden border border-outline-variant shadow-[0_4px_20px_rgba(0,212,255,0.05)] bg-surface-lowest">
          {currentLevel.gifUrl ? (
            <img 
              src={currentLevel.gifUrl} 
              alt={currentLevel.name}
              className="w-full h-full object-cover opacity-80 mix-blend-screen"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
              <Dumbbell className="text-on-surface-variant opacity-30" size={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 ring-1 ring-inset ring-primary-container/20 rounded-xl pointer-events-none"></div>
        </section>

        <section className="flex flex-col gap-2">
          <h1 className="font-heading text-[32px] leading-[1.2] tracking-[0.02em] font-bold text-on-background uppercase drop-shadow-[0_0_8px_rgba(168,232,255,0.2)]">
            {exercise.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {allMuscles.map((muscle) => (
              <span key={muscle} className="px-2 py-1 rounded bg-surface border border-outline-variant font-[length:var(--spacing-xs)] text-[12px] leading-[1.0] tracking-[0.1em] font-bold text-on-surface-variant uppercase">
                {muscle}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <div className="flex justify-between items-end px-1">
              <span className="text-[12px] leading-[1.0] tracking-[0.1em] font-bold text-outline uppercase tracking-widest">Threat Level</span>
              <span className="font-[length:var(--spacing-md)] text-[24px] leading-[1.0] font-bold text-tertiary">{difficultyRank.label}</span>
            </div>
            <div className="h-3 w-full bg-surface-lowest rounded-full overflow-hidden border border-outline-variant relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-tertiary-container to-tertiary rounded-full shadow-[0_0_12px_rgba(255,221,76,0.5)]"
                style={{ width: `${difficultyRank.percentage}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[2px]"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex rounded-lg bg-surface-highest border border-outline-variant p-1">
            {(['beginner', 'intermediate', 'pro'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 py-2 rounded font-[length:var(--spacing-xs)] text-[12px] leading-[1.0] tracking-[0.1em] font-bold uppercase transition-all ${
                  selectedLevel === level 
                    ? 'bg-primary-container/20 border border-primary text-primary-fixed shadow-[0_0_10px_rgba(0,212,255,0.15)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="relative bg-surface rounded-xl border border-outline-variant p-6 flex flex-col gap-6 overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <PlayCircle className="text-primary text-xl" size={20} />
                <h3 className="font-heading text-[20px] leading-[1.2] tracking-[0.01em] font-semibold text-on-surface uppercase">Execution Protocol</h3>
              </div>
              <ol className="list-decimal list-outside ml-4 flex flex-col gap-2 font-body text-[16px] leading-[1.6] text-on-surface-variant">
                {currentLevel.instructions.map((instruction, i) => (
                  <li key={i} className="pl-2">{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant to-transparent"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <PlayCircle className="text-secondary text-xl" size={20} />
                <h3 className="font-heading text-[20px] leading-[1.2] tracking-[0.01em] font-semibold text-on-surface uppercase">Primary Focus</h3>
              </div>
              <p className="font-body text-[16px] leading-[1.6] text-on-surface-variant">
                Essential conditioning for {currentLevel.targetMuscles.join(', ')}. Builds foundational strength required for progression.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-40 flex justify-center backdrop-blur-sm">
        <Link 
          href="/log" 
          className="w-full max-w-sm py-4 px-6 rounded-lg bg-primary text-on-primary font-heading text-[20px] leading-[1.2] tracking-[0.01em] font-semibold uppercase tracking-wider border border-primary-container shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:bg-primary-fixed transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <PlayCircle size={24} className="group-hover:scale-110 transition-transform" />
          Start Exercise
        </Link>
      </div>
    </div>
  );
}