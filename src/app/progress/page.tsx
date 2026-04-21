'use client';

import { useState, useRef } from 'react';
import { Camera, ChevronLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';

export default function ProgressPage() {
  const [photos, setPhotos] = useState<{front: string | null, side: string | null, back: string | null}[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [viewMode, setViewMode] = useState<'daily' | 'comparison'>('daily');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  
  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-2">Progress Photos</h1>
        <p className="text-slate-400 mb-6">Track your transformation daily</p>
        
        <div className="flex gap-2 mb-6">
          {['daily', 'comparison'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as 'daily' | 'comparison')}
              className={`flex-1 py-2 rounded-lg ${
                viewMode === mode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {mode === 'daily' ? 'Daily' : 'Comparison'}
            </button>
          ))}
        </div>
        
        {viewMode === 'daily' ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setSelectedDay(d => Math.max(1, d - 1))}
                className="p-2 bg-slate-800 rounded-lg"
              >
                <ChevronLeft className="text-white" />
              </button>
              <span className="text-white font-bold">Day {selectedDay}</span>
              <button 
                onClick={() => setSelectedDay(d => Math.min(30, d + 1))}
                className="p-2 bg-slate-800 rounded-lg"
              >
                <ChevronRight className="text-white" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {(['front', 'side', 'back'] as const).map(angle => (
                <div key={angle} className="aspect-square bg-slate-900 rounded-xl flex flex-col items-center justify-center overflow-hidden">
                  {photos[selectedDay - 1]?.[angle] ? (
                    <img 
                      src={photos[selectedDay - 1][angle]!} 
                      alt={angle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Camera className="text-slate-500 mb-2" size={32} />
                      <span className="text-slate-400 text-sm capitalize">{angle}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {[1, 2, 3, 4].map(week => (
              <div key={week}>
                <h3 className="text-white font-semibold mb-3">{weekLabels[week - 1]}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {(['front', 'side', 'back'] as const).map(angle => (
                    <div key={angle} className="aspect-square bg-slate-900 rounded-xl flex items-center justify-center">
                      <Camera className="text-slate-500" size={24} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Camera size={24} className="text-white" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          capture="environment"
        />
      </div>
    </div>
  );
}