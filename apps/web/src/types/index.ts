export type Workout = {
  id: number;
  name: string;
  day: string;
  exercises: Exercise[];
};

export type Exercise = {
  id: number;
  name: string;
  sets: number;
  reps: string;
  notes: string;
  explanation: string;
};

export interface ExerciseSet {
  weight: number | null;
  reps: number | null;
}

export interface GroupedExercise {
  name: string;
  sets: ExerciseSet[];
}

export interface ExerciseLog {
  exerciseId: number;
  name: string; // Add this line
  weight: number | null;
  reps: number | null;
  notes: string | null;
  skipped: boolean;
}

export interface PreviousExerciseData {
  lastWorkoutDate: string | null;
  lastWeight: number | null;
  lastSets: number[];
  recentNotes: string[];
  wasSkipped: boolean;
}

export interface WorkoutLog {
  id: number;
  date: string;
  workoutName: string;
  exercises: GroupedExercise[];
}

export interface WorkoutWithExercises extends Workout {
  exercises: Exercise[];
}
