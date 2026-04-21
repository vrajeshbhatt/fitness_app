import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const API_ENGINE_URL = process.env.API_ENGINE_URL || 'http://localhost:8000'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const response = await fetch(`${API_ENGINE_URL}/generate-plan/${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const fallback = {
        exercises: [
          { name: 'Push-up', muscle_group: 'Chest', reps: 10, sets: 3 },
          { name: 'Pull-up', muscle_group: 'Back', reps: 8, sets: 3 },
          { name: 'Squat', muscle_group: 'Quadriceps', reps: 15, sets: 3 },
        ]
      }
      return NextResponse.json(fallback)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    const fallback = {
      exercises: [
        { name: 'Push-up', muscle_group: 'Chest', reps: 10, sets: 3 },
        { name: 'Pull-up', muscle_group: 'Back', reps: 8, sets: 3 },
        { name: 'Squat', muscle_group: 'Quadriceps', reps: 15, sets: 3 },
      ]
    }
    return NextResponse.json(fallback)
  }
}