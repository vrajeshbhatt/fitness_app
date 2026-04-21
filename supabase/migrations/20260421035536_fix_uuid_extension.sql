-- Enable UUID extension with explicit schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- Drop existing tables if they exist (fresh start)
DROP TABLE IF EXISTS public.workout_logs CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Users table: Links to auth.users, includes fitness_level
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fitness_level VARCHAR(50) DEFAULT 'beginner' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table: Calisthenics exercises with progression tiers
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  primary_muscle VARCHAR(100) NOT NULL,
  secondary_muscle VARCHAR(100),
  progression_tier INT DEFAULT 1 CHECK (progression_tier >= 1 AND progression_tier <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout logs table: Individual workout entries
CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INT NOT NULL CHECK (sets >= 1),
  reps INT NOT NULL CHECK (reps >= 1),
  rpe INT NOT NULL CHECK (rpe >= 1 AND rpe <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Users: Users can only read/update their own profile
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Exercises: Everyone can read exercises (read-only public data)
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are viewable by everyone" ON public.exercises
  FOR SELECT USING (true);

-- Workout logs: Users can only read/write their own logs
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout logs" ON public.workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs" ON public.workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout logs" ON public.workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout logs" ON public.workout_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, fitness_level)
  VALUES (NEW.id, 'beginner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_workout_logs_user_id ON public.workout_logs(user_id);
CREATE INDEX idx_workout_logs_created_at ON public.workout_logs(created_at);
CREATE INDEX idx_workout_logs_user_created ON public.workout_logs(user_id, created_at);
CREATE INDEX idx_exercises_primary_muscle ON public.exercises(primary_muscle);
