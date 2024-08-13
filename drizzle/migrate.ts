// LOCAL
// import "dotenv/config";
// import postgres from "postgres";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
// import { drizzle } from "drizzle-orm/postgres-js";
// import * as schema from "./schema";

// const migrationClient = postgres(process.env.DATABASE_URL_WO_SCHEMA as string, {max: 1});
// migrate(drizzle(migrationClient, {schema}), { migrationsFolder: "drizzle/migrations/" });

// NEON
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const migrationClient = neon(process.env.DATABASE_URL_WO_SCHEMA as string);
const db = drizzle(migrationClient, {schema});
migrate(db, { migrationsFolder: "drizzle/migrations/" });