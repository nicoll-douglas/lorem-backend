const mongoose = require("mongoose");

const reply = new mongoose.Schema(
  {
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Reply" },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Reply", reply);
