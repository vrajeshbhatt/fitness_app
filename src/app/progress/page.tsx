'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Camera, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

export default function ProgressPage() {
  const [photos, setPhotos] = useState<{front: string | null, side: string | null, back: string | null}[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [viewMode, setViewMode] = useState<'daily' | 'comparison'>('daily');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const loadPhotos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    
    const { data } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('day_number');
    
    if (data && data.length > 0) {
      const grouped: Record<number, {front: string | null, side: string | null, back: string | null}> = {};
      data.forEach((photo: {photo_type: string, photo_url: string, day_number: number}) => {
        if (!grouped[photo.day_number]) {
          grouped[photo.day_number] = { front: null, side: null, back: null };
        }
        grouped[photo.day_number][photo.photo_type as 'front' | 'side' | 'back'] = photo.photo_url;
      });
      setPhotos(Object.values(grouped));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
  }, [supabase, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(fileName);

      await supabase.from('progress_photos').insert({
        user_id: user.id,
        photo_type: 'front',
        photo_url: publicUrl,
        day_number: selectedDay
      });

      await loadPhotos();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

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
          disabled={uploading}
          className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
        >
          {uploading ? (
            <Upload size={24} className="text-white animate-pulse" />
          ) : (
            <Camera size={24} className="text-white" />
          )}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          capture="environment"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}