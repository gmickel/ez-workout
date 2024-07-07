import { CalendarComponent } from '@/app/components/Calendar';
import ProgressCharts from '@/app/components/ProgressCharts';
import { WorkoutCard } from '@/app/components/WorkoutCard';
import type { WorkoutLog } from '@/types';
import React, { useState, useEffect } from 'react';

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

  return (
    <div className="space-y-6">
      <ProgressCharts workoutLogs={workoutLogs} />
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
