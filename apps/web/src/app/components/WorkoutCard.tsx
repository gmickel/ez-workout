import { Button } from '@ui/components/ui/button';
import { Card, CardContent, CardHeader } from '@ui/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface WorkoutCardProps {
  workout: {
    id: number;
    date: string;
    workoutName: string;
    exercises: Array<{
      name: string;
      sets: Array<{ weight: number | null; reps: number | null }>;
    }>;
  };
}

export function WorkoutCard({ workout }: Readonly<WorkoutCardProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{workout.workoutName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(workout.date).toLocaleDateString()}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {workout.exercises.map((exercise) => (
            <div
              key={`${workout.id}-${exercise.name}`}
              className="mb-4 last:mb-0"
            >
              <h4 className="font-medium">{exercise.name}</h4>
              {exercise.sets.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {exercise.sets.map((set, setIndex) => (
                    <li key={`${workout.id}-${exercise.name}-set-${setIndex}`}>
                      Set {setIndex + 1}:
                      {set.weight !== null ? `${set.weight}kg` : 'N/A'} x
                      {set.reps !== null ? `${set.reps} reps` : 'N/A'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  No sets recorded for this exercise.
                </p>
              )}
            </div>
          ))}{' '}
        </CardContent>
      )}
    </Card>
  );
}
