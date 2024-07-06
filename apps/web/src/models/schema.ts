import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});

export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  day: text('day').notNull(),
});

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').references(() => workouts.id),
  name: text('name').notNull(),
  sets: integer('sets').notNull(),
  reps: text('reps').notNull(),
  notes: text('notes'),
  explanation: text('explanation'),
});

export const workoutLogs = pgTable('workout_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  workoutId: integer('workout_id').references(() => workouts.id),
  date: timestamp('date').defaultNow(),
});

export const exerciseLogs = pgTable('exercise_logs', {
  id: serial('id').primaryKey(),
  workoutLogId: integer('workout_log_id').references(() => workoutLogs.id),
  exerciseId: integer('exercise_id').references(() => exercises.id),
  weight: integer('weight'),
  reps: integer('reps'),
  notes: text('notes'),
  skipped: boolean('skipped').notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

export type WorkoutLog = typeof workoutLogs.$inferSelect;
export type NewWorkoutLog = typeof workoutLogs.$inferInsert;

export type ExerciseLog = typeof exerciseLogs.$inferSelect;
export type NewExerciseLog = typeof exerciseLogs.$inferInsert;
