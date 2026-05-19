# personal-trainer

A GraphQL API that generates training plans and records completed workouts.

## Stack

- **Apollo Server v5** — GraphQL server
- **Drizzle ORM** — type-safe SQLite queries
- **`node:sqlite`** — built-in Node.js 23.4+ SQLite (no native compilation)
- **TypeScript** — strict, NodeNext module resolution

## Getting started

```bash
npm install
npm run migrate   # push schema to trainer.db
npm run seed      # seed exercises
npm run dev       # start server at http://localhost:4000/
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start server with hot reload (`tsx watch`) |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled output |
| `npm run migrate` | Push Drizzle schema to `trainer.db` (`drizzle-kit push`) |
| `npm run seed` | Seed exercise library into `trainer.db` |

## GraphQL API

### Query — `trainingPlan`

Returns a plan filtered by body parts and available equipment, fitted to the requested duration and energy level.

```graphql
query {
  trainingPlan(input: {
    durationMinutes: 45
    energyLevel: MEDIUM
    bodyParts: [CHEST, BACK]
    equipment: [DUMBBELL, HOME]
    currentTime: "2026-05-19T08:00:00Z"
  }) {
    id
    estimatedDurationMinutes
    exercises {
      name
      sets
      reps
      weightKg
    }
  }
}
```

### Mutation — `recordWorkout`

Records a completed workout session for a user.

```graphql
mutation {
  recordWorkout(input: {
    userId: "user-123"
    exercises: [
      { exerciseId: "1", name: "Push-up", sets: 3, reps: 12, weightKg: null }
    ]
  }) {
    id
    userId
    timestamp
    exercises {
      name
      sets
      reps
    }
  }
}
```

## Database schema

| Table | Purpose |
|---|---|
| `exercises` | Exercise definitions (name, energy level, notes) |
| `exercise_body_parts` | Many-to-many: exercise ↔ body part |
| `exercise_equipment` | Many-to-many: exercise ↔ equipment type |
| `exercise_schemes` | Prescription per exercise × energy level (sets, reps, weight) |
| `workout_records` | Workout session header (user, timestamp) |
| `exercise_logs` | Line items per session — actual sets/reps/weight performed |

## Project structure

```
src/
  index.ts                  # Apollo Server bootstrap
  schema/
    typeDefs.ts             # GraphQL SDL
  resolvers/
    index.ts                # Merged resolvers
    query.ts                # trainingPlan resolver
    mutation.ts             # recordWorkout resolver
  services/
    planGenerator.ts        # Rule-based plan generation
    workoutService.ts       # Workout persistence
  db/
    index.ts                # Drizzle connection (node:sqlite)
    schema.ts               # Drizzle table definitions
    seed.ts                 # Exercise seed data
drizzle.config.ts           # Drizzle Kit config
```
