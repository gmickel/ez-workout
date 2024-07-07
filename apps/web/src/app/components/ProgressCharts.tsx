'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@ui/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface WorkoutData {
  id: number;
  date: string;
  workoutName: string;
  exercises: {
    name: string;
    sets: Array<{ weight: number | null; reps: number | null }>;
  }[];
}

interface ChartData {
  date: string;
  [key: string]: number | string;
}

const ProgressCharts: React.FC<{ workoutLogs: WorkoutData[] }> = ({
  workoutLogs,
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<string | undefined>(
    undefined,
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  // Get unique workout names
  const uniqueWorkoutNames = useMemo(
    () => Array.from(new Set(workoutLogs.map((log) => log.workoutName))),
    [workoutLogs],
  );

  useEffect(() => {
    if (uniqueWorkoutNames.length > 0 && !selectedWorkout) {
      setSelectedWorkout(uniqueWorkoutNames[0]);
    }
  }, [uniqueWorkoutNames, selectedWorkout]);

  useEffect(() => {
    if (selectedWorkout) {
      const selectedWorkoutData = workoutLogs.filter(
        (log) => log.workoutName === selectedWorkout,
      );
      const newChartData: ChartData[] = [];
      const newChartConfig: ChartConfig = {};

      for (const workout of selectedWorkoutData) {
        const dataPoint: ChartData = { date: workout.date };
        for (const exercise of workout.exercises) {
          const maxWeight = Math.max(
            ...exercise.sets.map((set) => set.weight ?? 0),
          );
          dataPoint[exercise.name] = maxWeight;

          if (!newChartConfig[exercise.name]) {
            newChartConfig[exercise.name] = {
              label: exercise.name,
              color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            };
          }
        }
        newChartData.push(dataPoint);
      }

      // Sort chart data by date
      newChartData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      setChartData(newChartData);
      setChartConfig(newChartConfig);
    }
  }, [selectedWorkout, workoutLogs]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Workout Progress</CardTitle>
          <CardDescription>
            Showing progress for each exercise in the selected workout
          </CardDescription>
        </div>
        <Select value={selectedWorkout} onValueChange={setSelectedWorkout}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a workout"
          >
            <SelectValue placeholder="Select workout" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {uniqueWorkoutNames.map((workoutName) => (
              <SelectItem
                key={workoutName}
                value={workoutName}
                className="rounded-lg"
              >
                {workoutName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <AreaChart data={chartData}>
            <defs>
              {Object.entries(chartConfig).map(([key, config]) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}kg`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {Object.keys(chartConfig).map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="step"
                stroke={chartConfig[key]?.color}
                fill={chartConfig[key]?.color}
                stackId="1"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressCharts;
