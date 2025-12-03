const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  createPost,
  getPostById,
  deletePost,
  getUserPosts,
  getFeed,
} = require("../controllers/post.controller");

const router = express.Router();

router.get("/feed", protect, getFeed);
router.get("/:id", getPostById);
router.get("/user/:userId", getUserPosts);

router.post("/", protect, upload.single("image"), createPost);
router.delete("/:id", protect, deletePost);

module.exports = router;
