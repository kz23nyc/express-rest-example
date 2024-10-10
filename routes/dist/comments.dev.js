"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _comments = require("../data/comments.js");

var _users = require("../data/users.js");

var _posts = require("../data/posts.js");

var _error = require("../utils/error.js");

var commentsRouter = (0, _express.Router)();
/**
 * Helper Function: Generate Unique ID
 */

var generateId = function generateId() {
  return _comments.comments.length > 0 ? _comments.comments[_comments.comments.length - 1].id + 1 : 1;
};
/**
 * GET /api/comments
 * Retrieve all comments or filter by userId or postId via query parameters.
 */


commentsRouter.get("/", function (req, res) {
  var _req$query = req.query,
      userId = _req$query.userId,
      postId = _req$query.postId;
  var filteredComments = _comments.comments;

  if (userId) {
    filteredComments = filteredComments.filter(function (comment) {
      return comment.userId === parseInt(userId);
    });
  }

  if (postId) {
    filteredComments = filteredComments.filter(function (comment) {
      return comment.postId === parseInt(postId);
    });
  }

  res.json(filteredComments);
});
/**
 * POST /api/comments
 * Create a new comment.
 */

commentsRouter.post("/", function (req, res, next) {
  var _req$body = req.body,
      userId = _req$body.userId,
      postId = _req$body.postId,
      body = _req$body.body;

  if (!userId || !postId || !body) {
    return next((0, _error.error)(400, "userId, postId, and body are required."));
  } // Validate userId


  var userExists = _users.users.some(function (user) {
    return user.id === parseInt(userId);
  });

  if (!userExists) {
    return next((0, _error.error)(400, "Invalid userId."));
  } // Validate postId


  var postExists = _posts.posts.some(function (post) {
    return post.id === parseInt(postId);
  });

  if (!postExists) {
    return next((0, _error.error)(400, "Invalid postId."));
  }

  var newComment = {
    id: generateId(),
    userId: parseInt(userId),
    postId: parseInt(postId),
    body: body
  };

  _comments.comments.push(newComment);

  res.status(201).json(newComment);
});
/**
 * GET /api/comments/:id
 * Retrieve a comment by ID.
 */

commentsRouter.get("/:id", function (req, res, next) {
  var comment = _comments.comments.find(function (comment) {
    return comment.id === parseInt(req.params.id);
  });

  if (comment) {
    res.json(comment);
  } else {
    next((0, _error.error)(404, "Comment not found."));
  }
});
/**
 * PATCH /api/comments/:id
 * Update a comment's body by ID.
 */

commentsRouter.patch("/:id", function (req, res, next) {
  var comment = _comments.comments.find(function (comment) {
    return comment.id === parseInt(req.params.id);
  });

  if (comment) {
    var body = req.body.body;

    if (body) {
      comment.body = body;
      res.json(comment);
    } else {
      next((0, _error.error)(400, "Body is required to update the comment."));
    }
  } else {
    next((0, _error.error)(404, "Comment not found."));
  }
});
/**
 * DELETE /api/comments/:id
 * Delete a comment by ID.
 */

commentsRouter["delete"]("/:id", function (req, res, next) {
  var commentIndex = _comments.comments.findIndex(function (comment) {
    return comment.id === parseInt(req.params.id);
  });

  if (commentIndex !== -1) {
    var deletedComment = _comments.comments.splice(commentIndex, 1)[0];

    res.json(deletedComment);
  } else {
    next((0, _error.error)(404, "Comment not found."));
  }
});
/**
 * GET /api/posts/:id/comments
 * Retrieve all comments for a specific post.
 */

commentsRouter.get("/posts/:id/comments", function (req, res, next) {
  var postId = parseInt(req.params.id);

  var postExists = _posts.posts.some(function (post) {
    return post.id === postId;
  });

  if (!postExists) {
    return next((0, _error.error)(404, "Post not found."));
  }

  var postComments = _comments.comments.filter(function (comment) {
    return comment.postId === postId;
  });

  res.json(postComments);
});
/**
 * GET /api/users/:id/comments
 * Retrieve all comments made by a specific user.
 */

commentsRouter.get("/users/:id/comments", function (req, res, next) {
  var userId = parseInt(req.params.id);

  var userExists = _users.users.some(function (user) {
    return user.id === userId;
  });

  if (!userExists) {
    return next((0, _error.error)(404, "User not found."));
  }

  var userComments = _comments.comments.filter(function (comment) {
    return comment.userId === userId;
  });

  res.json(userComments);
});
/**
 * GET /api/posts/:id/comments?userId=<VALUE>
 * Retrieve all comments for a post by a specific user.
 */

commentsRouter.get("/posts/:id/comments", function (req, res, next) {
  var postId = parseInt(req.params.id);
  var userId = req.query.userId;

  var postExists = _posts.posts.some(function (post) {
    return post.id === postId;
  });

  if (!postExists) {
    return next((0, _error.error)(404, "Post not found."));
  }

  var filteredComments = _comments.comments.filter(function (comment) {
    return comment.postId === postId;
  });

  if (userId) {
    filteredComments = filteredComments.filter(function (comment) {
      return comment.userId === parseInt(userId);
    });
  }

  res.json(filteredComments);
});
/**
 * GET /api/users/:id/comments?postId=<VALUE>
 * Retrieve all comments by a user on a specific post.
 */

commentsRouter.get("/users/:id/comments", function (req, res, next) {
  var userId = parseInt(req.params.id);
  var postId = req.query.postId;

  var userExists = _users.users.some(function (user) {
    return user.id === userId;
  });

  if (!userExists) {
    return next((0, _error.error)(404, "User not found."));
  }

  var filteredComments = _comments.comments.filter(function (comment) {
    return comment.userId === userId;
  });

  if (postId) {
    filteredComments = filteredComments.filter(function (comment) {
      return comment.postId === parseInt(postId);
    });
  }

  res.json(filteredComments);
});
var _default = commentsRouter;
exports["default"] = _default;