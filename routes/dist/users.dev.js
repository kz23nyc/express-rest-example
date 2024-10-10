"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _users = require("../data/users.js");

var _error = require("../utils/error.js");

var usersRouter = (0, _express.Router)();
/**
 * GET
 */

usersRouter.get("/", function (req, res, next) {
  console.log(req.query);
  console.log("APIKEY::: ", req.key); // next(error(402, 'Something went wrong!'))

  res.json(_users.users);
});
/**
 * GET by id
 */

usersRouter.get("/:id", function (req, res, next) {
  console.log(req.params);

  var user = _users.users.find(function (user) {
    return user.id == req.params.id;
  });

  if (user) {
    res.json(user);
  } else {
    next((0, _error.error)(404, "Resource not found!")); // calls the custom 404 middleware
  }
});
/**
 * POST
 */

usersRouter.post("/", function (req, res) {
  console.log(req.body);

  if (req.body.name && req.body.username && req.body.email) {
    if (_users.users.find(function (u) {
      return u.username == req.body.username;
    })) {
      res.json({
        error: "Username Already Taken"
      });
      return;
    }

    var user = {
      id: _users.users[_users.users.length - 1].id + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email
    };

    _users.users.push(user);

    res.json(_users.users[_users.users.length - 1]);
  }
});
/**
 * PATCH OR UPDATE by id
 */

usersRouter.patch("/:id", function (req, res, next) {
  console.log(req.params);

  var user = _users.users.find(function (u, i) {
    if (u.id == req.params.id) {
      for (var key in req.body) {
        _users.users[i][key] = req.body[key];
      }

      return true;
    }
  });

  if (user) res.json(user);else next();
});
/**
 * DELETE by id
 */

usersRouter["delete"]("/:id", function (req, res, next) {
  console.log(req.params);

  var user = _users.users.find(function (u, i) {
    if (u.id == req.params.id) {
      _users.users.splice(i, 1);

      return true;
    }
  });

  if (user) res.json(user);else next();
});
var _default = usersRouter;
exports["default"] = _default;