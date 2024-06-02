const { config } = require("dotenv");
const { cleanEnv, str, port } = require("envalid");

config();

const env = cleanEnv(process.env, {
  PORT: port({ default: 8000 }),
  SERVER_URL: str({ default: "http://localhost:8000" }),
  CLIENT_URL: str(),
  SECRET: str(),
});

module.exports = {
  PORT: env.PORT,
  SERVER_URL: env.SERVER_URL,
  CLIENT_URL: env.CLIENT_URL,
  SECRET: env.SECRET,
};
