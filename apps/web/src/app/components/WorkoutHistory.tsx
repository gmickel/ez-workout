import { CalendarComponent } from '@/app/components/Calendar';
import type { WorkoutLog } from '@/types';
// components/WorkoutHistory.tsx
import React, { useState, useEffect } from 'react';
import { WorkoutCard } from './WorkoutCard';

export function WorkoutHistory() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetchWorkoutLogs();
  }, []);

  const fetchWorkoutLogs = async () => {
    try {
      const response = await fetch('/api/workouts/history');
      if (response.ok) {
        const data = await response.json();
        setWorkoutLogs(data);
      } else {
        throw new Error('Failed to fetch workout logs');
      }
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      alert('Failed to fetch workout history. Please try again.');
    }
  };

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const filteredWorkoutLogs = selectedDate
    ? workoutLogs.filter(
        (log) =>
          new Date(log.date).toDateString() === selectedDate.toDateString(),
      )
    : workoutLogs;

  /*
  const chartData = workoutLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString(),
    totalWeight: log.exercises.reduce(
      (total, exercise) =>
        total +
        exercise.sets.reduce(
          (setTotal, set) => setTotal + (set.weight ?? 0),
          0,
        ),
      0,
    ),
    totalSets: log.exercises.reduce(
      (total, exercise) => total + exercise.sets.length,
      0,
    ),
    totalReps: log.exercises.reduce(
      (total, exercise) =>
        total +
        exercise.sets.reduce((setTotal, set) => setTotal + (set.reps ?? 0), 0),
      0,
    ),
  }));
  */

  return (
    <div className="space-y-6">
      <CalendarComponent
        workouts={workoutLogs.map((log) => ({
          date: log.date,
          name: log.workoutName,
        }))}
        onSelectDate={handleSelectDate}
      />
      <div className="space-y-4">
        {filteredWorkoutLogs.map((log) => (
          <WorkoutCard key={log.id} workout={log} />
        ))}
      </div>
    </div>
  );
}
