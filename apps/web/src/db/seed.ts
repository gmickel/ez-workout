import { env } from '@/app/env';
import { db } from '@/lib/db';
import {
  type NewExercise,
  type NewWorkout,
  exercises,
  users,
  workouts,
} from '@/models/schema';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { VercelPgDatabase } from 'drizzle-orm/vercel-postgres';

async function seed() {
  console.log('Checking database...');

  // Seed initial user if environment variables are set
  const initialUsername = env.INITIAL_USERNAME;
  const initialPassword = env.INITIAL_PASSWORD;

  if (initialUsername && initialPassword) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, initialUsername));

    if (existingUser.length === 0) {
      const passwordHash = await bcrypt.hash(initialPassword, 10);
      await db.insert(users).values({
        username: initialUsername,
        passwordHash: passwordHash,
      });
      console.log('Initial user seeded.');
    } else {
      console.log('Initial user already exists, skipping user seed.');
    }
  } else {
    console.log(
      'INITIAL_USERNAME or INITIAL_PASSWORD not set, skipping user seed.',
    );
  }
  // Check if workouts already exist
  const existingWorkouts = await db.select().from(workouts);
  if (existingWorkouts.length > 0) {
    console.log('Database already seeded. Skipping seed process.');
    return;
  }

  console.log('Seeding database...');

  // Define workouts
  const workoutsData: NewWorkout[] = [
    { name: 'Workout A', day: 'Monday and Friday' },
    { name: 'Workout B', day: 'Wednesday and Saturday' },
  ];

  // Insert workouts
  const insertedWorkouts = await db
    .insert(workouts)
    .values(workoutsData)
    .returning();

  if (insertedWorkouts && insertedWorkouts.length > 0) {
    const exercisesData: NewExercise[] = [
      {
        workoutId: insertedWorkouts[0]?.id,
        name: 'Dumbbell Goblet Squats',
        sets: 3,
        reps: '12, 10, 8',
        notes:
          'Keep your chest up, back straight, and squat as low as comfortable. Push through your heels to stand up.',
        explanation:
          'Hold a single dumbbell vertically against your chest, cupping the top end with both hands. Stand with feet shoulder-width apart. Lower your body as if sitting back into a chair, keeping your chest up and knees in line with your toes. Go as low as you can while maintaining form, then push through your heels to return to the starting position.',
      },
      {
        workoutId: insertedWorkouts[0]?.id,
        name: 'Dumbbell Bench Press',
        sets: 3,
        reps: '12, 10, 8',
        notes:
          'Keep your wrists straight and elbows at a 45-degree angle to your torso. Lower the weights to chest level and press up.',
        explanation:
          'Lie on your back on the bench with a dumbbell in each hand. Start with the dumbbells at chest level, palms facing towards your feet. Press the weights straight up until your arms are fully extended, then lower them back down to chest level under control. Keep your feet flat on the floor and maintain contact between your back and the bench throughout the movement.',
      },
      {
        workoutId: insertedWorkouts[0]?.id,
        name: 'One-Arm Dumbbell Rows',
        sets: 3,
        reps: '12, 10, 8 (each arm)',
        notes:
          'Keep your back straight and core engaged. Pull the dumbbell to your hip, squeezing your shoulder blade at the top.',
        explanation:
          'Place one knee and the same-side hand on the bench. The other foot should be on the floor. Hold a dumbbell in your free hand, arm fully extended. Pull the dumbbell up towards your hip, keeping your elbow close to your body. Squeeze your shoulder blade at the top, then lower the weight back down with control. Complete all reps on one side before switching.',
      },
      {
        workoutId: insertedWorkouts[0]?.id,
        name: 'Dumbbell Romanian Deadlifts',
        sets: 3,
        reps: '12, 10, 8',
        notes:
          'Keep a slight bend in your knees and hinge at the hips. Lower the weights along your legs, feeling a stretch in your hamstrings.',
        explanation:
          'Stand with feet hip-width apart, holding dumbbells in front of your thighs. Keep a slight bend in your knees throughout the movement. Hinge at the hips, pushing your buttocks back as you lower the weights along your legs. Feel a stretch in your hamstrings as you lower the weights. Go as low as you can while maintaining a flat back, typically to mid-shin level. Then, engage your hamstrings and glutes to return to the starting position.',
      },
      {
        workoutId: insertedWorkouts[0]?.id,
        name: 'Dumbbell Shoulder Press',
        sets: 3,
        reps: '12, 10, 8',
        notes:
          'Keep your core tight and avoid arching your back. Press the weights straight up overhead.',
        explanation:
          "Sit on the bench with back support or stand with feet shoulder-width apart. Hold a dumbbell in each hand at shoulder level, palms facing forward. Press the weights directly overhead until your arms are fully extended, but don't lock your elbows. Lower the weights back to shoulder level with control. Keep your core engaged throughout to protect your lower back.",
      },
      {
        workoutId: insertedWorkouts[1]?.id,
        name: 'Dumbbell Walking Lunges',
        sets: 3,
        reps: '10 steps each leg',
        notes:
          'Take long steps and keep your front knee aligned with your ankle. Lower your back knee close to the ground.',
        explanation:
          'Hold a dumbbell in each hand by your sides. Take a large step forward, lowering your back knee towards the ground while keeping your front knee aligned with your ankle. Your front thigh should be parallel to the ground at the bottom of the movement. Push off your front foot to bring your back foot forward into the next lunge. Alternate legs as you move forward.',
      },
      {
        workoutId: insertedWorkouts[1]?.id,
        name: 'Incline Dumbbell Press',
        sets: 3,
        reps: '12, 10, 8',
        notes:
          'Set bench to a 30-45 degree incline. Keep your feet flat on the ground and press the weights up over your upper chest.',
        explanation:
          'Set your bench to a 30-45 degree incline. Lie back on the bench with a dumbbell in each hand at chest level, palms facing your feet. Press the weights straight up over your upper chest until your arms are extended, then lower them back down with control. Keep your feet flat on the floor and your lower back pressed against the bench throughout the movement.',
      },
      {
        workoutId: insertedWorkouts[1]?.id,
        name: 'Dumbbell Bent-Over Rows',
        sets: 3,
        reps: '12, 10, 8',
        notes:
          'Hinge at the hips, keeping your back straight. Pull the weights to your lower ribcage, squeezing your shoulder blades together.',
        explanation:
          'Stand with feet hip-width apart, holding a dumbbell in each hand. Hinge forward at the hips until your upper body is nearly parallel to the floor, keeping your back straight. Let the weights hang directly below your shoulders, arms fully extended. Pull the weights up towards your lower ribcage, keeping your elbows close to your body. Squeeze your shoulder blades together at the top, then lower the weights back down with control.',
      },
      {
        workoutId: insertedWorkouts[1]?.id,
        name: 'Dumbbell Step-Ups',
        sets: 3,
        reps: '10 each leg',
        notes:
          'Use a sturdy platform or the edge of your bench. Step up, driving through your heel, and bring your other foot up to meet it.',
        explanation:
          'Hold a dumbbell in each hand by your sides. Stand facing a sturdy platform or the edge of your bench. The platform should be high enough that your thigh is parallel to the ground when you place your foot on it. Step onto the platform with one foot, driving through your heel to lift your body up. Bring your other foot onto the platform, then step back down with the second foot, followed by the first. Alternate your leading foot with each rep.',
      },
      {
        workoutId: insertedWorkouts[1]?.id,
        name: 'Dumbbell Lateral Raises',
        sets: 3,
        reps: '12, 10, 8',
        notes:
          'Keep a slight bend in your elbows and raise the weights to shoulder height. Lower slowly to control the descent.',
        explanation:
          'Stand with feet hip-width apart, holding a dumbbell in each hand by your sides. Keep a slight bend in your elbows throughout the movement. Raise the dumbbells out to your sides until they reach shoulder level, forming a T with your body. Pause briefly at the top, then lower the weights back down slowly and with control. Avoid using momentum to lift the weights; the movement should come from your shoulders.',
      },
      {
        workoutId: insertedWorkouts[1]?.id,
        name: 'Floor Crunches',
        sets: 3,
        reps: '15-20',
        notes:
          'Lie on your mat, feet flat on the floor. Curl your upper body, focusing on contracting your abs. Avoid pulling on your neck.',
        explanation:
          'Lie on your back on the mat with your knees bent and feet flat on the floor. Place your hands lightly behind your head, elbows pointing out. Engage your core to lift your shoulder blades off the mat, curling your upper body towards your knees. Focus on contracting your abdominal muscles rather than pulling with your hands. Lower back down with control. Keep your lower back pressed against the mat throughout the movement.',
      },
    ];

    // Insert exercises
    await db.insert(exercises).values(exercisesData);

    console.log('Seeding complete!');
  } else {
    throw new Error('Failed to insert workouts');
  }
}

async function main() {
  try {
    await seed();
  } catch (e) {
    console.error('Error during seeding:', e);
    process.exit(1);
  } finally {
    await closeConnection();
    process.exit(0);
  }
}

async function closeConnection() {
  if (isVercelPgDatabase(db)) {
    await sql.end();
  } else if (isNodePgDatabase(db)) {
    const { pool } = await import('@/lib/db');
    if (pool) {
      await pool.end();
    }
  }
}

function isVercelPgDatabase(
  database: unknown,
): database is VercelPgDatabase<Record<string, unknown>> {
  return (
    typeof database === 'object' &&
    database !== null &&
    'driver' in database &&
    typeof database.driver === 'object' &&
    database.driver !== null &&
    'constructor' in database.driver &&
    typeof database.driver.constructor === 'function' &&
    'name' in database.driver.constructor &&
    database.driver.constructor.name === 'VercelPgDriver'
  );
}

function isNodePgDatabase(
  database: unknown,
): database is NodePgDatabase<Record<string, unknown>> {
  return (
    typeof database === 'object' &&
    database !== null &&
    'driver' in database &&
    typeof database.driver === 'object' &&
    database.driver !== null &&
    'constructor' in database.driver &&
    typeof database.driver.constructor === 'function' &&
    'name' in database.driver.constructor &&
    database.driver.constructor.name === 'NodePgDriver'
  );
}

main();
