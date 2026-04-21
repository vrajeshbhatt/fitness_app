import os
import asyncio
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client, Client

app = FastAPI(title="Calisthenics AI Engine")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "your-anon-key-here")

supabase: Optional[Client] = None

def get_supabase() -> Client:
    global supabase
    if supabase is None:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase

class ExerciseRecommendation(BaseModel):
    name: str
    muscle_group: str
    reps: int
    sets: int
    reason: str

class PlanResponse(BaseModel):
    user_id: str
    date: str
    recommendations: list[ExerciseRecommendation]
    focus_muscles: list[str]
    total_exercises: int

async def calculate_fatigue(supabase_client: Client, user_id: str) -> dict:
    three_days_ago = (datetime.now() - timedelta(days=3)).isoformat()
    
    response = supabase_client.table("workout_logs").select("""
        id,
        sets,
        reps,
        rpe,
        created_at,
        exercises (primary_muscle)
    """).eq("user_id", user_id).gte("created_at", three_days_ago).execute()
    
    if not response.data:
        return {}
    
    fatigue = {}
    for log in response.data:
        muscle = log.get("exercises", {}).get("primary_muscle", "Unknown")
        if muscle not in fatigue:
            fatigue[muscle] = 0
        fatigue[muscle] += log["sets"] * log["reps"] * (log.get("rpe", 5) / 10)
    
    return fatigue

async def get_recovered_muscles(supabase_client: Client, user_id: str) -> list[str]:
    three_days_ago = (datetime.now() - timedelta(days=3)).isoformat()
    
    response = supabase_client.table("workout_logs").select("""
        id,
        created_at,
        exercises (primary_muscle)
    """).eq("user_id", user_id).gte("created_at", three_days_ago).execute()
    
    trained_muscles = set()
    for log in response.data:
        muscle = log.get("exercises", {}).get("primary_muscle")
        if muscle:
            trained_muscles.add(muscle)
    
    all_exercises_response = supabase_client.table("exercises").select("id, name, primary_muscle, progression_tier").execute()
    if not all_exercises_response.data:
        return ["Push-up", "Pull-up", "Squat", "Plank"]
    
    all_muscles = set()
    for ex in all_exercises_response.data:
        all_muscles.add(ex["primary_muscle"])
    
    recovered = list(all_muscles - trained_muscles)
    if not recovered:
        return ["Pull-up", "Push-up", "Squat"]
    
    return recovered

async def get_user_fitness_level(supabase_client: Client, user_id: str) -> str:
    response = supabase_client.table("users").select("fitness_level").eq("id", user_id).execute()
    if response.data and response.data[0].get("fitness_level"):
        return response.data[0]["fitness_level"]
    return "beginner"

@app.get("/generate-plan/{user_id}", response_model=PlanResponse)
async def generate_plan(user_id: str):
    supabase_client = get_supabase()
    
    recovered_muscles = await get_recovered_muscles(supabase_client, user_id)
    fitness_level = await get_user_fitness_level(supabase_client, user_id)
    
    fatigue = await calculate_fatigue(supabase_client, user_id)
    
    exercises_response = supabase_client.table("exercises").select("id, name, primary_muscle, secondary_muscle, progression_tier").execute()
    
    if not exercises_response.data:
        return PlanResponse(
            user_id=user_id,
            date=datetime.now().isoformat(),
            recommendations=[
                ExerciseRecommendation(
                    name="Push-up",
                    muscle_group="Chest",
                    reps=10,
                    sets=3,
                    reason="Start with basics"
                )
            ],
            focus_muscles=recovered_muscles[:3],
            total_exercises=1
        )
    
    tier_map = {"beginner": 1, "intermediate": 2, "advanced": 3}
    max_tier = tier_map.get(fitness_level, 1)
    
    candidates = [
        ex for ex in exercises_response.data 
        if ex["primary_muscle"] in recovered_muscles and ex["progression_tier"] <= max_tier
    ]
    candidates.sort(key=lambda x: x["progression_tier"], reverse=True)
    
    recommendations = []
    shown_muscles = set()
    
    for ex in candidates:
        if ex["primary_muscle"] not in shown_muscles and len(recommendations) < 5:
            muscle = ex["primary_muscle"]
            shown_muscles.add(muscle)
            
            fatigue_score = fatigue.get(muscle, 0)
            if fatigue_score < 50:
                reps = 12 if fitness_level == "beginner" else 15
                reason = "Fully recovered - increase volume"
            elif fatigue_score < 100:
                reps = 8
                reason = "Moderate fatigue - standard reps"
            else:
                reps = 6
                reason = "Recently trained - deload"
            
            if ex["progression_tier"] == max_tier:
                reps = max(reps - 2, 4)
            
            recommendations.append(ExerciseRecommendation(
                name=ex["name"],
                muscle_group=muscle,
                reps=reps,
                sets=3,
                reason=reason
            ))
    
    if len(recommendations) < 3:
        fallback_exercises = [
            ExerciseRecommendation(name="Push-up", muscle_group="Chest", reps=10, sets=3, reason="Fundamental movement"),
            ExerciseRecommendation(name="Pull-up", muscle_group="Back", reps=8, sets=3, reason="Build back strength"),
            ExerciseRecommendation(name="Squat", muscle_group="Quadriceps", reps=15, sets=3, reason="Leg strength"),
        ]
        for fe in fallback_exercises:
            if len(recommendations) >= 5:
                break
            if not any(r.name == fe.name for r in recommendations):
                recommendations.append(fe)
    
    return PlanResponse(
        user_id=user_id,
        date=datetime.now().isoformat(),
        recommendations=recommendations,
        focus_muscles=recovered_muscles[:3],
        total_exercises=len(recommendations)
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)