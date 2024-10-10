"use strict";

var _express = _interopRequireDefault(require("express"));

var _posts = _interopRequireDefault(require("./routes/posts.js"));

var _users = _interopRequireDefault(require("./routes/users.js"));

var _comments = _interopRequireDefault(require("./routes/comments.js"));

var _error = require("./utils/error.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// index.js
// Import the comments router
var app = (0, _express["default"])();
var PORT = 4000; // Valid API Keys

var apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"]; // Middlewares

app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json()); // Logging Middleware

app.use(function (req, res, next) {
  var time = new Date();
  console.log("-----\n  ".concat(time.toLocaleTimeString(), ": Received a ").concat(req.method, " request to ").concat(req.url, "."));

  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log("".concat(JSON.stringify(req.body)));
  }

  next();
}); // API Key Middleware

app.use("/api", function (req, res, next) {
  var key = req.query["api-key"];

  if (!key) {
    return next((0, _error.error)(400, "API Key Required"));
  }

  if (!apiKeys.includes(key)) {
    return next((0, _error.error)(401, "Invalid API Key"));
  }

  req.key = key;
  next();
}); // API Routes

app.use("/api/posts", _posts["default"]);
app.use("/api/users", _users["default"]);
app.use("/api/comments", _comments["default"]); // Use the comments router
// Root Route

app.get("/", function (req, res) {
  res.send("ok");
}); // Custom 404 Middleware

app.use(function (req, res, next) {
  next((0, _error.error)(404, "Resource Not Found"));
}); // Error Handling Middleware

app.use(function (error, req, res, next) {
  res.status(error.status || 500).json({
    error: error.message
  });
}); // Start Server

app.listen(PORT, function () {
  return console.log("Server running on port: ".concat(PORT));
});