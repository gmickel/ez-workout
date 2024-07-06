import * as React from 'react';

import { Calendar } from '@ui/components/ui/calendar';

interface CalendarProps {
  workouts: Array<{ date: string; name: string }>;
  onSelectDate: (date: Date | undefined) => void;
}

export function CalendarComponent({
  workouts,
  onSelectDate,
}: Readonly<CalendarProps>) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const workoutDates = React.useMemo(
    () => workouts.map((workout) => new Date(workout.date)),
    [workouts],
  );

  return (
    <div className="grid gap-2">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          setDate(newDate);
          onSelectDate(newDate);
        }}
        initialFocus
        modifiers={{
          workout: workoutDates,
        }}
        modifiersStyles={{
          workout: {
            fontWeight: 'bold',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          },
        }}
      />
    </div>
  );
}
