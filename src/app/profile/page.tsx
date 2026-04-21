'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Dumbbell, Target, Clock } from 'lucide-react';

export default function ProfilePage() {
  const [preferences, setPreferences] = useState({
    fitnessLevel: 'intermediate',
    goal: 'muscle',
    workoutDays: 4,
    minutesPerWorkout: 45,
    injuries: [] as string[]
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
  const savePreferences = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-white">Custom Plan</h1>
        
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell className="text-blue-400" size={24} />
            <div>
              <h2 className="text-white font-semibold">Fitness Level</h2>
              <p className="text-slate-400 text-sm">Your current ability</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                onClick={() => setPreferences(p => ({ ...p, fitnessLevel: level }))}
                className={`flex-1 py-3 rounded-lg capitalize ${
                  preferences.fitnessLevel === level ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-green-400" size={24} />
            <div>
              <h2 className="text-white font-semibold">Goal</h2>
              <p className="text-slate-400 text-sm">What you want to achieve</p>
            </div>
          </div>
          <select 
            value={preferences.goal}
            onChange={(e) => setPreferences(p => ({ ...p, goal: e.target.value }))}
            className="w-full p-3 bg-slate-800 rounded-lg text-white"
          >
            <option value="muscle">Build Muscle</option>
            <option value="skills">Learn Skills</option>
            <option value="weightloss">Weight Loss</option>
            <option value="endurance">Endurance</option>
          </select>
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-yellow-400" size={24} />
            <div>
              <h2 className="text-white font-semibold">Workout Days</h2>
              <p className="text-slate-400 text-sm">Days per week</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[3, 4, 5, 6].map(days => (
              <button
                key={days}
                onClick={() => setPreferences(p => ({ ...p, workoutDays: days }))}
                className={`flex-1 py-3 rounded-lg ${
                  preferences.workoutDays === days ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {days}x
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-purple-400" size={24} />
            <div>
              <h2 className="text-white font-semibold">Duration</h2>
              <p className="text-slate-400 text-sm">Minutes per workout</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[30, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => setPreferences(p => ({ ...p, minutesPerWorkout: mins }))}
                className={`flex-1 py-3 rounded-lg ${
                  preferences.minutesPerWorkout === mins ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
        
        {saved && (
          <div className="bg-green-900/30 border border-green-800 rounded-lg p-3 text-green-400 text-center">
            Preferences saved! Generating your custom plan...
          </div>
        )}
        
        <button 
          onClick={savePreferences}
          disabled={saving}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold rounded-lg"
        >
          {saving ? 'Saving...' : 'Save & Generate Custom Plan'}
        </button>
      </div>
    </div>
  );
}