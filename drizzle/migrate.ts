// LOCAL
// import "dotenv/config";
// import postgres from "postgres";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
// import { drizzle } from "drizzle-orm/postgres-js";
// import * as schema from "./schema";

// const migrationClient = postgres(process.env.DATABASE_URL as string, {max: 1});
// migrate(drizzle(migrationClient, {schema}), { migrationsFolder: "drizzle/migrations/" });


// SUPABASE
import "dotenv/config";
import { Client } from "pg";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const migrationClient = new Client({connectionString: process.env.DATABASE_URL as string});
const db = drizzle(migrationClient, {schema});
migrate(db, { migrationsFolder: "drizzle/migrations/" });