// index.js

import express from "express";
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";
import commentsRouter from "./routes/comments.js"; // Import the comments router
import { error } from "./utils/error.js";

const app = express();
const PORT = 4000;

// Valid API Keys
const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  const time = new Date();
  console.log(
    `-----\n  ${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );

  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }

  next();
});

// API Key Middleware
app.use("/api", (req, res, next) => {
  const key = req.query["api-key"];

  if (!key) {
    return next(error(400, "API Key Required"));
  }

  if (!apiKeys.includes(key)) {
    return next(error(401, "Invalid API Key"));
  }

  req.key = key;
  next();
});

// API Routes
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter); // Use the comments router

// Root Route
app.get("/", (req, res) => {
  res.send("ok");
});

// Custom 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: error.message,
  });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
