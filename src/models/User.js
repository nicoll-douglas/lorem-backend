const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bucket = require("@/services/firebaseStorage");

const user = new mongoose.Schema(
  {
    username: String,
    email: String,
    hashedPassword: String,
    refreshToken: String,
    verified: {
      type: Boolean,
      default: false,
    },
    age: Number,
    pronouns: String,
    bio: String,
    hasAvatar: {
      type: mongoose.Schema.Types.Mixed,
      default: false,
      enum: [String, Boolean],
    },
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

user.virtual("avatar").get(function () {
  if (!this.hasAvatar) return null;
  if (typeof this.hasAvatar === "string") return this.hasAvatar;
  return bucket.file(`avatar-${this._id.toString()}`).publicUrl();
});

user.methods.setPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  this.hashedPassword = hashedPassword;
  return this;
};

module.exports = mongoose.model("User", user);
