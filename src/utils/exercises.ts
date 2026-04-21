export interface ExerciseLevel {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'pro';
  description: string;
  instructions: string[];
  gifUrl: string;
  targetMuscles: string[];
  difficulty: number;
}

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  levels: ExerciseLevel[];
}

export const exercises: Exercise[] = [
  // PUSH EXERCISES
  {
    id: 'push-up',
    name: 'Push-Up',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    levels: [
      {
        id: 'push-up-beginner',
        name: 'Wall Push-Up',
        level: 'beginner',
        description: 'Push-up against a wall - easiest variation',
        instructions: [
          "Stand facing a wall, arm's length away",
          'Place palms on wall at shoulder height',
          'Keep body straight, lean toward wall',
          'Push back to starting position',
          'Repeat for prescribed reps'
        ],
        gifUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q0eHhycTdpNXhnaHozMTVnaXJlOXJrMWt3MDh4c2Q4eDByYjg2MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3ohze1qkqPZHMrEuwo/200.gif',
        targetMuscles: ['Chest', 'Triceps'],
        difficulty: 2
      },
      {
        id: 'push-up-intermediate',
        name: 'Standard Push-Up',
        level: 'intermediate',
        description: 'Classic push-up on floor',
        instructions: [
          'Start in plank position, hands shoulder-width apart',
          'Lower chest to floor, elbows at 45° angle',
          'Keep core tight, body in straight line',
          'Push back up to starting position',
          'Repeat for prescribed reps'
        ],
        gifUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q0eHhycTdpNXhnaHozMTVnaXJlOXJrMWt3MDh4c2Q4eDByYjg2MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Dv5qzri4zAFEs/200.gif',
        targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
        difficulty: 5
      },
      {
        id: 'push-up-pro',
        name: 'Diamond Push-Up',
        level: 'pro',
        description: 'Hands together forming diamond - tricep focused',
        instructions: [
          'Start in plank, hands together forming diamond shape',
          'Lower chest to hands, elbows close to body',
          'Keep core tight throughout',
          'Push back up explosively',
          'Repeat for prescribed reps'
        ],
        gifUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q0eHhycTdpNXhnaHozMTVnaXJlOXJrMWt3MDh4c2Q4eDByYjg2MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tmhKEu9RHR1nBwYJ0X/200.gif',
        targetMuscles: ['Chest', 'Triceps'],
        difficulty: 8
      }
    ]
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-Up',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps'],
    levels: [
      {
        id: 'pike-beginner',
        name: 'Elevated Pike Push-Up',
        level: 'beginner',
        description: 'Hands elevated on surface',
        instructions: [
          'Set hands on elevated surface',
          'Walk feet back, hips high',
          'Lower head toward surface',
          'Push back',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Shoulders'],
        difficulty: 3
      },
      {
        id: 'pike-intermediate',
        name: 'Standard Pike Push-Up',
        level: 'intermediate',
        description: 'Standard pike position',
        instructions: [
          'Start in mountain pose',
          'Walk hands toward head',
          'Lower crown to floor',
          'Push back',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Shoulders', 'Triceps'],
        difficulty: 6
      },
      {
        id: 'pike-pro',
        name: 'Wall Handstand Push-Up',
        level: 'pro',
        description: 'Against wall for handstand push-up',
        instructions: [
          'Kick up to wall in handstand',
          'Lower head toward wall',
          'Push back',
          'Control throughout',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Shoulders', 'Triceps'],
        difficulty: 9
      }
    ]
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dip',
    primaryMuscle: 'Triceps',
    secondaryMuscles: ['Chest', 'Shoulders'],
    levels: [
      {
        id: 'dip-beginner',
        name: 'Bench Dip',
        level: 'beginner',
        description: 'Hands on bench',
        instructions: [
          'Sit on edge of bench',
          'Slide off, hands on bench edge',
          'Lower body by bending elbows',
          'Push back up',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Triceps'],
        difficulty: 3
      },
      {
        id: 'dip-intermediate',
        name: 'Floor Dip',
        level: 'intermediate',
        description: 'Hands on floor',
        instructions: [
          'Sit on floor',
          'Place hands beside hips',
          'Lift hips, lean back slightly',
          'Lower by bending elbows',
          'Push back up',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Triceps', 'Chest'],
        difficulty: 6
      },
      {
        id: 'dip-pro',
        name: 'Parallel Bar Dip',
        level: 'pro',
        description: 'Between parallel bars',
        instructions: [
          'Grip bars, lift body',
          'Lean slightly forward',
          'Lower body',
          'Push back up fully',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Triceps', 'Chest'],
        difficulty: 9
      }
    ]
  },
  // PULL EXERCISES
  {
    id: 'pull-up',
    name: 'Pull-Up',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    levels: [
      {
        id: 'pull-up-beginner',
        name: 'Assisted Pull-Up',
        level: 'beginner',
        description: 'With resistance band',
        instructions: [
          'Loop band over bar',
          'Place knee/foot in band',
          'Grip bar, pull up',
          'Lower slowly',
          'Repeat'
        ],
        gifUrl: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDdpMnVwdTl6bnAwbGtkazVuemI4cXpndHQ0a200MnY3aXh4a3R2dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUPGcD1LxZUkKUMOB2/200.gif',
        targetMuscles: ['Back', 'Biceps'],
        difficulty: 4
      },
      {
        id: 'pull-up-intermediate',
        name: 'Standard Pull-Up',
        level: 'intermediate',
        description: 'Full pull-up',
        instructions: [
          'Grip bar slightly wider than shoulders',
          'Pull up explosively',
          'Chin over bar',
          'Lower with control',
          'Repeat'
        ],
        gifUrl: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDdpMnVwdTl6bnAwbGtkazVuemI4cXpndHQ0a200MnY3aXh4a3R2dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gaiyVwiUzdaY8/200.gif',
        targetMuscles: ['Back', 'Biceps'],
        difficulty: 7
      },
      {
        id: 'pull-up-pro',
        name: 'Muscle-Up',
        level: 'pro',
        description: 'Pull-up transitioning over bar',
        instructions: [
          'Explosive pull-up',
          'Transition over bar',
          'Press to straight arms',
          'Lower with control',
          'Repeat'
        ],
        gifUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDdpMnVwdTl6bnAwbGtkazVuemI4cXpndHQ0a200MnY3aXh4a3R2dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/HMMwDkbqrtmZwQBNQB/200.gif',
        targetMuscles: ['Back', 'Chest', 'Biceps'],
        difficulty: 10
      }
    ]
  },
  {
    id: 'chin-up',
    name: 'Chin-Up',
    primaryMuscle: 'Biceps',
    secondaryMuscles: ['Back'],
    levels: [
      {
        id: 'chin-beginner',
        name: 'Assisted Chin-Up',
        level: 'beginner',
        description: 'With band',
        instructions: [
          'Use resistance band',
          'Underhand grip',
          'Pull up',
          'Lower',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Biceps', 'Back'],
        difficulty: 3
      },
      {
        id: 'chin-intermediate',
        name: 'Standard Chin-Up',
        level: 'intermediate',
        description: 'Underhand grip',
        instructions: [
          'Underhand grip',
          'Pull up',
          'Chin over bar',
          'Lower slowly',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Biceps', 'Back'],
        difficulty: 6
      },
      {
        id: 'chin-pro',
        name: 'Weighted Chin-Up',
        level: 'pro',
        description: 'With added weight',
        instructions: [
          'Add weight belt/vest',
          'Standard chin-up form',
          'Pull with added weight',
          'Lower controlled',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Biceps', 'Back'],
        difficulty: 9
      }
    ]
  },
  {
    id: 'rowing',
    name: 'Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Core'],
    levels: [
      {
        id: 'row-beginner',
        name: 'Doorframe Row',
        level: 'beginner',
        description: 'Using doorframe',
        instructions: [
          'Grip doorframe',
          'Lean back',
          'Pull chest to frame',
          'Return',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Back', 'Biceps'],
        difficulty: 2
      },
      {
        id: 'row-intermediate',
        name: 'Table/Inverted Row',
        level: 'intermediate',
        description: 'Under table or bar',
        instructions: [
          'Grip bar under table',
          'Incline position',
          'Pull chest to bar',
          'Lower with control',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Back', 'Biceps', 'Core'],
        difficulty: 5
      },
      {
        id: 'row-pro',
        name: 'Bar/Flag Row',
        level: 'pro',
        description: 'Single arm or flag',
        instructions: [
          'One hand grip',
          'Lean to side',
          'Pull to hip',
          'Lower controlled',
          'Repeat each side'
        ],
        gifUrl: '',
        targetMuscles: ['Back', 'Biceps'],
        difficulty: 8
      }
    ]
  },
  // LEG EXERCISES
  {
    id: 'squat',
    name: 'Squat',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Core'],
    levels: [
      {
        id: 'squat-beginner',
        name: 'Assisted Squat',
        level: 'beginner',
        description: 'Holding support',
        instructions: [
          'Stand holding support',
          'Feet shoulder width',
          'Squat down',
          'Stand back up',
          'Repeat'
        ],
        gifUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZW43bmNkdmduazJzb2VjM2locTdzOXA4cGh0em15NnlsbTdzcnpueiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3OBeP8JlGkQLtnr3ZW/200.gif',
        targetMuscles: ['Quadriceps', 'Glutes'],
        difficulty: 2
      },
      {
        id: 'squat-intermediate',
        name: 'Standard Squat',
        level: 'intermediate',
        description: 'Full range',
        instructions: [
          'Feet shoulder width',
          'Squat until thighs parallel',
          'Keep chest up',
          'Drive through heels',
          'Repeat'
        ],
        gifUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZW43bmNkdmduazJzb2VjM2locTdzOXA4cGh0em15NnlsbTdzcnpueiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tHyPJtOwPChKmF0LKg/giphy.gif',
        targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
        difficulty: 5
      },
      {
        id: 'squat-pro',
        name: 'Pistol Squat',
        level: 'pro',
        description: 'Single leg',
        instructions: [
          'Stand on one leg',
          'Extend other leg forward',
          'Squat on one leg',
          'Stand back up',
          'Repeat both sides'
        ],
        gifUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZW43bmNkdmduazJzb2VjM2locTdzOXA4cGh0em15NnlsbTdzcnpueiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13v55Ya4uWsXS/giphy.gif',
        targetMuscles: ['Quadriceps', 'Glutes'],
        difficulty: 10
      }
    ]
  },
  {
    id: 'lunge',
    name: 'Lunge',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes'],
    levels: [
      {
        id: 'lunge-beginner',
        name: 'Stationary Lunge',
        level: 'beginner',
        description: 'No stepping',
        instructions: [
          'Stand feet together',
          'Step forward into lunge',
          'Lower back knee',
          'Push back',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Quadriceps', 'Glutes'],
        difficulty: 3
      },
      {
        id: 'lunge-intermediate',
        name: 'Walking Lunge',
        level: 'intermediate',
        description: 'Step forward',
        instructions: [
          'Step forward',
          'Lower until both knees at 90°',
          'Push through front foot',
          'Step into next lunge',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
        difficulty: 6
      },
      {
        id: 'lunge-pro',
        name: 'Jump Lunge',
        level: 'pro',
        description: 'Explosive',
        instructions: [
          'Lunge position',
          'Explosive jump',
          'Switch legs mid-air',
          'Land softly',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Quadriceps', 'Glutes', 'Calves'],
        difficulty: 9
      }
    ]
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    primaryMuscle: 'Calves',
    secondaryMuscles: [],
    levels: [
      {
        id: 'calf-beginner',
        name: 'Double Leg Floor',
        level: 'beginner',
        description: 'Both feet on floor',
        instructions: [
          'Stand on flat ground',
          'Rise onto toes',
          'Hold briefly',
          'Lower slowly',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Calves'],
        difficulty: 1
      },
      {
        id: 'calf-intermediate',
        name: 'Single Leg Floor',
        level: 'intermediate',
        description: 'One leg',
        instructions: [
          'Stand on one leg',
          'Rise onto toes',
          'Hold at top',
          'Lower slowly',
          'Repeat both sides'
        ],
        gifUrl: '',
        targetMuscles: ['Calves'],
        difficulty: 4
      },
      {
        id: 'calf-pro',
        name: 'Single Leg Tip Toe',
        level: 'pro',
        description: 'In deep squat position',
        instructions: [
          'Deep squat hold',
          'Rise onto toes',
          'Hold extended',
          'Lower with control',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Calves'],
        difficulty: 8
      }
    ]
  },
  // CORE EXERCISES
  {
    id: 'plank',
    name: 'Plank',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Shoulders'],
    levels: [
      {
        id: 'plank-beginner',
        name: 'Knee Plank',
        level: 'beginner',
        description: 'On knees',
        instructions: [
          'Start on knees',
          'Forearms on ground',
          'Hold body straight',
          'Breathe steadily',
          'Hold for time'
        ],
        gifUrl: '',
        targetMuscles: ['Core', 'Shoulders'],
        difficulty: 2
      },
      {
        id: 'plank-intermediate',
        name: 'Standard Plank',
        level: 'intermediate',
        description: 'Full plank',
        instructions: [
          'Forearms and toes on ground',
          'Body in straight line',
          'Engage core',
          'Breathe steadily',
          'Hold for time'
        ],
        gifUrl: '',
        targetMuscles: ['Core', 'Shoulders'],
        difficulty: 4
      },
      {
        id: 'plank-pro',
        name: 'Extended Arm Plank',
        level: 'pro',
        description: 'Hands extended',
        instructions: [
          'Hands extended forward',
          'Body in straight line',
          'Engage core tight',
          'Breathe steadily',
          'Hold for time'
        ],
        gifUrl: '',
        targetMuscles: ['Core', 'Shoulders'],
        difficulty: 7
      }
    ]
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Hold',
    primaryMuscle: 'Core',
    secondaryMuscles: [],
    levels: [
      {
        id: 'hollow-beginner',
        name: 'Tuck Hollow',
        level: 'beginner',
        description: 'Knees tucked',
        instructions: [
          'Lie on back',
          'Tuck knees to chest',
          'Press lower back to floor',
          'Arms by sides',
          'Hold'
        ],
        gifUrl: '',
        targetMuscles: ['Core'],
        difficulty: 3
      },
      {
        id: 'hollow-intermediate',
        name: 'Standard Hollow',
        level: 'intermediate',
        description: 'Legs extended',
        instructions: [
          'Lie on back',
          'Extend legs, point toes',
          'Arms overhead',
          'Press lower back down',
          'Hold straight line'
        ],
        gifUrl: '',
        targetMuscles: ['Core'],
        difficulty: 6
      },
      {
        id: 'hollow-pro',
        name: 'Full Hollow Hold',
        level: 'pro',
        description: 'Arms and legs extended',
        instructions: [
          'Lie on back',
          'Full extension arms/legs',
          'Point toes away',
          'Press back to floor',
          'Hold hollow position'
        ],
        gifUrl: '',
        targetMuscles: ['Core'],
        difficulty: 9
      }
    ]
  },
  {
    id: 'leg-raise',
    name: 'Leg Raise',
    primaryMuscle: 'Core',
    secondaryMuscles: [],
    levels: [
      {
        id: 'leg-beginner',
        name: 'Knee Raise',
        level: 'beginner',
        description: 'Lying knee to chest',
        instructions: [
          'Lie on back',
          'Press lower back down',
          'Bring knees to chest',
          'Lower with control',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Core'],
        difficulty: 2
      },
      {
        id: 'leg-intermediate',
        name: 'Straight Leg Raise',
        level: 'intermediate',
        description: 'Legs straight',
        instructions: [
          'Lie on back',
          'Keep legs straight',
          'Raise to 90°',
          'Lower slowly',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Core'],
        difficulty: 5
      },
      {
        id: 'leg-pro',
        name: 'Hanging Leg Raise',
        level: 'pro',
        description: 'Bar hanging',
        instructions: [
          'Hang from bar',
          'Raise straight legs to bar',
          'Lower slowly',
          'Control throughout',
          'Repeat'
        ],
        gifUrl: '',
        targetMuscles: ['Core', 'Hip Flexors'],
        difficulty: 9
      }
    ]
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Quadriceps', 'Shoulders'],
    levels: [
      {
        id: 'mc-beginner',
        name: 'Slow Mountain Climber',
        level: 'beginner',
        description: 'Slow tempo',
        instructions: [
          'Plank position',
          'Drive one knee to chest slowly',
          'Return',
          'Switch legs',
          'Continue slowly'
        ],
        gifUrl: '',
        targetMuscles: ['Core', 'Quadriceps'],
        difficulty: 3
      },
      {
        id: 'mc-intermediate',
        name: 'Standard Mountain Climber',
        level: 'intermediate',
        description: 'Normal pace',
        instructions: [
          'Plank position',
          'Drive knee to chest',
          'Quick switch',
          'Keep core tight',
          'Continue'
        ],
        gifUrl: '',
        targetMuscles: ['Core', 'Quadriceps'],
        difficulty: 6
      },
      {
        id: 'mc-pro',
        name: 'Fast Mountain Climber',
        level: 'pro',
        description: 'High speed',
        instructions: [
          'Plank ready',
          'Drive knees rapidly',
          'Maximum speed',
          'Stay controlled',
          'Continue'
        ],
        gifUrl: '',
        targetMuscles: ['Core', 'Quadriceps', 'Shoulders'],
        difficulty: 9
      }
    ]
  }
];

export const muscleGroups = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 
  'Quadriceps', 'Glutes', 'Calves', 'Core'
];