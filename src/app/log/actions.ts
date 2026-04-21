'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logWorkout(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const exerciseId = formData.get('exercise_id') as string
  const sets = parseInt(formData.get('sets') as string)
  const reps = parseInt(formData.get('reps') as string)
  const rpe = parseInt(formData.get('rpe') as string)

  if (!exerciseId || !sets || !reps || !rpe) {
    throw new Error('All fields are required')
  }

  if (rpe < 1 || rpe > 10) {
    throw new Error('RPE must be between 1 and 10')
  }

  const { error } = await supabase.from('workout_logs').insert({
    user_id: user.id,
    exercise_id: exerciseId,
    sets,
    reps,
    rpe,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}