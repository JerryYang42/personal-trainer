import { describe, it, expect } from 'vitest';
import {
  exercises,
  exerciseBodyParts,
  exerciseEquipment,
  exerciseSchemes,
  workoutRecords,
  exerciseLogs,
  BODY_PARTS,
  EQUIPMENT,
  ENERGY_LEVELS,
} from './schema';

describe('schema table definitions', () => {
  it('exercises table has expected columns', () => {
    const cols = Object.keys(exercises);
    expect(cols).toContain('id');
    expect(cols).toContain('name');
    expect(cols).toContain('notes');
  });

  it('exerciseBodyParts table has exerciseId and bodyPart columns', () => {
    const cols = Object.keys(exerciseBodyParts);
    expect(cols).toContain('exerciseId');
    expect(cols).toContain('bodyPart');
  });

  it('exerciseEquipment table has exerciseId and equipment columns', () => {
    const cols = Object.keys(exerciseEquipment);
    expect(cols).toContain('exerciseId');
    expect(cols).toContain('equipment');
  });

  it('exerciseSchemes table has sets, reps, and weightKg columns', () => {
    const cols = Object.keys(exerciseSchemes);
    expect(cols).toContain('sets');
    expect(cols).toContain('reps');
    expect(cols).toContain('weightKg');
  });

  it('workoutRecords table has userId and timestamp columns', () => {
    const cols = Object.keys(workoutRecords);
    expect(cols).toContain('userId');
    expect(cols).toContain('timestamp');
  });

  it('exerciseLogs table has snapshot name and exerciseId columns', () => {
    const cols = Object.keys(exerciseLogs);
    expect(cols).toContain('name');
    expect(cols).toContain('exerciseId');
  });
});

describe('schema constants', () => {
  it('BODY_PARTS contains the four expected values', () => {
    expect(BODY_PARTS).toEqual(
      expect.arrayContaining(['CHEST', 'BACK', 'LEGS', 'CORE'])
    );
  });

  it('EQUIPMENT contains the four expected values', () => {
    expect(EQUIPMENT).toEqual(
      expect.arrayContaining(['DUMBBELL', 'BARBELL', 'HOME', 'OUTSIDE'])
    );
  });

  it('ENERGY_LEVELS contains the three expected values in order', () => {
    expect(ENERGY_LEVELS).toEqual(['LOW', 'MEDIUM', 'HIGH']);
  });
});
