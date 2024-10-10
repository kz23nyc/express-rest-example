import { Router } from "express";
import { posts } from "../data/posts.js";
import { error } from "../utils/error.js";
import { filterMiddleware } from "../middlewares/filter.js";

const postsRouter = Router();

/**
 * GET /api/posts
 * Retrieve all posts or filter by query parameters.
 */
postsRouter.get("/", filterMiddleware(posts));

/**
 * GET /api/posts/:id
 * Retrieve a specific post by ID.
 */
postsRouter.get("/:id", (req, res, next) => {
  const post = posts.find((post) => post.id === parseInt(req.params.id));

  if (post) {
    res.json(post);
  } else {
    next(error(404, "Post not found."));
  }
});

export default postsRouter;
