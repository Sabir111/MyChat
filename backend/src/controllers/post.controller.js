const Post = require("../models/Post");
const Follow = require("../models/Follow");
const cloudinary = require("../config/cloudinary");

const createPost = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error("Image is required"));
    }

    const uploaded = await cloudinary.uploader.upload_stream(
      { folder: "connecthub/posts" },
      async (error, result) => {
        if (error) {
          return next(error);
        }

        const post = await Post.create({
          author: req.user._id,
          imageUrl: result.secure_url,
          caption: req.body.caption || "",
        });

        return res.status(201).json(post);
      }
    );

    // stream me file buffer pass
    const stream = uploaded;
    stream.end(req.file.buffer);
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username avatarUrl");
    if (!post) {
      res.status(404);
      return next(new Error("Post not found"));
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) {
      res.status(404);
      return next(new Error("Post not found or not authorized"));
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const following = await Follow.find({ follower: req.user._id }).select("following");
    const followingIds = following.map((f) => f.following);

    const posts = await Post.find({
      author: { $in: [...followingIds, req.user._id] },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatarUrl");

    res.json(posts);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  getPostById,
  deletePost,
  getUserPosts,
  getFeed,
};
