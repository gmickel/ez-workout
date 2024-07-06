import { Progress } from '@ui/components/ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({
  current,
  total,
  label,
}: Readonly<ProgressBarProps>) {
  const percentage = Math.round((current / total) * 100);

  return (
    <Progress
      value={percentage}
      aria-label={label ?? `Progress: ${percentage}%`}
    />
  );
}
