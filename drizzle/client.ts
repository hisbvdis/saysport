// LOCAL
// import "dotenv/config";
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from "./schema";

// export const queryClient = postgres(process.env.DATABASE_URL as string, {max: 1});
// export const db = drizzle(queryClient, {schema});


// SUPABASE
import "dotenv/config";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres'
import * as schema from "./schema";

export const queryClient = postgres(process.env.DATABASE_URL as string, {max: 1});
export const db = drizzle(queryClient, {schema});