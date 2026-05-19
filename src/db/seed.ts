import { db } from './index.js';
import {
  exercises,
  exerciseBodyParts,
  exerciseEquipment,
  exerciseSchemes,
  type BodyPart,
  type Equipment,
  type EnergyLevel,
} from './schema.js';

interface SeedExercise {
  name: string;
  energyLevel: EnergyLevel;
  notes?: string;
  bodyParts: BodyPart[];
  equipment: Equipment[];
  schemes: { energyLevel: EnergyLevel; sets: number; reps: number; weightKg?: number }[];
}

const seedData: SeedExercise[] = [
  // ── CHEST × HOME ─────────────────────────────────────────────────────────────
  {
    name: 'Push-ups',
    energyLevel: 'LOW',
    notes: 'Classic bodyweight chest press',
    bodyParts: ['CHEST'],
    equipment: ['HOME'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 8 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 15 },
      { energyLevel: 'HIGH', sets: 4, reps: 20 },
    ],
  },
  {
    name: 'Pike Push-ups',
    energyLevel: 'MEDIUM',
    notes: 'Targets shoulders and upper chest',
    bodyParts: ['CHEST'],
    equipment: ['HOME'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 6 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 10 },
      { energyLevel: 'HIGH', sets: 4, reps: 15 },
    ],
  },

  // ── CHEST × DUMBBELL ─────────────────────────────────────────────────────────
  {
    name: 'Dumbbell Bench Press',
    energyLevel: 'MEDIUM',
    bodyParts: ['CHEST'],
    equipment: ['DUMBBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 8, weightKg: 10 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 10, weightKg: 14 },
      { energyLevel: 'HIGH', sets: 4, reps: 8, weightKg: 18 },
    ],
  },
  {
    name: 'Dumbbell Flyes',
    energyLevel: 'LOW',
    notes: 'Focus on chest stretch at the bottom',
    bodyParts: ['CHEST'],
    equipment: ['DUMBBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 10, weightKg: 6 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 12, weightKg: 8 },
      { energyLevel: 'HIGH', sets: 4, reps: 12, weightKg: 10 },
    ],
  },

  // ── CHEST × BARBELL ──────────────────────────────────────────────────────────
  {
    name: 'Barbell Bench Press',
    energyLevel: 'HIGH',
    bodyParts: ['CHEST'],
    equipment: ['BARBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 3, reps: 5, weightKg: 40 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 8, weightKg: 60 },
      { energyLevel: 'HIGH', sets: 4, reps: 6, weightKg: 80 },
    ],
  },

  // ── BACK × DUMBBELL ──────────────────────────────────────────────────────────
  {
    name: 'Dumbbell Row',
    energyLevel: 'MEDIUM',
    notes: 'Single-arm or both; keep back flat',
    bodyParts: ['BACK'],
    equipment: ['DUMBBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 8, weightKg: 10 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 10, weightKg: 14 },
      { energyLevel: 'HIGH', sets: 4, reps: 10, weightKg: 18 },
    ],
  },

  // ── BACK × HOME ──────────────────────────────────────────────────────────────
  {
    name: 'Pull-ups',
    energyLevel: 'MEDIUM',
    notes: 'Use a doorframe bar or park bar',
    bodyParts: ['BACK'],
    equipment: ['HOME'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 4 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 8 },
      { energyLevel: 'HIGH', sets: 4, reps: 12 },
    ],
  },

  // ── BACK × BARBELL ───────────────────────────────────────────────────────────
  {
    name: 'Barbell Deadlift',
    energyLevel: 'HIGH',
    notes: 'Compound posterior chain movement',
    bodyParts: ['BACK', 'LEGS'],
    equipment: ['BARBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 3, reps: 3, weightKg: 60 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 5, weightKg: 80 },
      { energyLevel: 'HIGH', sets: 4, reps: 5, weightKg: 100 },
    ],
  },
  {
    name: 'Barbell Row',
    energyLevel: 'HIGH',
    notes: 'Overhand grip; hinge to ~45°',
    bodyParts: ['BACK'],
    equipment: ['BARBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 3, reps: 5, weightKg: 40 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 8, weightKg: 60 },
      { energyLevel: 'HIGH', sets: 4, reps: 8, weightKg: 75 },
    ],
  },

  // ── LEGS × HOME + OUTSIDE ────────────────────────────────────────────────────
  {
    name: 'Bodyweight Squats',
    energyLevel: 'LOW',
    bodyParts: ['LEGS'],
    equipment: ['HOME', 'OUTSIDE'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 10 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 15 },
      { energyLevel: 'HIGH', sets: 4, reps: 20 },
    ],
  },

  // ── LEGS × DUMBBELL ──────────────────────────────────────────────────────────
  {
    name: 'Dumbbell Lunges',
    energyLevel: 'MEDIUM',
    notes: 'Alternating legs; keep front knee over ankle',
    bodyParts: ['LEGS'],
    equipment: ['DUMBBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 8, weightKg: 8 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 10, weightKg: 12 },
      { energyLevel: 'HIGH', sets: 4, reps: 12, weightKg: 16 },
    ],
  },

  // ── LEGS × BARBELL ───────────────────────────────────────────────────────────
  {
    name: 'Barbell Squats',
    energyLevel: 'HIGH',
    notes: 'High-bar or low-bar; break parallel',
    bodyParts: ['LEGS'],
    equipment: ['BARBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 3, reps: 5, weightKg: 50 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 8, weightKg: 70 },
      { energyLevel: 'HIGH', sets: 4, reps: 6, weightKg: 90 },
    ],
  },
  {
    name: 'Barbell Romanian Deadlift',
    energyLevel: 'MEDIUM',
    notes: 'Hip-hinge; keep bar close to legs',
    bodyParts: ['LEGS', 'BACK'],
    equipment: ['BARBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 3, reps: 5, weightKg: 40 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 8, weightKg: 55 },
      { energyLevel: 'HIGH', sets: 4, reps: 8, weightKg: 70 },
    ],
  },

  // ── LEGS × OUTSIDE ───────────────────────────────────────────────────────────
  {
    name: 'Running',
    energyLevel: 'MEDIUM',
    notes: 'Reps = minutes of continuous running',
    bodyParts: ['LEGS'],
    equipment: ['OUTSIDE'],
    schemes: [
      { energyLevel: 'LOW', sets: 1, reps: 15 },
      { energyLevel: 'MEDIUM', sets: 1, reps: 25 },
      { energyLevel: 'HIGH', sets: 1, reps: 40 },
    ],
  },

  // ── CORE × HOME ──────────────────────────────────────────────────────────────
  {
    name: 'Plank',
    energyLevel: 'LOW',
    notes: 'Reps = seconds held per set',
    bodyParts: ['CORE'],
    equipment: ['HOME'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 20 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 30 },
      { energyLevel: 'HIGH', sets: 4, reps: 45 },
    ],
  },
  {
    name: 'Mountain Climbers',
    energyLevel: 'MEDIUM',
    notes: 'Reps = total knee drives (both sides)',
    bodyParts: ['CORE'],
    equipment: ['HOME', 'OUTSIDE'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 15 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 20 },
      { energyLevel: 'HIGH', sets: 4, reps: 30 },
    ],
  },

  // ── CORE × DUMBBELL ──────────────────────────────────────────────────────────
  {
    name: 'Dumbbell Russian Twists',
    energyLevel: 'MEDIUM',
    notes: 'Reps = rotations per side',
    bodyParts: ['CORE'],
    equipment: ['DUMBBELL'],
    schemes: [
      { energyLevel: 'LOW', sets: 2, reps: 10, weightKg: 4 },
      { energyLevel: 'MEDIUM', sets: 3, reps: 15, weightKg: 6 },
      { energyLevel: 'HIGH', sets: 4, reps: 20, weightKg: 8 },
    ],
  },
];

async function seed() {
  console.log('Seeding database...');

  for (const ex of seedData) {
    // Insert exercise
    const [inserted] = await db
      .insert(exercises)
      .values({ name: ex.name, energyLevel: ex.energyLevel, notes: ex.notes ?? null })
      .returning({ id: exercises.id });

    const exerciseId = inserted.id;

    // Insert body parts
    await db.insert(exerciseBodyParts).values(
      ex.bodyParts.map((bodyPart) => ({ exerciseId, bodyPart })),
    );

    // Insert equipment
    await db.insert(exerciseEquipment).values(
      ex.equipment.map((equipment) => ({ exerciseId, equipment })),
    );

    // Insert schemes
    await db.insert(exerciseSchemes).values(
      ex.schemes.map((s) => ({
        exerciseId,
        energyLevel: s.energyLevel,
        sets: s.sets,
        reps: s.reps,
        weightKg: s.weightKg ?? null,
      })),
    );

    console.log(`  ✓ ${ex.name}`);
  }

  console.log(`\nSeeded ${seedData.length} exercises successfully.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
