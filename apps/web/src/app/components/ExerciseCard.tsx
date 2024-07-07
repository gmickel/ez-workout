import type { Exercise, ExerciseLog, PreviousExerciseData } from '@/types';
import { Button } from '@ui/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@ui/components/ui/card';
import { Checkbox } from '@ui/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@ui/components/ui/collapsible';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import { ChevronDown } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

type ExerciseCardProps = {
  exercise: Exercise;
  onLogSet: (log: ExerciseLog) => void;
  suggestedWeight: number | null;
  onComplete: () => void;
  previousData: PreviousExerciseData | null;
};

export default function ExerciseCard({
  exercise,
  onLogSet,
  suggestedWeight,
  onComplete,
  previousData,
}: Readonly<ExerciseCardProps>) {
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [skipped, setSkipped] = useState<boolean>(false);
  const [completedSets, setCompletedSets] = useState<number>(0);
  const repsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Prefill weight based on previous data or suggested weight
    if (suggestedWeight) {
      setWeight(suggestedWeight);
    } else if (previousData?.lastWeight) {
      setWeight(previousData.lastWeight);
    }
    setReps(0);
    setNotes('');
    setSkipped(false);
    setCompletedSets(0);
  }, [suggestedWeight, previousData]);

  const handleLogSet = () => {
    onLogSet({
      exerciseId: exercise.id,
      name: exercise.name,
      weight: skipped ? null : weight,
      reps: skipped ? null : reps,
      notes: notes || null,
      skipped,
    });
    setCompletedSets(completedSets + 1);

    if (!skipped) {
      setReps(0);
      setNotes('');
      // Focus on the reps input after logging a set
      setTimeout(() => repsInputRef.current?.focus(), 0);
    }

    if (completedSets + 1 >= exercise.sets) {
      onComplete();
    }
  };

  const currentSet = completedSets + 1;

  return (
    <Card className="mb-4">
      <CardHeader>
        <h3 className="text-xl font-bold">{exercise.name}</h3>
        <p>
          Set {currentSet} of {exercise.sets} | Target: {exercise.reps} reps
        </p>
        {suggestedWeight && <p>Suggested weight: {suggestedWeight}kg</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skipped"
              checked={skipped}
              onCheckedChange={(checked) => setSkipped(checked as boolean)}
            />
            <Label htmlFor="skipped">Skip this set</Label>
          </div>

          {!skipped && (
            <>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight ?? ''}
                  onChange={(e) =>
                    setWeight(e.target.value ? Number(e.target.value) : 0)
                  }
                  disabled={skipped}
                />
              </div>
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  autoFocus
                  ref={repsInputRef}
                  id="reps"
                  type="number"
                  value={reps ?? ''}
                  onChange={(e) =>
                    setReps(e.target.value ? Number(e.target.value) : 0)
                  }
                  disabled={skipped}
                />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </div>
        </div>
        {previousData && (
          <>
            <Collapsible className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Show Previous Notes
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                {previousData.recentNotes.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {previousData.recentNotes.map((note, index) => (
                      <li key={`${note.substring(0, 10)}-${index}`}>{note}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No previous notes available.</p>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Show Last Workout Results
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Date:</span>{' '}
                    {previousData.lastWorkoutDate
                      ? new Date(
                          previousData.lastWorkoutDate,
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Weight:</span>{' '}
                    {previousData.lastWeight
                      ? `${previousData.lastWeight}kg`
                      : 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Sets:</span>{' '}
                    {previousData.lastSets.length > 0
                      ? previousData.lastSets.map((set, index) => (
                          <span
                            key={`set-${previousData.lastWorkoutDate}-${index}`}
                            className="ml-2"
                          >
                            Set {index + 1}: {set} reps
                          </span>
                        ))
                      : 'N/A'}{' '}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{' '}
                    {previousData.wasSkipped ? (
                      <span className="text-yellow-500">Skipped</span>
                    ) : (
                      <span className="text-green-500">Completed</span>
                    )}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleLogSet}
          disabled={completedSets >= exercise.sets}
          className="w-full"
        >
          {skipped ? 'Log Skipped Set' : 'Log Set'} ({currentSet}/
          {exercise.sets})
        </Button>
      </CardFooter>
    </Card>
  );
}
