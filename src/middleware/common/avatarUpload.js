const multer = require("multer");

const storage = multer.memoryStorage();
const processAvatar = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");

module.exports = processAvatar;