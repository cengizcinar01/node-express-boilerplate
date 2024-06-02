const passport = require("passport");
const { Strategy } = require("passport-jwt");
const { SECRET } = require("../constants");
const db = require("../db");

const cookieExtractor = function (req) {
  const token = req && req.cookies ? req.cookies["token"] : null;
  return token;
};

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
};

passport.use(
  new Strategy(opts, async ({ id }, done) => {
    try {
      const { rows } = await db.query(
        "SELECT user_id AS id, email FROM users WHERE user_id = $1",
        [id]
      );

      if (!rows.length) {
        return done(null, false, { message: "401 not authorized" });
      }

      const user = { id: rows[0].id, email: rows[0].email };

      return done(null, user);
    } catch (error) {
      console.error(error.message);
      return done(error, false);
    }
  })
);

module.exports = passport;
