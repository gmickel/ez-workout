import { applyProgressiveOverload } from '@/lib/progressiveOverload';
import type { ExerciseLog, PreviousExerciseData, Workout } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';
import { ProgressBar } from './ProgressBar';

type WorkoutLoggerProps = {
  workout: Workout;
  onComplete: () => void;
};

export function WorkoutLogger({
  workout,
  onComplete,
}: Readonly<WorkoutLoggerProps>) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [weightSuggestions, setWeightSuggestions] = useState<
    Record<number, number>
  >({});
  const [previousExerciseData, setPreviousExerciseData] = useState<
    Record<number, PreviousExerciseData>
  >({});

  useEffect(() => {
    fetchPreviousWorkoutData(workout.id);
  }, [workout.id]);

  const fetchPreviousWorkoutData = async (workoutId: number) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}/previous`);
      if (response.ok) {
        const data = await response.json();
        setPreviousExerciseData(data);
        calculateWeightSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching previous workout data:', error);
    }
  };

  const calculateWeightSuggestions = (
    prevData: Record<number, PreviousExerciseData>,
  ) => {
    const suggestions: Record<number, number> = {};
    for (const exercise of workout.exercises) {
      const prevExerciseData = prevData[exercise.id];
      if (prevExerciseData && prevExerciseData.lastSets.length > 0) {
        const lastSet =
          prevExerciseData.lastSets[prevExerciseData.lastSets.length - 1];
        const targetReps = Number.parseInt(
          exercise.reps.split('-')[1] ?? exercise.reps,
        );
        if (
          lastSet &&
          lastSet >= targetReps + 4 &&
          prevExerciseData.lastWeight
        ) {
          const suggestedIncrease =
            Math.round((prevExerciseData.lastWeight * 0.05) / 2) * 2;
          suggestions[exercise.id] =
            prevExerciseData.lastWeight + suggestedIncrease;
        }
      }
    }
    setWeightSuggestions(suggestions);
  };

  const handleLogSet = (log: ExerciseLog) => {
    const newLogs = [...logs, log];
    setLogs(newLogs);

    const currentExercise = workout.exercises.find(
      (e) => e.id === log.exerciseId,
    );
    if (currentExercise) {
      const exerciseLogs = newLogs.filter(
        (l) => l.exerciseId === log.exerciseId,
      );
      if (exerciseLogs.length === currentExercise.sets) {
        const exerciseTargets = {
          [log.exerciseId]: {
            sets: currentExercise.sets,
            reps: currentExercise.reps,
          },
        };
        const newSuggestions = applyProgressiveOverload(
          exerciseLogs,
          exerciseTargets,
        );
        setWeightSuggestions({ ...weightSuggestions, ...newSuggestions });
      }
    }
  };

  const handleCompleteExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      handleCompleteWorkout();
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      const response = await fetch('/api/workouts/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId: workout.id,
          exercises: logs,
        }),
      });

      if (response.ok) {
        onComplete();
      } else {
        throw new Error('Failed to log workout');
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to log workout. Please try again.');
    }
  };

  const currentExercise = workout.exercises[currentExerciseIndex];

  if (!currentExercise) {
    return <div>No exercise found</div>;
  }

  return (
    <div className="space-y-4">
      <ProgressBar
        current={currentExerciseIndex}
        total={workout.exercises.length}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExerciseIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <ExerciseCard
            exercise={currentExercise}
            onLogSet={handleLogSet}
            suggestedWeight={weightSuggestions[currentExercise.id] ?? null}
            onComplete={handleCompleteExercise}
            previousData={previousExerciseData[currentExercise.id] || null}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
