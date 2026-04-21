'use client';

import { useState } from 'react';
import { exercises, muscleGroups, type Exercise } from '@/utils/exercises';
import Link from 'next/link';
import { Search, Dumbbell } from 'lucide-react';

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  const filtered = exercises.filter((ex: Exercise) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || ex.primaryMuscle === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Exercise Library</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {['all', ...muscleGroups].map((muscle) => (
            <button
              key={muscle}
              onClick={() => setFilter(muscle)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                filter === muscle ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {filtered.map((ex: Exercise) => (
          <Link key={ex.id} href={`/exercises/${ex.id}`}>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-blue-500 transition-colors h-full">
              <div className="aspect-square bg-slate-800 rounded-lg mb-3 flex items-center justify-center">
                {ex.levels[1]?.gifUrl ? (
                  <img src={ex.levels[1].gifUrl} alt={ex.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Dumbbell className="text-slate-500" size={32} />
                )}
              </div>
              <h3 className="font-semibold text-white mb-1">{ex.name}</h3>
              <p className="text-sm text-slate-400 mb-2">{ex.primaryMuscle}</p>
              <div className="flex gap-1 flex-wrap">
                {ex.levels.map((l) => (
                  <span key={l.level} className={`text-xs px-2 py-0.5 rounded ${
                    l.level === 'beginner' ? 'bg-green-900 text-green-400' :
                    l.level === 'intermediate' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-red-900 text-red-400'
                  }`}>
                    {l.level}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}