const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getNotifications, markRead } = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", protect, getNotifications);           // GET  /api/notifications
router.patch("/:id/read", protect, markRead);         // PATCH /api/notifications/:id/read

module.exports = router;
