'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Camera, ChevronLeft, ChevronRight, Upload, Plus } from 'lucide-react';

export default function ProgressPage() {
  const [photos, setPhotos] = useState<{front: string | null, side: string | null, back: string | null}[]>([]);
  const [selectedDay, setSelectedDay] = useState(42);
  const [viewMode, setViewMode] = useState<'daily' | 'comparison'>('daily');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState<'front' | 'side' | 'back'>('front');
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
        photo_type: currentPhotoType,
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

  const handleUploadClick = (photoType: 'front' | 'side' | 'back') => {
    setCurrentPhotoType(photoType);
    fileInputRef.current?.click();
  };

  const currentPhotos = photos[selectedDay - 1] || { front: null, side: null, back: null };
  
  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - (30 - selectedDay));
  const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="p-5 pt-6">
        <section className="flex flex-col gap-4 mb-8">
          <h2 className="font-heading text-4xl font-bold text-on-background tracking-tight">PROGRESS</h2>
          
          <div className="bg-surface-container rounded-lg p-1 flex gap-2 w-full max-w-sm border border-outline-variant/50 shadow-[0_0_15px_rgba(96,1,209,0.1)]">
            <button
              onClick={() => setViewMode('daily')}
              className={`flex-1 py-2 rounded transition-all font-heading text-xs tracking-widest ${
                viewMode === 'daily'
                  ? 'bg-secondary-container/20 border border-secondary-container text-secondary shadow-[0_0_10px_rgba(96,1,209,0.2)]'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              DAILY VIEW
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`flex-1 py-2 rounded transition-all font-heading text-xs tracking-widest ${
                viewMode === 'comparison'
                  ? 'bg-secondary-container/20 border border-secondary-container text-secondary shadow-[0_0_10px_rgba(96,1,209,0.2)]'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              WEEKLY COMP
            </button>
          </div>
        </section>

        {viewMode === 'daily' ? (
          <>
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                <button 
                  onClick={() => setSelectedDay(d => Math.max(1, d - 1))}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                  <span className="font-heading text-xl text-primary">DAY {selectedDay}</span>
                  <p className="text-on-surface-variant text-sm mt-1">{formattedDate}</p>
                </div>
                <button 
                  onClick={() => setSelectedDay(d => Math.min(90, d + 1))}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['front', 'side', 'back'] as const).map(angle => (
                  <div key={angle} className="relative aspect-[3/4] bg-surface-container rounded-xl border border-dashed border-outline flex flex-col items-center justify-center overflow-hidden group hover:bg-surface-variant transition-colors cursor-pointer"
                    onClick={() => handleUploadClick(angle)}
                  >
                    {currentPhotos[angle] ? (
                      <>
                        <img 
                          src={currentPhotos[angle]!} 
                          alt={`${angle} view`}
                          className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Camera className="text-outline" style={{ strokeWidth: 1 }} />
                        </div>
                        <span className="font-heading text-xs tracking-widest text-outline mt-2">ADD {angle.toUpperCase()} VIEW</span>
                      </>
                    )}
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="bg-surface-container-high/80 backdrop-blur px-2 py-1 rounded font-heading text-xs tracking-widest text-on-background border border-outline-variant">
                        {angle.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              <div className="bg-surface p-4 rounded border border-outline-variant flex flex-col gap-1">
                <span className="font-heading text-xs tracking-widest text-on-surface-variant">CURRENT WEIGHT</span>
                <span className="font-heading text-2xl text-primary">
                  185<span className="text-sm text-outline ml-1">LBS</span>
                </span>
              </div>
              <div className="bg-surface p-4 rounded border border-outline-variant flex flex-col gap-1">
                <span className="font-heading text-xs tracking-widest text-secondary">BODY FAT ESTIMATE</span>
                <span className="font-heading text-2xl text-secondary">
                  14<span className="text-sm text-outline ml-1">%</span>
                </span>
              </div>
              <div className="bg-surface p-4 rounded border border-outline-variant flex flex-col gap-1">
                <span className="font-heading text-xs tracking-widest text-on-surface-variant">STREAK</span>
                <span className="font-heading text-2xl text-on-background">
                  {selectedDay}<span className="text-sm text-outline ml-1">DAYS</span>
                </span>
              </div>
            </section>
          </>
        ) : (
          <section className="space-y-6">
            {[1, 2, 3, 4].map(week => (
              <div key={week}>
                <h3 className="text-on-background font-heading font-semibold mb-3">{weekLabels[week - 1]}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {(['front', 'side', 'back'] as const).map(angle => (
                    <div 
                      key={angle} 
                      className="aspect-[3/4] bg-surface-container rounded-xl border border-dashed border-outline flex flex-col items-center justify-center overflow-hidden group hover:bg-surface-variant transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedDay((week - 1) * 7 + 1);
                        handleUploadClick(angle);
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="text-outline" style={{ strokeWidth: 1 }} />
                      </div>
                      <span className="font-heading text-xs tracking-widest text-outline mt-2">{angle.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <button 
        onClick={() => {
          const types: ('front' | 'side' | 'back')[] = ['front', 'side', 'back'];
          const nextType = types[(types.indexOf(currentPhotoType) + 1) % 3];
          handleUploadClick(nextType);
        }}
        disabled={uploading}
        className="fixed bottom-20 right-5 w-14 h-14 bg-secondary-container rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(96,1,209,0.5)] hover:scale-110 transition-transform z-40 border border-secondary"
      >
        {uploading ? (
          <Upload size={24} className="text-secondary animate-pulse" />
        ) : (
          <Plus size={24} className="text-secondary" />
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
  );
}