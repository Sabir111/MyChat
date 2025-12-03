const Notification = require("../models/Notification");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("actor", "username avatarUrl")
      .populate("post", "imageUrl");

    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOne({ _id: id, user: req.user._id });
    if (!notif) {
      res.status(404);
      return next(new Error("Notification not found"));
    }
    notif.isRead = true;
    await notif.save();
    res.json({ message: "Marked read" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markRead };
