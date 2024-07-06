'use client';

import { Layout } from '@/app/components/Layout';
import { MotivationalMessage } from '@/app/components/MotivationalMessage';
import { WorkoutHistory } from '@/app/components/WorkoutHistory';
import { WorkoutLogger } from '@/app/components/WorkoutLogger';
import { WorkoutSelector } from '@/app/components/WorkoutSelector';
import type { Workout } from '@/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@ui/components/ui/tabs';
import { useState } from 'react';

export default function Dashboard() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);

  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleCompleteWorkout = () => {
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 5000);
    setSelectedWorkout(null);
  };

  return (
    <Layout>
      <Tabs defaultValue="workout" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="workout" className="space-y-4">
          {showMotivation && <MotivationalMessage />}
          {!selectedWorkout ? (
            <WorkoutSelector onSelectWorkout={handleSelectWorkout} />
          ) : (
            <WorkoutLogger
              workout={selectedWorkout}
              onComplete={handleCompleteWorkout}
            />
          )}
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <WorkoutHistory />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
