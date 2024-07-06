import type { Workout } from '@/types';
import { Button } from '@ui/components/ui/button';
import { Card, CardContent, CardHeader } from '@ui/components/ui/card';
import { useEffect, useState } from 'react';

export function WorkoutSelector({
  onSelectWorkout,
}: Readonly<{ onSelectWorkout: (workout: Workout) => void }>) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    // Fetch workouts from the API
    fetch('/api/workouts')
      .then((response) => response.json())
      .then((data) => setWorkouts(data));
  }, []);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Select Your Workout</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {workouts.map((workout) => (
            <Button key={workout.id} onClick={() => onSelectWorkout(workout)}>
              {workout.name} ({workout.day})
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
