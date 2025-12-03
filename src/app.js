const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const errorHandler = require("./middleware/errorHandler");
const commentRoutes = require("./routes/comment.routes");
const likeRoutes = require("./routes/like.routes");
const followRoutes = require("./routes/follow.routes");
const notificationRoutes = require("./routes/notification.routes");



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/notifications", notificationRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ message: "ConnectHub API is running 🚀" });
});

// Error handler
app.use(errorHandler);

module.exports = app;
