export interface DayExercise {
  exerciseId: string;
  level: 'beginner' | 'intermediate' | 'pro';
  sets: number;
  reps: number;
  restSeconds: number;
}

export interface DayWorkout {
  day: number;
  type: 'push' | 'pull' | 'legs' | 'rest';
  name: string;
  exercises: DayExercise[];
  duration: number;
}

export const program30Day: DayWorkout[] = [
  // Week 1
  { day: 1, type: 'push', name: 'Push Day - Beginner', duration: 40, exercises: [
    { exerciseId: 'push-up', level: 'intermediate', sets: 3, reps: 10, restSeconds: 60 },
    { exerciseId: 'pike-push-up', level: 'beginner', sets: 3, reps: 8, restSeconds: 45 },
    { exerciseId: 'tricep-dip', level: 'beginner', sets: 3, reps: 8, restSeconds: 45 },
    { exerciseId: 'plank', level: 'intermediate', sets: 3, reps: 30, restSeconds: 30 }
  ]},
  { day: 2, type: 'pull', name: 'Pull Day - Beginner', duration: 40, exercises: [
    { exerciseId: 'pull-up', level: 'beginner', sets: 3, reps: 6, restSeconds: 60 },
    { exerciseId: 'chin-up', level: 'beginner', sets: 3, reps: 6, restSeconds: 60 },
    { exerciseId: 'rowing', level: 'beginner', sets: 3, reps: 10, restSeconds: 45 },
    { exerciseId: 'hollow-hold', level: 'beginner', sets: 3, reps: 20, restSeconds: 30 }
  ]},
  { day: 3, type: 'legs', name: 'Legs Day - Beginner', duration: 40, exercises: [
    { exerciseId: 'squat', level: 'intermediate', sets: 4, reps: 15, restSeconds: 60 },
    { exerciseId: 'lunge', level: 'beginner', sets: 3, reps: 10, restSeconds: 45 },
    { exerciseId: 'calf-raise', level: 'intermediate', sets: 3, reps: 20, restSeconds: 30 },
    { exerciseId: 'plank', level: 'intermediate', sets: 2, reps: 30, restSeconds: 30 }
  ]},
  { day: 4, type: 'rest', name: 'Rest Day', duration: 0, exercises: [] },
  { day: 5, type: 'push', name: 'Push Day', duration: 42, exercises: [
    { exerciseId: 'push-up', level: 'intermediate', sets: 4, reps: 10, restSeconds: 60 },
    { exerciseId: 'pike-push-up', level: 'intermediate', sets: 3, reps: 8, restSeconds: 45 },
    { exerciseId: 'tricep-dip', level: 'intermediate', sets: 3, reps: 10, restSeconds: 45 },
    { exerciseId: 'plank', level: 'intermediate', sets: 3, reps: 45, restSeconds: 30 }
  ]},
  { day: 6, type: 'pull', name: 'Pull Day', duration: 42, exercises: [
    { exerciseId: 'pull-up', level: 'intermediate', sets: 3, reps: 8, restSeconds: 60 },
    { exerciseId: 'rowing', level: 'intermediate', sets: 3, reps: 12, restSeconds: 45 },
    { exerciseId: 'chin-up', level: 'intermediate', sets: 3, reps: 8, restSeconds: 60 },
    { exerciseId: 'hollow-hold', level: 'intermediate', sets: 3, reps: 30, restSeconds: 30 }
  ]},
  { day: 7, type: 'legs', name: 'Legs Day', duration: 42, exercises: [
    { exerciseId: 'squat', level: 'intermediate', sets: 4, reps: 18, restSeconds: 60 },
    { exerciseId: 'lunge', level: 'intermediate', sets: 3, reps: 12, restSeconds: 45 },
    { exerciseId: 'calf-raise', level: 'intermediate', sets: 4, reps: 20, restSeconds: 30 },
    { exerciseId: 'mountain-climber', level: 'beginner', sets: 3, reps: 20, restSeconds: 30 }
  ]},
  // Week 2 - Increase intensity
  { day: 8, type: 'push', name: 'Push Day - Week 2', duration: 45, exercises: [
    { exerciseId: 'push-up', level: 'intermediate', sets: 4, reps: 12, restSeconds: 60 },
    { exerciseId: 'pike-push-up', level: 'intermediate', sets: 4, reps: 10, restSeconds: 45 },
    { exerciseId: 'tricep-dip', level: 'intermediate', sets: 4, reps: 12, restSeconds: 45 },
    { exerciseId: 'plank', level: 'pro', sets: 3, reps: 45, restSeconds: 30 }
  ]},
  { day: 9, type: 'pull', name: 'Pull Day - Week 2', duration: 45, exercises: [
    { exerciseId: 'pull-up', level: 'intermediate', sets: 4, reps: 8, restSeconds: 60 },
    { exerciseId: 'rowing', level: 'intermediate', sets: 4, reps: 12, restSeconds: 45 },
    { exerciseId: 'chin-up', level: 'intermediate', sets: 4, reps: 8, restSeconds: 60 },
    { exerciseId: 'hollow-hold', level: 'intermediate', sets: 3, reps: 40, restSeconds: 30 }
  ]},
  { day: 10, type: 'legs', name: 'Legs Day - Week 2', duration: 45, exercises: [
    { exerciseId: 'squat', level: 'intermediate', sets: 4, reps: 20, restSeconds: 60 },
    { exerciseId: 'lunge', level: 'intermediate', sets: 4, reps: 12, restSeconds: 45 },
    { exerciseId: 'calf-raise', level: 'intermediate', sets: 4, reps: 25, restSeconds: 30 },
    { exerciseId: 'mountain-climber', level: 'intermediate', sets: 3, reps: 25, restSeconds: 30 }
  ]},
  { day: 11, type: 'rest', name: 'Rest Day', duration: 0, exercises: [] },
  { day: 12, type: 'push', name: 'Push Day - Week 2', duration: 45, exercises: [
    { exerciseId: 'push-up', level: 'pro', sets: 3, reps: 10, restSeconds: 60 },
    { exerciseId: 'push-up', level: 'intermediate', sets: 3, reps: 12, restSeconds: 60 },
    { exerciseId: 'tricep-dip', level: 'pro', sets: 3, reps: 8, restSeconds: 45 },
    { exerciseId: 'plank', level: 'pro', sets: 3, reps: 60, restSeconds: 30 }
  ]},
  { day: 13, type: 'pull', name: 'Pull Day - Week 2', duration: 45, exercises: [
    { exerciseId: 'pull-up', level: 'intermediate', sets: 4, reps: 10, restSeconds: 60 },
    { exerciseId: 'rowing', level: 'intermediate', sets: 4, reps: 15, restSeconds: 45 },
    { exerciseId: 'chin-up', level: 'intermediate', sets: 4, reps: 10, restSeconds: 60 },
    { exerciseId: 'hollow-hold', level: 'pro', sets: 3, reps: 30, restSeconds: 30 }
  ]},
  { day: 14, type: 'legs', name: 'Legs Day - Week 2', duration: 45, exercises: [
    { exerciseId: 'squat', level: 'intermediate', sets: 4, reps: 20, restSeconds: 60 },
    { exerciseId: 'lunge', level: 'intermediate', sets: 4, reps: 15, restSeconds: 45 },
    { exerciseId: 'mountain-climber', level: 'intermediate', sets: 3, reps: 25, restSeconds: 30 },
    { exerciseId: 'leg-raise', level: 'intermediate', sets: 3, reps: 15, restSeconds: 30 }
  ]},
  // Week 3 - Advanced
  { day: 15, type: 'push', name: 'Push Day - Week 3', duration: 50, exercises: [
    { exerciseId: 'push-up', level: 'pro', sets: 4, reps: 12, restSeconds: 60 },
    { exerciseId: 'pike-push-up', level: 'pro', sets: 3, reps: 8, restSeconds: 45 },
    { exerciseId: 'tricep-dip', level: 'pro', sets: 4, reps: 12, restSeconds: 45 },
    { exerciseId: 'plank', level: 'pro', sets: 3, reps: 60, restSeconds: 45 }
  ]},
  { day: 16, type: 'pull', name: 'Pull Day - Week 3', duration: 50, exercises: [
    { exerciseId: 'pull-up', level: 'pro', sets: 3, reps: 8, restSeconds: 60 },
    { exerciseId: 'pull-up', level: 'intermediate', sets: 3, reps: 10, restSeconds: 60 },
    { exerciseId: 'rowing', level: 'pro', sets: 3, reps: 10, restSeconds: 45 },
    { exerciseId: 'hollow-hold', level: 'pro', sets: 3, reps: 45, restSeconds: 30 }
  ]},
  { day: 17, type: 'legs', name: 'Legs Day - Week 3', duration: 50, exercises: [
    { exerciseId: 'squat', level: 'intermediate', sets: 5, reps: 20, restSeconds: 60 },
    { exerciseId: 'lunge', level: 'pro', sets: 4, reps: 12, restSeconds: 45 },
    { exerciseId: 'mountain-climber', level: 'pro', sets: 3, reps: 30, restSeconds: 30 },
    { exerciseId: 'leg-raise', level: 'intermediate', sets: 4, reps: 15, restSeconds: 30 }
  ]},
  { day: 18, type: 'rest', name: 'Rest Day', duration: 0, exercises: [] },
  { day: 19, type: 'push', name: 'Push Day - Week 3', duration: 50, exercises: [
    { exerciseId: 'push-up', level: 'pro', sets: 4, reps: 15, restSeconds: 60 },
    { exerciseId: 'push-up', level: 'intermediate', sets: 3, reps: 15, restSeconds: 60 },
    { exerciseId: 'tricep-dip', level: 'pro', sets: 4, reps: 12, restSeconds: 45 },
    { exerciseId: 'plank', level: 'pro', sets: 3, reps: 75, restSeconds: 45 }
  ]},
  { day: 20, type: 'pull', name: 'Pull Day - Week 3', duration: 50, exercises: [
    { exerciseId: 'pull-up', level: 'pro', sets: 4, reps: 10, restSeconds: 60 },
    { exerciseId: 'chin-up', level: 'pro', sets: 3, reps: 8, restSeconds: 60 },
    { exerciseId: 'rowing', level: 'pro', sets: 3, reps: 12, restSeconds: 45 },
    { exerciseId: 'hollow-hold', level: 'pro', sets: 3, reps: 45, restSeconds: 30 }
  ]},
  { day: 21, type: 'legs', name: 'Legs Day - Week 3', duration: 50, exercises: [
    { exerciseId: 'squat', level: 'intermediate', sets: 5, reps: 25, restSeconds: 60 },
    { exerciseId: 'lunge', level: 'pro', sets: 4, reps: 15, restSeconds: 45 },
    { exerciseId: 'calf-raise', level: 'pro', sets: 4, reps: 30, restSeconds: 30 },
    { exerciseId: 'mountain-climber', level: 'pro', sets: 3, reps: 30, restSeconds: 30 }
  ]},
  // Week 4 - Challenge & Deload
  { day: 22, type: 'push', name: 'Push Day - Week 4', duration: 45, exercises: [
    { exerciseId: 'push-up', level: 'pro', sets: 3, reps: 12, restSeconds: 60 },
    { exerciseId: 'pike-push-up', level: 'intermediate', sets: 3, reps: 10, restSeconds: 45 },
    { exerciseId: 'plank', level: 'pro', sets: 3, reps: 60, restSeconds: 30 }
  ]},
  { day: 23, type: 'pull', name: 'Pull Day - Week 4', duration: 45, exercises: [
    { exerciseId: 'pull-up', level: 'intermediate', sets: 3, reps: 8, restSeconds: 60 },
    { exerciseId: 'rowing', level: 'intermediate', sets: 3, reps: 12, restSeconds: 45 },
    { exerciseId: 'hollow-hold', level: 'intermediate', sets: 3, reps: 40, restSeconds: 30 }
  ]},
  { day: 24, type: 'legs', name: 'Legs Day - Week 4', duration: 45, exercises: [
    { exerciseId: 'squat', level: 'intermediate', sets: 4, reps: 18, restSeconds: 60 },
    { exerciseId: 'lunge', level: 'intermediate', sets: 3, reps: 12, restSeconds: 45 },
    { exerciseId: 'mountain-climber', level: 'intermediate', sets: 3, reps: 25, restSeconds: 30 }
  ]},
  { day: 25, type: 'rest', name: 'Rest Day', duration: 0, exercises: [] },
  { day: 26, type: 'push', name: 'Push Day - Challenge', duration: 55, exercises: [
    { exerciseId: 'push-up', level: 'pro', sets: 5, reps: 15, restSeconds: 45 },
    { exerciseId: 'tricep-dip', level: 'pro', sets: 4, reps: 15, restSeconds: 45 },
    { exerciseId: 'plank', level: 'pro', sets: 3, reps: 90, restSeconds: 45 }
  ]},
  { day: 27, type: 'pull', name: 'Pull Day - Challenge', duration: 55, exercises: [
    { exerciseId: 'pull-up', level: 'pro', sets: 4, reps: 10, restSeconds: 45 },
    { exerciseId: 'chin-up', level: 'pro', sets: 4, reps: 10, restSeconds: 45 },
    { exerciseId: 'hollow-hold', level: 'pro', sets: 3, reps: 60, restSeconds: 30 }
  ]},
  { day: 28, type: 'legs', name: 'Legs Day - Challenge', duration: 55, exercises: [
    { exerciseId: 'squat', level: 'intermediate', sets: 5, reps: 25, restSeconds: 45 },
    { exerciseId: 'lunge', level: 'pro', sets: 4, reps: 15, restSeconds: 45 },
    { exerciseId: 'mountain-climber', level: 'pro', sets: 3, reps: 40, restSeconds: 30 }
  ]},
  { day: 29, type: 'push', name: 'Final Push Assessment', duration: 50, exercises: [
    { exerciseId: 'push-up', level: 'pro', sets: 4, reps: 20, restSeconds: 60 },
    { exerciseId: 'plank', level: 'pro', sets: 2, reps: 60, restSeconds: 30 }
  ]},
  { day: 30, type: 'rest', name: '30-Day Complete!', duration: 0, exercises: [] }
];

export type DayType = 'push' | 'pull' | 'legs' | 'rest';