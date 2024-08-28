import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({connectionString: process.env.DATABASE_URL as string});
client.connect();
export const db = drizzle(client, {schema});