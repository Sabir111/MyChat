const User = require("../models/User");

const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const updates = {
      bio: req.body.bio,
      avatarUrl: req.body.avatarUrl, // baad me cloudinary se aayega
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProfile,
  updateMe,
};
