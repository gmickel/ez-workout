import { db } from '@/lib/db';
import {
  exerciseLogs,
  exercises,
  workoutLogs,
  workouts,
} from '@/models/schema';
import { desc, eq } from 'drizzle-orm';
// app/api/workouts/history/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const logs = await db
      .select({
        id: workoutLogs.id,
        date: workoutLogs.date,
        workoutName: workouts.name,
      })
      .from(workoutLogs)
      .innerJoin(workouts, eq(workoutLogs.workoutId, workouts.id))
      .orderBy(desc(workoutLogs.date))
      .limit(10);

    const logsWithExercises = await Promise.all(
      logs.map(async (log) => {
        const exerciseDetails = await db
          .select({
            name: exercises.name,
            weight: exerciseLogs.weight,
            reps: exerciseLogs.reps,
            notes: exerciseLogs.notes,
            skipped: exerciseLogs.skipped,
          })
          .from(exerciseLogs)
          .innerJoin(exercises, eq(exerciseLogs.exerciseId, exercises.id))
          .where(eq(exerciseLogs.workoutLogId, log.id));

        // Group exercises by name and format sets
        const groupedExercises = exerciseDetails.reduce(
          (acc, exercise) => {
            if (!acc[exercise.name]) {
              acc[exercise.name] = { name: exercise.name, sets: [] };
            }
            if (!exercise.skipped) {
              acc[exercise.name]?.sets.push({
                weight: exercise.weight,
                reps: exercise.reps,
              });
            }
            return acc;
          },
          {} as Record<
            string,
            {
              name: string;
              sets: Array<{ weight: number | null; reps: number | null }>;
            }
          >,
        );
        return {
          ...log,
          exercises: Object.values(groupedExercises),
        };
      }),
    );

    return NextResponse.json(logsWithExercises);
  } catch (error) {
    console.error('Error fetching workout history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout history' },
      { status: 500 },
    );
  }
}
