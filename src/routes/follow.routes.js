const express = require("express");
const protect = require("../middleware/authMiddleware");
const { followUser, unfollowUser, getFollowers, getFollowing } = require("../controllers/follow.controller");

const router = express.Router();

router.post("/:userId", protect, followUser);         // POST /api/follows/:userId
router.delete("/:userId", protect, unfollowUser);     // DELETE /api/follows/:userId
router.get("/:userId/followers", getFollowers);       // GET /api/follows/:userId/followers
router.get("/:userId/following", getFollowing);       // GET /api/follows/:userId/following

module.exports = router;
