// PG
// import "dotenv/config";
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Client } from "pg";
// import * as schema from "./schema";

// const client = new Client({connectionString: process.env.DATABASE_URL as string});
// client.connect();
// export const db = drizzle(client, {schema, logger: true});


// POSTGRES-JS
// import "dotenv/config";
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from "./schema";

// const pool = postgres(process.env.DATABASE_URL as string);

// export const db = drizzle(pool, {schema, logger: true });


//
// import "dotenv/config";
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Client } from "pg";
// import * as schema from "./schema";

// export const db = async () => {
//   const client = new Client({connectionString: process.env.DATABASE_URL as string});
//   await client.connect();
//   return drizzle(client, {schema, logger: true});
// };

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({connectionString: process.env.DATABASE_URL as string});
export const db = drizzle(pool, {schema});