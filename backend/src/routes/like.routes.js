const express = require("express");
const protect = require("../middleware/authMiddleware");
const { likePost, unlikePost } = require("../controllers/like.controller");

const router = express.Router();

router.post("/:postId", protect, likePost);    // POST  /api/likes/:postId
router.delete("/:postId", protect, unlikePost);// DELETE /api/likes/:postId

module.exports = router;
