import { db } from '@/lib/db';
import { exercises, workouts } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fetchedWorkouts = await db.select().from(workouts);
    const workoutsWithExercises = await Promise.all(
      fetchedWorkouts.map(async (workout) => {
        const exercisesForWorkout = await db
          .select()
          .from(exercises)
          .where(eq(exercises.workoutId, workout.id));
        return { ...workout, exercises: exercisesForWorkout };
      }),
    );

    return NextResponse.json(workoutsWithExercises);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 },
    );
  }
}
