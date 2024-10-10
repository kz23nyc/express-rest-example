"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _posts = require("../data/posts.js");

var _error = require("../utils/error.js");

var _filter = require("../middlewares/filter.js");

var postsRouter = (0, _express.Router)();
/**
 * GET /api/posts
 * Retrieve all posts or filter by query parameters.
 */

postsRouter.get("/", (0, _filter.filterMiddleware)(_posts.posts));
/**
 * GET /api/posts/:id
 * Retrieve a specific post by ID.
 */

postsRouter.get("/:id", function (req, res, next) {
  var post = _posts.posts.find(function (post) {
    return post.id === parseInt(req.params.id);
  });

  if (post) {
    res.json(post);
  } else {
    next((0, _error.error)(404, "Post not found."));
  }
});
var _default = postsRouter;
exports["default"] = _default;