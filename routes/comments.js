import { Router } from "express";
import { comments } from "../data/comments.js";
import { users } from "../data/users.js";
import { posts } from "../data/posts.js";
import { error } from "../utils/error.js";

const commentsRouter = Router();

/**
 * Helper Function: Generate Unique ID
 */
const generateId = () => {
  return comments.length > 0 ? comments[comments.length - 1].id + 1 : 1;
};

/**
 * GET /api/comments
 * Retrieve all comments or filter by userId or postId via query parameters.
 */
commentsRouter.get("/", (req, res) => {
  const { userId, postId } = req.query;
  let filteredComments = comments;

  if (userId) {
    filteredComments = filteredComments.filter(
      (comment) => comment.userId === parseInt(userId)
    );
  }

  if (postId) {
    filteredComments = filteredComments.filter(
      (comment) => comment.postId === parseInt(postId)
    );
  }

  res.json(filteredComments);
});

/**
 * POST /api/comments
 * Create a new comment.
 */
commentsRouter.post("/", (req, res, next) => {
  const { userId, postId, body } = req.body;

  if (!userId || !postId || !body) {
    return next(error(400, "userId, postId, and body are required."));
  }

  // Validate userId
  const userExists = users.some((user) => user.id === parseInt(userId));
  if (!userExists) {
    return next(error(400, "Invalid userId."));
  }

  // Validate postId
  const postExists = posts.some((post) => post.id === parseInt(postId));
  if (!postExists) {
    return next(error(400, "Invalid postId."));
  }

  const newComment = {
    id: generateId(),
    userId: parseInt(userId),
    postId: parseInt(postId),
    body,
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

/**
 * GET /api/comments/:id
 * Retrieve a comment by ID.
 */
commentsRouter.get("/:id", (req, res, next) => {
  const comment = comments.find(
    (comment) => comment.id === parseInt(req.params.id)
  );

  if (comment) {
    res.json(comment);
  } else {
    next(error(404, "Comment not found."));
  }
});

/**
 * PATCH /api/comments/:id
 * Update a comment's body by ID.
 */
commentsRouter.patch("/:id", (req, res, next) => {
  const comment = comments.find(
    (comment) => comment.id === parseInt(req.params.id)
  );

  if (comment) {
    const { body } = req.body;
    if (body) {
      comment.body = body;
      res.json(comment);
    } else {
      next(error(400, "Body is required to update the comment."));
    }
  } else {
    next(error(404, "Comment not found."));
  }
});

/**
 * DELETE /api/comments/:id
 * Delete a comment by ID.
 */
commentsRouter.delete("/:id", (req, res, next) => {
  const commentIndex = comments.findIndex(
    (comment) => comment.id === parseInt(req.params.id)
  );

  if (commentIndex !== -1) {
    const deletedComment = comments.splice(commentIndex, 1)[0];
    res.json(deletedComment);
  } else {
    next(error(404, "Comment not found."));
  }
});

/**
 * GET /api/posts/:id/comments
 * Retrieve all comments for a specific post.
 */
commentsRouter.get("/posts/:id/comments", (req, res, next) => {
  const postId = parseInt(req.params.id);
  const postExists = posts.some((post) => post.id === postId);

  if (!postExists) {
    return next(error(404, "Post not found."));
  }

  const postComments = comments.filter((comment) => comment.postId === postId);
  res.json(postComments);
});

/**
 * GET /api/users/:id/comments
 * Retrieve all comments made by a specific user.
 */
commentsRouter.get("/users/:id/comments", (req, res, next) => {
  const userId = parseInt(req.params.id);
  const userExists = users.some((user) => user.id === userId);

  if (!userExists) {
    return next(error(404, "User not found."));
  }

  const userComments = comments.filter(
    (comment) => comment.userId === userId
  );
  res.json(userComments);
});

/**
 * GET /api/posts/:id/comments?userId=<VALUE>
 * Retrieve all comments for a post by a specific user.
 */
commentsRouter.get("/posts/:id/comments", (req, res, next) => {
  const postId = parseInt(req.params.id);
  const { userId } = req.query;

  const postExists = posts.some((post) => post.id === postId);
  if (!postExists) {
    return next(error(404, "Post not found."));
  }

  let filteredComments = comments.filter(
    (comment) => comment.postId === postId
  );

  if (userId) {
    filteredComments = filteredComments.filter(
      (comment) => comment.userId === parseInt(userId)
    );
  }

  res.json(filteredComments);
});

/**
 * GET /api/users/:id/comments?postId=<VALUE>
 * Retrieve all comments by a user on a specific post.
 */
commentsRouter.get("/users/:id/comments", (req, res, next) => {
  const userId = parseInt(req.params.id);
  const { postId } = req.query;

  const userExists = users.some((user) => user.id === userId);
  if (!userExists) {
    return next(error(404, "User not found."));
  }

  let filteredComments = comments.filter(
    (comment) => comment.userId === userId
  );

  if (postId) {
    filteredComments = filteredComments.filter(
      (comment) => comment.postId === parseInt(postId)
    );
  }

  res.json(filteredComments);
});

export default commentsRouter;
