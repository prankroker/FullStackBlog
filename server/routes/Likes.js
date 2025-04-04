const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");
const { where } = require("sequelize");

router.post("/", validateToken, async (req, res) => {
  const userId = req.user.id;
  const { PostId } = req.body;

  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: userId },
  });
  if (!found) {
    await Likes.create({ PostId: PostId, UserId: userId });
    res.json({ liked: true });
  } else {
    await Likes.destroy({
      where: { PostId: PostId, UserId: userId },
    });
    res.json({ liked: false });
  }
});

module.exports = router;
