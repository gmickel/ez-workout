import { db } from '@/lib/db';
import {
  type NewExerciseLog,
  type NewWorkoutLog,
  exerciseLogs,
  workoutLogs,
} from '@/models/schema';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { workoutId, exercises } = await request.json();

    // Start a transaction
    const result = await db.transaction(async (tx) => {
      const newWorkoutLog: NewWorkoutLog = { workoutId, userId: 1 }; // Replace with actual user ID
      const [workoutLog] = await tx
        .insert(workoutLogs)
        .values(newWorkoutLog)
        .returning();

      if (workoutLog?.id === undefined) {
        throw new Error('Failed to create workout log');
      }

      // Log each exercise
      for (const exercise of exercises) {
        const newExerciseLog: NewExerciseLog = {
          workoutLogId: workoutLog.id,
          exerciseId: exercise.exerciseId,
          weight: exercise.skipped ? null : exercise.weight,
          reps: exercise.skipped ? null : exercise.reps,
          notes: exercise.notes,
          skipped: exercise.skipped,
        };
        await tx.insert(exerciseLogs).values(newExerciseLog);
      }

      return workoutLog;
    });

    if (result?.id === undefined) {
      throw new Error('Failed to log workout');
    }

    return NextResponse.json({ success: true, workoutLogId: result.id });
  } catch (error) {
    console.error('Error logging workout:', error);
    return NextResponse.json(
      { error: 'Failed to log workout' },
      { status: 500 },
    );
  }
}
