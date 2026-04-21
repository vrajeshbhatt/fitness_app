'use client';

import { useState, useEffect } from 'react';

interface AchievementUnlockProps {
  show: boolean;
  name: string;
  tier: string;
  onClose: () => void;
}

export function AchievementUnlock({ show, name, tier, onClose }: AchievementUnlockProps) {
  const [exiting, setExiting] = useState(false);

  const tierColors: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
  };

  const color = tierColors[tier] || '#ffd700';

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(onClose, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${exiting ? 'opacity-0 translate-x-4' : 'opacity-100'}`}>
      <div 
        className="rounded-lg p-4 flex items-center gap-3 shadow-lg"
        style={{ 
          backgroundColor: 'rgba(20, 20, 31, 0.95)',
          border: `2px solid ${color}`,
          boxShadow: `0 0 20px ${color}40`
        }}
      >
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <svg className="w-6 h-6" style={{ color }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Achievement Unlocked</p>
          <p className="text-white font-bold" style={{ color }}>{name}</p>
        </div>
      </div>
    </div>
  );
}
