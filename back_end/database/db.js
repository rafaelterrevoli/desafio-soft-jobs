import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  password: "secreto",
  host: "localhost",
  database: "softjobs",
  port: "9000",
  allowExitOnIdle: true,
});
