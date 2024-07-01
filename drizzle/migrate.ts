import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const migrationClient = postgres(process.env.DATABASE_URL_WO_SCHEMA as string, {max: 1});
migrate(drizzle(migrationClient, {schema}), {migrationsFolder: "./migrations/"});