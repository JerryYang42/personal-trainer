import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// ── Enum constants ─────────────────────────────────────────────────────────────
export const BODY_PARTS = ['CHEST', 'BACK', 'LEGS', 'CORE'] as const;
export const EQUIPMENT = ['DUMBBELL', 'BARBELL', 'HOME', 'OUTSIDE'] as const;
export const ENERGY_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

export type BodyPart = (typeof BODY_PARTS)[number];
export type Equipment = (typeof EQUIPMENT)[number];
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];

// ── exercises ──────────────────────────────────────────────────────────────────
export const exercises = sqliteTable('exercises', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  energyLevel: text('energy_level', { enum: ENERGY_LEVELS }).notNull(),
  notes: text('notes'),
});

// ── exercise_body_parts (many-to-many) ─────────────────────────────────────────
export const exerciseBodyParts = sqliteTable('exercise_body_parts', {
  exerciseId: integer('exercise_id')
    .notNull()
    .references(() => exercises.id),
  bodyPart: text('body_part', { enum: BODY_PARTS }).notNull(),
});

// ── exercise_equipment (many-to-many) ──────────────────────────────────────────
export const exerciseEquipment = sqliteTable('exercise_equipment', {
  exerciseId: integer('exercise_id')
    .notNull()
    .references(() => exercises.id),
  equipment: text('equipment', { enum: EQUIPMENT }).notNull(),
});

// ── exercise_schemes (prescription per intensity) ──────────────────────────────
export const exerciseSchemes = sqliteTable('exercise_schemes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  exerciseId: integer('exercise_id')
    .notNull()
    .references(() => exercises.id),
  energyLevel: text('energy_level', { enum: ENERGY_LEVELS }).notNull(),
  sets: integer('sets').notNull(),
  reps: integer('reps').notNull(),
  weightKg: real('weight_kg'),
});

// ── workout_records ─────────────────────────────────────────────────────────────
export const workoutRecords = sqliteTable('workout_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});

// ── exercise_logs ───────────────────────────────────────────────────────────────
export const exerciseLogs = sqliteTable('exercise_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workoutRecordId: integer('workout_record_id')
    .notNull()
    .references(() => workoutRecords.id),
  // nullable — logs survive exercise deletion
  exerciseId: integer('exercise_id').references(() => exercises.id),
  // snapshot of name at record time
  name: text('name').notNull(),
  sets: integer('sets').notNull(),
  reps: integer('reps').notNull(),
  weightKg: real('weight_kg'),
  notes: text('notes'),
});
