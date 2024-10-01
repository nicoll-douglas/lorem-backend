const User = require("@/models/User");

exports.avatar = require("./avatar.controller");
exports.replies = require("./replies.controller");
exports.boards = require("./boards.controller");
exports.threads = require("./threads.controller");

exports.getUser = (options = { me: false }) => {
  return async (req, res, next) => {
    const isMe = options.me;
    const query = isMe
      ? { _id: req.user._id }
      : { username: req.params.username };

    req.log("query for requested user profile");
    try {
      let requestedUser = await User.findOne(query).select(
        "username age bio hasAvatar pronouns createdAt threads boards replies deleted"
      );

      if (!requestedUser || requestedUser.deleted) {
        req.log("not found, 404, sent");
        return res.status(404)._end();
      }

      req.log("user to object");
      requestedUser = requestedUser.toObject();
      if (!isMe) {
        res._append("user", {
          username: req.user.username,
        });
      }
      req.log("200, appended user, sent");
      return res.status(200)._append("profile", requestedUser)._end();
    } catch (err) {
      next(err);
    }
  };
};

exports.updateUser = async (req, res, next) => {
  const user = req.user;
  const { pronouns, age, bio } = req.body;

  req.log("updating user");
  try {
    user.age = age;
    user.bio = bio;
    user.pronouns = pronouns;
    await user.save();
    req.log("user saved, 200, sent");
    res.status(200)._end();
  } catch (err) {
    next(err);
  }
};