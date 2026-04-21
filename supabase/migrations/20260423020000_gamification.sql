-- Gamification tables for Calisthenics Quest

-- User progress with XP and gamification
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS gold INTEGER DEFAULT 0;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS hunter_rank VARCHAR(10) DEFAULT 'E';
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS last_quest_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Daily quests tracking
CREATE TABLE IF NOT EXISTS public.daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id VARCHAR(50) NOT NULL,
  quest_type VARCHAR(20) NOT NULL,
  progress INTEGER DEFAULT 0,
  target INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  quest_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_id, quest_date)
);

-- User achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL,
  progress INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- RLS Policies
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own quests" ON public.daily_quests;
CREATE POLICY "Users manage own quests" ON public.daily_quests FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own achievements" ON public.user_achievements;
CREATE POLICY "Users manage own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_quests_user_date ON public.daily_quests(user_id, quest_date);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);