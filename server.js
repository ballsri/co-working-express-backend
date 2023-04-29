const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const co_working = require("./routes/co-working");
const user = require("./routes/user");
const auth = require("./routes/auth");
const cors = require("cors");

const app = express();

//Enable CORS
app.use(cors());

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

app.use("/api/v1/co-working", co_working);
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);


const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    "Care-Working is running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);
