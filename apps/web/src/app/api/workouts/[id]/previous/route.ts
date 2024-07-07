import { db } from '@/lib/db';
import { exerciseLogs, exercises, workoutLogs } from '@/models/schema';
import type { PreviousExerciseData } from '@/types';
import { and, desc, eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const workoutId = Number.parseInt(params.id);

  try {
    const result: Record<number, PreviousExerciseData> = {};

    // Get the exercises for this workout
    const workoutExercises = await db
      .select()
      .from(exercises)
      .where(eq(exercises.workoutId, workoutId));

    for (const exercise of workoutExercises) {
      // Get the most recent workout log for this exercise
      const [recentLog] = await db
        .select({
          workoutLogId: workoutLogs.id,
          date: workoutLogs.date,
        })
        .from(workoutLogs)
        .innerJoin(exerciseLogs, eq(exerciseLogs.workoutLogId, workoutLogs.id))
        .where(
          and(
            eq(workoutLogs.workoutId, workoutId),
            eq(exerciseLogs.exerciseId, exercise.id),
          ),
        )
        .orderBy(desc(workoutLogs.date))
        .limit(1);

      if (recentLog) {
        // Get the exercise logs for the most recent workout
        const logs = await db
          .select({
            weight: exerciseLogs.weight,
            reps: exerciseLogs.reps,
            notes: exerciseLogs.notes,
            skipped: exerciseLogs.skipped,
          })
          .from(exerciseLogs)
          .where(
            and(
              eq(exerciseLogs.workoutLogId, recentLog.workoutLogId),
              eq(exerciseLogs.exerciseId, exercise.id),
            ),
          );

        // Get recent notes (last 5)
        const recentNotes = logs
          .filter((log) => log.notes !== null)
          .map((log) => log.notes as string)
          .slice(-5);

        const weights = logs
          .map((log) => log.weight)
          .filter((w): w is number => w !== null);

        const lastSets = logs
          .map((log) => log.reps)
          .filter((r): r is number => r !== null);

        result[exercise.id] = {
          lastWorkoutDate: recentLog.date ? recentLog.date.toISOString() : null,
          lastWeight: weights.length > 0 ? Math.max(...weights) : null,
          lastSets,
          recentNotes,
          wasSkipped: logs.some((log) => log.skipped),
        };
      } else {
        // If no recent log found, set default values
        result[exercise.id] = {
          lastWorkoutDate: null,
          lastWeight: null,
          lastSets: [],
          recentNotes: [],
          wasSkipped: false,
        };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching previous workout data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch previous workout data' },
      { status: 500 },
    );
  }
}
