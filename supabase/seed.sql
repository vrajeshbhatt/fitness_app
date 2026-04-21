-- Seed data for exercises
INSERT INTO public.exercises (name, primary_muscle, secondary_muscle, progression_tier) VALUES
-- Push exercises
('Push-up', 'Chest', 'Triceps', 1),
('Diamond Push-up', 'Chest', 'Triceps', 2),
('Archer Push-up', 'Chest', 'Triceps', 3),
('One-Arm Push-up', 'Chest', 'Triceps', 5),
('Pseudo Planche Push-up', 'Chest', 'Triceps', 4),

-- Pull exercises
('Pull-up', 'Back', 'Biceps', 1),
('Chin-up', 'Back', 'Biceps', 1),
('Archer Pull-up', 'Back', 'Biceps', 4),
('Muscle-up', 'Back', 'Chest', 5),
('Tuck Front Lever', 'Back', 'Core', 3),

-- Leg exercises
('Squat', 'Quadriceps', 'Glutes', 1),
('Bulgarian Split Squat', 'Quadriceps', 'Glutes', 2),
('Pistol Squat', 'Quadriceps', 'Glutes', 5),
('Lunge', 'Quadriceps', 'Glutes', 1),
('Calf Raise', 'Calves', NULL, 1),

-- Core exercises
('Plank', 'Core', NULL, 1),
('Hollow Hold', 'Core', NULL, 2),
('Dragon Flag', 'Core', NULL, 4),
('Human Flag', 'Core', NULL, 5),
('L-Sit', 'Core', 'Hip Flexors', 3),

-- Shoulder exercises
('Pike Push-up', 'Shoulders', 'Triceps', 2),
('Handstand Push-up', 'Shoulders', 'Triceps', 5),
('Wall Handstand Hold', 'Shoulders', 'Core', 2),
('Inverted Hang', 'Shoulders', NULL, 2),
('Pancake', 'Shoulders', 'Hip Flexors', 5);