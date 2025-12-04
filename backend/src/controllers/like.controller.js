const Like = require("../models/Like");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      return next(new Error("Post not found"));
    }

    // create like (unique index prevents duplicates)
    try {
      await Like.create({ user: req.user._id, post: postId });
    } catch (err) {
      // duplicate key error -> already liked
      if (err.code === 11000) {
        return res.status(400).json({ message: "Already liked" });
      }
      throw err;
    }

    post.likesCount = (post.likesCount || 0) + 1;
    await post.save();

    // notification to post owner (if not own post)
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        actor: req.user._id,
        type: "like",
        post: post._id,
      });
    }

    res.json({ message: "Post liked" });
  } catch (err) {
    next(err);
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const like = await Like.findOneAndDelete({ user: req.user._id, post: postId });
    if (!like) {
      res.status(400);
      return next(new Error("Not liked yet"));
    }

    // decrement count
    const post = await Post.findById(postId);
    if (post) {
      post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
      await post.save();
    }

    res.json({ message: "Post unliked" });
  } catch (err) {
    next(err);
  }
};

module.exports = { likePost, unlikePost };
