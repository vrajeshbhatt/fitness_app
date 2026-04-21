'use client';

import { useState } from 'react';
import { exercises, type Exercise } from '@/utils/exercises';
import Link from 'next/link';
import { Search } from 'lucide-react';

const filterCategories = ['ALL', 'PUSH', 'PULL', 'LEGS', 'CORE'] as const;
type FilterCategory = typeof filterCategories[number];

function getExerciseCategory(exercise: Exercise): FilterCategory {
  const muscle = exercise.primaryMuscle;
  if (['Chest', 'Triceps', 'Shoulders'].includes(muscle)) return 'PUSH';
  if (['Back', 'Biceps'].includes(muscle)) return 'PULL';
  if (['Quadriceps', 'Glutes', 'Calves'].includes(muscle)) return 'LEGS';
  if (['Core'].includes(muscle)) return 'CORE';
  return 'ALL';
}

function getDifficultyBadge(difficulty: number): { label: string; class: string } {
  if (difficulty <= 3) return { label: 'E-RANK', class: 'bg-primary text-on-primary' };
  if (difficulty <= 6) return { label: 'D-RANK', class: 'bg-surface text-on-surface' };
  if (difficulty <= 8) return { label: 'C-RANK', class: 'bg-surface-container text-on-surface-variant border border-outline-variant' };
  return { label: 'B-RANK', class: 'bg-surface-container text-on-surface-variant border border-outline-variant' };
}

function getMuscleBadge(muscle: string): { label: string; class: string } {
  return {
    label: muscle.toUpperCase(),
    class: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'
  };
}

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterCategory>('ALL');
  
  const filtered = exercises.filter((ex: Exercise) => {
    const category = getExerciseCategory(ex);
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 md:px-6 py-6 space-y-4 border-b border-surface-container">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant text-on-surface placeholder:text-on-surface-variant text-base py-3 pl-12 pr-4 rounded focus:outline-none focus:border-primary focus:shadow-[0_1px_0_0_#a8e8ff] transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider ${
                filter === cat
                  ? 'bg-primary-container text-on-primary-container border border-primary'
                  : 'bg-surface-container text-on-surface-variant border border-outline-variant hover:border-primary/50 transition-colors'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-5 md:p-6">
        {filtered.map((ex: Exercise) => {
          const intermediateLevel = ex.levels.find(l => l.level === 'intermediate') || ex.levels[0];
          const difficulty = intermediateLevel?.difficulty || 5;
          const badge = getDifficultyBadge(difficulty);
          const muscleBadge = getMuscleBadge(ex.primaryMuscle);
          
          return (
            <Link key={ex.id} href={`/exercises/${ex.id}`}>
              <article className="bg-[#14141f] border border-cyan-900/50 rounded-lg overflow-hidden flex flex-col relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="h-32 bg-surface-container relative">
                  {intermediateLevel?.gifUrl ? (
                    <img 
                      src={intermediateLevel.gifUrl} 
                      alt={ex.name} 
                      className="w-full h-full object-cover opacity-70 mix-blend-luminosity" 
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="text-on-surface-variant text-4xl font-bold opacity-30">{ex.name[0]}</span>
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${badge.class}`}>
                    {badge.label}
                  </div>
                </div>
                <div className="p-3 flex-grow flex flex-col gap-1 z-10">
                  <h3 className="text-base font-semibold text-on-surface uppercase tracking-wide leading-tight">{ex.name}</h3>
                  <div className="flex gap-1 items-center mt-auto">
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase ${muscleBadge.class}`}>
                      {muscleBadge.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                      BODYWEIGHT
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}