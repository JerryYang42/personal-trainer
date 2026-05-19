import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import {
  BODY_PARTS,
  EQUIPMENT,
  ENERGY_LEVELS,
  exercises,
  exerciseBodyParts,
  exerciseEquipment,
  exerciseSchemes,
  workoutRecords,
  exerciseLogs,
} from './schema.js';

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeDb() {
  const client = createClient({ url: ':memory:' });
  return {
    client,
    db: drizzle(client, {
      schema: {
        exercises,
        exerciseBodyParts,
        exerciseEquipment,
        exerciseSchemes,
        workoutRecords,
        exerciseLogs,
      },
    }),
  };
}

async function applySchema(client: ReturnType<typeof createClient>) {
  await client.executeMultiple(`
    CREATE TABLE exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      energy_level TEXT NOT NULL,
      notes TEXT
    );
    CREATE TABLE exercise_body_parts (
      exercise_id INTEGER NOT NULL REFERENCES exercises(id),
      body_part TEXT NOT NULL
    );
    CREATE TABLE exercise_equipment (
      exercise_id INTEGER NOT NULL REFERENCES exercises(id),
      equipment TEXT NOT NULL
    );
    CREATE TABLE exercise_schemes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL REFERENCES exercises(id),
      energy_level TEXT NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight_kg REAL
    );
    CREATE TABLE workout_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );
    CREATE TABLE exercise_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_record_id INTEGER NOT NULL REFERENCES workout_records(id),
      exercise_id INTEGER REFERENCES exercises(id),
      name TEXT NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight_kg REAL,
      notes TEXT
    );
  `);
}

// ── Schema constants ───────────────────────────────────────────────────────────

describe('schema constants', () => {
  it('BODY_PARTS contains the four expected values', () => {
    assert.deepEqual([...BODY_PARTS], ['CHEST', 'BACK', 'LEGS', 'CORE']);
  });

  it('EQUIPMENT contains the four expected values', () => {
    assert.deepEqual([...EQUIPMENT], ['DUMBBELL', 'BARBELL', 'HOME', 'OUTSIDE']);
  });

  it('ENERGY_LEVELS contains the three expected values in order', () => {
    assert.deepEqual([...ENERGY_LEVELS], ['LOW', 'MEDIUM', 'HIGH']);
  });
});

// ── exercises table ────────────────────────────────────────────────────────────

describe('exercises table', () => {
  const { client, db } = makeDb();

  before(async () => { await applySchema(client); });

  it('inserts and retrieves an exercise', async () => {
    await db.insert(exercises).values({ name: 'Push-ups', energyLevel: 'LOW' });
    const rows = await db.select().from(exercises);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, 'Push-ups');
    assert.equal(rows[0].energyLevel, 'LOW');
    assert.equal(rows[0].notes, null);
  });

  it('stores optional notes field', async () => {
    await db
      .insert(exercises)
      .values({ name: 'Plank', energyLevel: 'LOW', notes: 'Hold position' });
    const [row] = await db
      .select()
      .from(exercises)
      .where(eq(exercises.name, 'Plank'));
    assert.equal(row.notes, 'Hold position');
  });

  it('auto-increments id', async () => {
    const rows = await db.select().from(exercises);
    const ids = rows.map((r) => r.id);
    const unique = new Set(ids);
    assert.equal(unique.size, rows.length);
    assert.ok(rows.every((r) => typeof r.id === 'number' && r.id > 0));
  });
});

// ── exercise_body_parts table ─────────────────────────────────────────────────

describe('exercise_body_parts table', () => {
  const { client, db } = makeDb();

  before(async () => {
    await applySchema(client);
    await db.insert(exercises).values({ name: 'Deadlift', energyLevel: 'HIGH' });
  });

  it('associates multiple body parts with one exercise', async () => {
    const [ex] = await db.select().from(exercises);
    await db
      .insert(exerciseBodyParts)
      .values([
        { exerciseId: ex.id, bodyPart: 'BACK' },
        { exerciseId: ex.id, bodyPart: 'LEGS' },
      ]);
    const rows = await db
      .select()
      .from(exerciseBodyParts)
      .where(eq(exerciseBodyParts.exerciseId, ex.id));
    assert.equal(rows.length, 2);
    const parts = rows.map((r) => r.bodyPart).sort();
    assert.deepEqual(parts, ['BACK', 'LEGS']);
  });
});

// ── exercise_equipment table ──────────────────────────────────────────────────

describe('exercise_equipment table', () => {
  const { client, db } = makeDb();

  before(async () => {
    await applySchema(client);
    await db.insert(exercises).values({ name: 'Squats', energyLevel: 'MEDIUM' });
  });

  it('associates multiple equipment types with one exercise', async () => {
    const [ex] = await db.select().from(exercises);
    await db
      .insert(exerciseEquipment)
      .values([
        { exerciseId: ex.id, equipment: 'HOME' },
        { exerciseId: ex.id, equipment: 'OUTSIDE' },
      ]);
    const rows = await db
      .select()
      .from(exerciseEquipment)
      .where(eq(exerciseEquipment.exerciseId, ex.id));
    assert.equal(rows.length, 2);
    const equip = rows.map((r) => r.equipment).sort();
    assert.deepEqual(equip, ['HOME', 'OUTSIDE']);
  });
});

// ── exercise_schemes table ────────────────────────────────────────────────────

describe('exercise_schemes table', () => {
  const { client, db } = makeDb();

  before(async () => {
    await applySchema(client);
    await db.insert(exercises).values({ name: 'Bench Press', energyLevel: 'HIGH' });
  });

  it('stores three schemes (LOW / MEDIUM / HIGH) per exercise', async () => {
    const [ex] = await db.select().from(exercises);
    await db.insert(exerciseSchemes).values([
      { exerciseId: ex.id, energyLevel: 'LOW', sets: 2, reps: 8, weightKg: 40 },
      { exerciseId: ex.id, energyLevel: 'MEDIUM', sets: 3, reps: 10, weightKg: 60 },
      { exerciseId: ex.id, energyLevel: 'HIGH', sets: 4, reps: 6, weightKg: 80 },
    ]);
    const rows = await db
      .select()
      .from(exerciseSchemes)
      .where(eq(exerciseSchemes.exerciseId, ex.id));
    assert.equal(rows.length, 3);
  });

  it('retrieves the correct prescription for a given energy level', async () => {
    const [ex] = await db.select().from(exercises);
    const [scheme] = await db
      .select()
      .from(exerciseSchemes)
      .where(eq(exerciseSchemes.energyLevel, 'HIGH'));
    assert.equal(scheme.exerciseId, ex.id);
    assert.equal(scheme.sets, 4);
    assert.equal(scheme.reps, 6);
    assert.equal(scheme.weightKg, 80);
  });

  it('allows weightKg to be null for bodyweight exercises', async () => {
    await db.insert(exercises).values({ name: 'Pull-ups', energyLevel: 'MEDIUM' });
    const rows = await db
      .select()
      .from(exercises)
      .where(eq(exercises.name, 'Pull-ups'));
    const pullUpId = rows[0].id;
    await db.insert(exerciseSchemes).values({
      exerciseId: pullUpId,
      energyLevel: 'MEDIUM',
      sets: 3,
      reps: 8,
      weightKg: null,
    });
    const [scheme] = await db
      .select()
      .from(exerciseSchemes)
      .where(eq(exerciseSchemes.exerciseId, pullUpId));
    assert.equal(scheme.weightKg, null);
  });
});

// ── workout_records table ─────────────────────────────────────────────────────

describe('workout_records table', () => {
  const { client, db } = makeDb();

  before(async () => { await applySchema(client); });

  it('inserts a workout record for a user', async () => {
    const ts = new Date('2026-05-20T09:00:00Z');
    await db.insert(workoutRecords).values({ userId: 'user-42', timestamp: ts });
    const rows = await db.select().from(workoutRecords);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].userId, 'user-42');
    assert.ok(rows[0].timestamp instanceof Date);
    assert.equal(rows[0].timestamp.toISOString(), ts.toISOString());
  });
});

// ── exercise_logs table ───────────────────────────────────────────────────────

describe('exercise_logs table', () => {
  const { client, db } = makeDb();
  let workoutId: number;
  let exerciseId: number;

  before(async () => {
    await applySchema(client);
    await db
      .insert(workoutRecords)
      .values({ userId: 'user-1', timestamp: new Date() });
    const [wr] = await db.select().from(workoutRecords);
    workoutId = wr.id;

    await db.insert(exercises).values({ name: 'Squat', energyLevel: 'HIGH' });
    const [ex] = await db.select().from(exercises);
    exerciseId = ex.id;
  });

  it('inserts an exercise log with a linked exercise', async () => {
    await db.insert(exerciseLogs).values({
      workoutRecordId: workoutId,
      exerciseId,
      name: 'Squat',
      sets: 3,
      reps: 8,
      weightKg: 70,
    });
    const rows = await db
      .select()
      .from(exerciseLogs)
      .where(eq(exerciseLogs.workoutRecordId, workoutId));
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, 'Squat');
    assert.equal(rows[0].weightKg, 70);
  });

  it('allows exercise_id to be null so logs survive exercise deletion', async () => {
    await db.insert(exerciseLogs).values({
      workoutRecordId: workoutId,
      exerciseId: null,
      name: 'Deleted Exercise (snapshot)',
      sets: 2,
      reps: 12,
    });
    const rows = await db
      .select()
      .from(exerciseLogs)
      .where(eq(exerciseLogs.name, 'Deleted Exercise (snapshot)'));
    assert.equal(rows.length, 1);
    assert.equal(rows[0].exerciseId, null);
    assert.equal(rows[0].name, 'Deleted Exercise (snapshot)');
  });

  it('snapshots the exercise name independently of the exercises table', async () => {
    await db.insert(exerciseLogs).values({
      workoutRecordId: workoutId,
      exerciseId,
      name: 'Squat (legacy name)',
      sets: 4,
      reps: 5,
      weightKg: 100,
    });
    const [log] = await db
      .select()
      .from(exerciseLogs)
      .where(eq(exerciseLogs.name, 'Squat (legacy name)'));
    // name is a snapshot — it differs from the current exercise name
    const [ex] = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, exerciseId));
    assert.notEqual(log.name, ex.name);
  });
});
