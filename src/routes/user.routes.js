const express = require("express");
const { getUserProfile, updateMe } = require("../controllers/user.controller");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// public profile by username
router.get("/:username", getUserProfile);

// update logged-in user
router.patch("/me", protect, updateMe);

module.exports = router;
