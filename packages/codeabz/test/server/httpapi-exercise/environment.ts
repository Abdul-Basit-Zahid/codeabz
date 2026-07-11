import { Flag } from "@codeabz/core/flag/flag"
import { Effect } from "effect"
import path from "path"

const preserveExerciseGlobalRoot = !!process.env.CODEABZ_HTTPAPI_EXERCISE_GLOBAL
export const exerciseGlobalRoot =
  process.env.CODEABZ_HTTPAPI_EXERCISE_GLOBAL ??
  path.join(process.env.TMPDIR ?? "/tmp", `codeabz-httpapi-global-${process.pid}`)
process.env.XDG_DATA_HOME = path.join(exerciseGlobalRoot, "data")
process.env.XDG_CONFIG_HOME = path.join(exerciseGlobalRoot, "config")
process.env.XDG_STATE_HOME = path.join(exerciseGlobalRoot, "state")
process.env.XDG_CACHE_HOME = path.join(exerciseGlobalRoot, "cache")
process.env.CODEABZ_DISABLE_SHARE = "true"
export const exerciseConfigDirectory = path.join(exerciseGlobalRoot, "config", "codeabz")
export const exerciseDataDirectory = path.join(exerciseGlobalRoot, "data", "codeabz")

const preserveExerciseDatabase = !!process.env.CODEABZ_HTTPAPI_EXERCISE_DB
export const exerciseDatabasePath =
  process.env.CODEABZ_HTTPAPI_EXERCISE_DB ??
  path.join(process.env.TMPDIR ?? "/tmp", `codeabz-httpapi-exercise-${process.pid}.db`)
process.env.CODEABZ_DB = exerciseDatabasePath
Flag.CODEABZ_DB = exerciseDatabasePath

export const original = {
  CODEABZ_SERVER_PASSWORD: Flag.CODEABZ_SERVER_PASSWORD,
  CODEABZ_SERVER_USERNAME: Flag.CODEABZ_SERVER_USERNAME,
}

export const cleanupExercisePaths = Effect.promise(async () => {
  const fs = await import("fs/promises")
  if (!preserveExerciseDatabase) {
    await Promise.all(
      [exerciseDatabasePath, `${exerciseDatabasePath}-wal`, `${exerciseDatabasePath}-shm`].map((file) =>
        fs.rm(file, { force: true }).catch(() => undefined),
      ),
    )
  }
  if (!preserveExerciseGlobalRoot)
    await fs.rm(exerciseGlobalRoot, { recursive: true, force: true }).catch(() => undefined)
})
