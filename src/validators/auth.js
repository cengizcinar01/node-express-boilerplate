const { body } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");

// Password validation
const password = body("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Password has to be between 6 and 15 characters.");

// Email validation
const email = body("email")
  .isEmail()
  .withMessage("Please provide a valid email.");

// Check if email exists
const emailExists = body("email").custom(async (value) => {
  const { rows } = await db.query("SELECT * from users WHERE email = $1", [
    value,
  ]);

  if (rows.length) {
    throw new Error("Email already exists.");
  }
});

// Login validation
const loginFieldCheck = body("email").custom(async (value, { req }) => {
  const { rows } = await db.query("SELECT * from users WHERE email = $1", [
    value,
  ]);
  if (!rows.length) {
    throw new Error("Email does not exist.");
  }

  const validPassword = await compare(req.body.password, rows[0].password);

  if (!validPassword) {
    throw new Error("Wrong password.");
  }

  req.user = rows[0];
});

module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [loginFieldCheck],
};
