ALTER TABLE "exercise_logs" ALTER COLUMN "weight" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise_logs" ALTER COLUMN "reps" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise_logs" ADD COLUMN "skipped" boolean DEFAULT false NOT NULL;