const passport = require("passport");
/**
 * Middleware to authenticate users using JWT.
 * This middleware uses Passport.js with the JWT strategy.
 * It ensures that the user is authenticated and the session is not used.
 */
exports.userAuth = passport.authenticate("jwt", { session: false });
