// LOCAL
// import "dotenv/config";
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from "./schema";

// export const queryClient = postgres(process.env.DATABASE_URL_WO_SCHEMA as string, {max: 1});
// export const db = drizzle(queryClient, {schema});

// NEON
import "dotenv/config";
import { neon } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const queryClient = neon(process.env.DATABASE_URL_WO_SCHEMA as string);
export const db = drizzle(queryClient, {schema});