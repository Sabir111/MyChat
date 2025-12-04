const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsForPost,
  deleteComment,
} = require("../controllers/comment.controller");

const router = express.Router();

router.post("/:postId", protect, addComment);         // POST /api/comments/:postId
router.get("/:postId", getCommentsForPost);            // GET  /api/comments/:postId
router.delete("/:id", protect, deleteComment);        // DELETE /api/comments/:id

module.exports = router;
