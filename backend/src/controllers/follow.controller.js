const Follow = require("../models/Follow");
const User = require("../models/User");
const Notification = require("../models/Notification");

const followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      res.status(400);
      return next(new Error("Cannot follow yourself"));
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      res.status(404);
      return next(new Error("User not found"));
    }

    // create follow (unique index prevents duplicates)
    try {
      await Follow.create({ follower: req.user._id, following: userId });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "Already following" });
      }
      throw err;
    }

    // update counts (atomicity not perfect but ok for dev)
    await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });

    // notification
    await Notification.create({
      user: userId,
      actor: req.user._id,
      type: "follow",
    });

    res.json({ message: "Followed user" });
  } catch (err) {
    next(err);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const deleted = await Follow.findOneAndDelete({
      follower: req.user._id,
      following: userId,
    });

    if (!deleted) {
      res.status(400);
      return next(new Error("Not following"));
    }

    await User.findByIdAndUpdate(req.user._id, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });

    res.json({ message: "Unfollowed user" });
  } catch (err) {
    next(err);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followers = await Follow.find({ following: userId }).populate("follower", "username avatarUrl");
    res.json(followers.map(f => f.follower));
  } catch (err) {
    next(err);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ follower: userId }).populate("following", "username avatarUrl");
    res.json(following.map(f => f.following));
  } catch (err) {
    next(err);
  }
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowing };
