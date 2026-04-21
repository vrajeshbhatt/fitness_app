'use client';

import { useState, useEffect } from 'react';

interface QuestCompleteProps {
  show: boolean;
  xpEarned: number;
  goldEarned: number;
  onClose: () => void;
}

export function QuestComplete({ show, xpEarned, goldEarned, onClose }: QuestCompleteProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(onClose, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${exiting ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
      <div className="bg-green-900/90 backdrop-blur-md border border-green-500/50 rounded-lg px-6 py-4 flex items-center gap-4 shadow-lg shadow-green-500/20">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <p className="text-white font-semibold">Quest Complete!</p>
          <div className="flex gap-3 text-sm">
            <span className="text-cyan-400">+{xpEarned} XP</span>
            <span className="text-yellow-400">+{goldEarned} Gold</span>
          </div>
        </div>
      </div>
    </div>
  );
}
