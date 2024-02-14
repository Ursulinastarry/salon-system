import express from "express";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import appRoutes from "./routes/api.js";
import expressSession from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import pool from "./config/config.js";
import passport from "passport";
import { configurePassport } from "./config/passport.js";
import flash from "express-flash";
import helmet from "helmet";

config();

const app = express();

// cors optiosns
const cors_options = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  credentials: true,
};

// app config
app.use(cors(cors_options));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash()); // Initialize express-flash middleware, to enable flash messages

// Initialize helmet middleware, to secure the app by setting various HTTP headers
app.use(
    helmet({
      contentSecurityPolicy: false, // Disable default contentSecurityPolicy
      frameguard: {
        action: 'deny' // Set X-Frame-Options to DENY
      },
      permissionsPolicy: {
        features: {
          fullscreen: ["'self'"] // Allow fullscreen only for 'self'
        }
      },
      hsts: {
        maxAge: 31536000, // Set Strict-Transport-Security header to 1 year
        includeSubDomains: true // Include subdomains in HSTS
      }
    })
  );

const MySQLStore = MySQLStoreFactory(expressSession); // Creating the store with express-mysql-session

// Create session store with MySQLStore
const sessionStore = new MySQLStore(
  {
    expiration: 1000 * 60 * 60, 
    createDatabaseTable: true, // Create database table if it doesntnot exists
    clearExpired: true, // Clear expired sessions automatically
    checkExpirationInterval: 1000 * 60 * 60, // The interval at which to check for expired sessions (millisec)
    waitForConnections: true,
    
  },
  pool
);

//   session config
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

// Passport configuration
configurePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

// app routes
app.use("/api/v1", appRoutes);

// server setup
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
