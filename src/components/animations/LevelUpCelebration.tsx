'use client';

import { useEffect, useState } from 'react';

interface LevelUpCelebrationProps {
  show: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpCelebration({ show, newLevel, onClose }: LevelUpCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{id: number; left: number; delay: number; color: string}>>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#00d4ff', '#ffd700', '#d2bbff', '#10b981'];
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfetti(pieces);
      setTimeout(onClose, 4000);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${piece.left}%`,
              top: '-10px',
              backgroundColor: piece.color,
              animation: `confetti-fall 3s ease-out ${piece.delay}s forwards`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center">
        <h1 
          className="text-6xl font-bold text-cyan-400 animate-pulse"
          style={{
            textShadow: '0 0 30px #00d4ff, 0 0 60px #00d4ff',
            animation: 'level-up-glow 0.5s ease-out'
          }}
        >
          LEVEL UP!
        </h1>
        <p className="mt-4 text-3xl text-white font-['Space_Grotesk']">
          Level {newLevel}
        </p>
        <p className="mt-2 text-xl text-yellow-400 font-['Space_Grotesk']">
          Rank Advanced!
        </p>
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes level-up-glow {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
