import "dotenv/config";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./dbTypes";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    max: 10,
  })
})

export const db = new Kysely<Database>({dialect});