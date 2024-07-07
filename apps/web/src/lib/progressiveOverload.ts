import type { ExerciseLog } from '@/types';

type ExerciseTarget = {
  sets: number;
  reps: string;
};

export function suggestWeightIncrease(
  currentLog: ExerciseLog,
  previousLogs: ExerciseLog[],
  target: ExerciseTarget,
): number | null {
  if (currentLog.skipped) return null;

  const targetReps = Number.parseInt(target.reps.split('-')[1] ?? target.reps);

  if (currentLog.reps && currentLog.reps >= targetReps + 4) {
    const lastSetExceeded =
      previousLogs.length === 0 ||
      (previousLogs[previousLogs.length - 1]?.reps &&
        (previousLogs[previousLogs.length - 1]?.reps ?? 0) >= targetReps);

    if (lastSetExceeded) {
      const suggestedIncrease =
        Math.round(((currentLog.weight ?? 0) * 0.05) / 2) * 2;
      return (currentLog.weight ?? 0) + suggestedIncrease;
    }
  }

  return null;
}

export function applyProgressiveOverload(
  exerciseLogs: ExerciseLog[],
  exerciseTargets: Record<number, ExerciseTarget>,
): Record<number, number> {
  const weightSuggestions: Record<number, number> = {};

  for (const exerciseId in exerciseTargets) {
    const logs = exerciseLogs.filter(
      (log) => log.exerciseId === Number.parseInt(exerciseId) && !log.skipped,
    );
    const target = exerciseTargets[exerciseId];

    if (logs.length > 0) {
      const currentLog = logs[logs.length - 1];
      const previousLogs = logs.slice(0, -1);

      if (currentLog && target) {
        const suggestedWeight = suggestWeightIncrease(
          currentLog,
          previousLogs,
          target,
        );
        if (suggestedWeight) {
          weightSuggestions[Number.parseInt(exerciseId)] = suggestedWeight;
        }
      }
    }
  }

  return weightSuggestions;
}
