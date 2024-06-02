const express = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

// Import passport middleware
require("./middlewares/passport-middleware");

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "development" ? "*" : CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));

// Health Check Route
app.get("/health", (req, res) => {
  res.sendStatus(200);
});

// Middleware to check Referer header
app.use((req, res, next) => {
  if (req.path === "/health") {
    return next();
  }
  if (process.env.NODE_ENV === "development") {
    return next();
  }
  const referer = req.headers.referer;
  if (referer && referer.startsWith(CLIENT_URL)) {
    // Request from allowed URL
    next();
  } else {
    // Request from disallowed URL
    res.status(403).send("Access denied");
  }
});

// Initialize middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Import routes
const authRoutes = require("./routes/auth");

// Initialize routes
app.use("/api", authRoutes);

// App start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

appStart();
