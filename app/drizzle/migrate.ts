// tsx --env-file=.env.local drizzle/migrate.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL_WO_SCHEMA as string, {max: 1});
const db = drizzle(sql);

migrate(db, {
  migrationsFolder: "drizzle/migrations",
  migrationsSchema: "drizzle/schema.ts",
}).then(() => sql.end());