-- Exercise levels table with 3 tiers: beginner, intermediate, pro
CREATE TABLE public.exercise_levels (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'pro')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT[],
  gif_url TEXT,
  target_muscles TEXT[],
  difficulty INT DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 30-Day programs table
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('muscle', 'skills', 'weightloss', 'custom')),
  duration_days INT DEFAULT 30,
  current_day INT DEFAULT 1,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program days table
CREATE TABLE public.program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  day_type VARCHAR(50) NOT NULL,
  exercises JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Progress photos table
CREATE TABLE public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  photo_type VARCHAR(50) NOT NULL,
  photo_url TEXT NOT NULL,
  day_number INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User custom plan preferences
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  fitness_level VARCHAR(50) DEFAULT 'intermediate',
  goal VARCHAR(100) DEFAULT 'muscle',
  workout_days_per_week INT DEFAULT 4,
  minutes_per_workout INT DEFAULT 45,
  equipment_available TEXT[] DEFAULT '{}',
  injuries TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.exercise_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own programs" ON public.programs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own days" ON public.program_days FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own photos" ON public.progress_photos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Exercise levels viewable by all" ON public.exercise_levels FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_programs_user_id ON public.programs(user_id);
CREATE INDEX idx_program_days_program_id ON public.program_days(program_id);
CREATE INDEX idx_progress_photos_user_id ON public.progress_photos(user_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
