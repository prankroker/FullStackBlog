const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middleware/AuthMiddleware");
const { where } = require("sequelize");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
  });
  res.json("Success");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user) {
    res.json({ error: "User doesn't exist" });
  } else {
    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) {
        res.json({ error: "Wrong username and/or password combination" });
      } else {
        const accessToken = sign(
          {
            username: user.username,
            id: user.id,
          },
          "secret"
        );
        res.json({ token: accessToken, username: user.username, id: user.id });
      }
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicinfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicinfo);
});

router.get("/userinfo/:username", async (req, res) => {
  const username = req.params.username;

  const userInfo = await Users.findOne({
    where: { username: username },
    attributes: { exclude: ["password"] },
  });
  res.json(userInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPass, newPass } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });
  bcrypt.compare(oldPass, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong password" });
    bcrypt.hash(newPass, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
    });
    res.json("password updated");
  });
});

module.exports = router;
