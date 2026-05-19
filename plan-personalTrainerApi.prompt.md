# Plan: Personal Trainer GraphQL API (Thin Slice)

**TL;DR** — A single-file Apollo Server v4 app with one query (`trainingPlan`) and one mutation (`recordWorkout`). Exercises live in a seeded SQLite DB (via Drizzle ORM). Plan generation is a simple filter + greedy fill — easy to swap out for smarter logic later.

---

### Phase 1 — Project Scaffold
1. `package.json` with scripts (`dev`, `seed`, `migrate`)
2. `tsconfig.json` — `NodeNext` module resolution, strict mode
3. `src/index.ts` — Apollo Server v4 bootstrap (standalone HTTP server)

### Phase 2 — Database
4. `src/db/schema.ts` — Drizzle table definitions for 6 tables:
   - `exercises`: id, name, energy_level, notes
   - `exercise_body_parts`: exercise_id (FK), body_part (enum) — many-to-many
   - `exercise_equipment`: exercise_id (FK), equipment (enum) — many-to-many
   - `exercise_schemes`: exercise_id (FK), energy_level (enum), sets, reps, weight_kg (nullable) — prescription per intensity
   - `workout_records`: id, user_id, timestamp
   - `exercise_logs`: id, workout_record_id (FK), exercise_id (FK, nullable), name (snapshot), sets, reps, weight_kg, notes
5. `src/db/index.ts` — Drizzle connection (better-sqlite3, `trainer.db`)
6. `src/db/seed.ts` — ~15 exercises covering CHEST/BACK/LEGS/CORE × DUMBBELL/BARBELL/HOME/OUTSIDE with schemes per energy level *(run once)*

### Phase 3 — GraphQL Schema
7. `src/schema/typeDefs.ts` — SDL with enums, input types, and:
   - `Query.trainingPlan(input: TrainingPlanInput!): TrainingPlan!`
   - `Mutation.recordWorkout(input: RecordWorkoutInput!): WorkoutRecord!`

### Phase 4 — Business Logic
8. `src/services/planGenerator.ts` — JOIN `exercise_body_parts` + `exercise_equipment` to filter, look up `exercise_schemes` for the matching energy level to get sets/reps/weight, greedily pick exercises until `durationMinutes` is filled (LOW≈5 min/exercise, MEDIUM≈8, HIGH≈10)
9. `src/services/workoutService.ts` — Insert `workout_records` row + child `exercise_logs` rows, return assembled record

### Phase 5 — Resolvers
10. `src/resolvers/query.ts` — delegates to `planGenerator`
11. `src/resolvers/mutation.ts` — delegates to `workoutService`
12. `src/resolvers/index.ts` — merges resolvers

---

### Files to create
- `package.json`, `tsconfig.json`
- `src/index.ts`
- `src/schema/typeDefs.ts`
- `src/db/schema.ts`, `src/db/index.ts`, `src/db/seed.ts`
- `src/services/planGenerator.ts`, `src/services/workoutService.ts`
- `src/resolvers/query.ts`, `src/resolvers/mutation.ts`, `src/resolvers/index.ts`

---

### Verification
1. `npm run dev` starts server on `http://localhost:4000/graphql`
2. Apollo Sandbox — run `trainingPlan` query with sample input, confirm exercise list matches filters
3. Run `recordWorkout` mutation with a userId + exercise list, confirm `trainer.db` has rows
4. Run `trainingPlan` with mismatched equipment (e.g., MACHINE-only with HOME exercises seeded) — confirm empty or filtered result

---

### Decisions
- No user table — `userId` is a free-form string ID on mutations; auth can be layered later
- Drizzle ORM chosen for type-safe, migration-friendly SQLite that's easy to swap to Postgres later
- `planGenerator` is a pure function → easy to unit test or replace with AI generation later
- `currentTime` field accepted but unused in thin version (reserved for time-of-day plan variation)
- `exercises` is self-contained — `exercise_schemes` holds prescription, plans are just labels (no plan owns a prescription)
- `exercise_id` on `exercise_logs` is nullable + `name` is snapshotted — logs survive exercise deletion
- Progression is derived from `exercise_logs` queries — no extra table ever needed

---

### Extensibility hooks (not in thin slice)
- `currentTime` → add time-of-day logic (morning = energizing, evening = winding down)
- `userId` on query → personalized history-aware plans (query `workout_exercise_logs` for last performance)
- Swap `planGenerator.ts` internals for an LLM call without touching schema or resolvers
- Add `users` table without breaking existing mutations
- Add `plans` + `plan_exercises` junction tables for curated named plans — zero impact on existing queries
- Add `user_exercise_goals` for target weight/reps per user
