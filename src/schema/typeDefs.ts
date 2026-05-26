export const typeDefs = `#graphql
  # ── Enums ──────────────────────────────────────────────────────────────────
  enum BodyPart {
    CHEST
    BACK
    LEGS
    CORE
  }

  enum Equipment {
    DUMBBELL
    BARBELL
    HOME
    OUTSIDE
  }

  enum EnergyLevel {
    LOW
    MEDIUM
    HIGH
  }

  # ── Exercise types ──────────────────────────────────────────────────────────
  type ExerciseScheme {
    sets: Int!
    reps: Int!
    weightKg: Float
  }

  type PlannedExercise {
    id: Int!
    name: String!
    bodyParts: [BodyPart!]!
    equipment: [Equipment!]!
    scheme: ExerciseScheme!
    notes: String
  }

  type TrainingPlan {
    energyLevel: EnergyLevel!
    durationMinutes: Int!
    exercises: [PlannedExercise!]!
  }

  # ── Workout record types ────────────────────────────────────────────────────
  type ExerciseLog {
    id: Int!
    exerciseId: Int
    name: String!
    sets: Int!
    reps: Int!
    weightKg: Float
    notes: String
  }

  type WorkoutRecord {
    id: Int!
    userId: String!
    timestamp: String!
    exercises: [ExerciseLog!]!
  }

  # ── Input types ─────────────────────────────────────────────────────────────
  input TrainingPlanInput {
    energyLevel: EnergyLevel!
    durationMinutes: Int!
    bodyParts: [BodyPart!]!
    equipment: [Equipment!]!
    "Reserved for future time-of-day variation logic"
    currentTime: String
  }

  input ExerciseLogInput {
    exerciseId: Int
    name: String!
    sets: Int!
    reps: Int!
    weightKg: Float
    notes: String
  }

  input RecordWorkoutInput {
    userId: String!
    exercises: [ExerciseLogInput!]!
  }

  # ── Root types ───────────────────────────────────────────────────────────────
  type Query {
    trainingPlan(input: TrainingPlanInput!): TrainingPlan!
  }

  type Mutation {
    recordWorkout(input: RecordWorkoutInput!): WorkoutRecord!
  }
`;
