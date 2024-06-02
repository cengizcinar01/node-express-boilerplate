const { Pool } = require("pg");
const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
  DB_USER: str({ default: "postgres" }),
  DB_HOST: str(),
  DB_NAME: str(),
  DB_PASS: str(),
  DB_PORT: port({ default: 5432 }),
});

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASS,
  port: env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
