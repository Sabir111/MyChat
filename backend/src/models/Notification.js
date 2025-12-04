const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jo notification paega
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jisne action kiya
    type: { type: String, enum: ["follow", "like", "comment"], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // optional
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
