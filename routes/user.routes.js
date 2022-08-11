const express = require("express");
const router = express.Router();
const { signUp, signIn, isUser } = require("../controllers/user.controller");

router.post("/signup", function (req, res, next) {
  signUp(req, res, next);
});

router.post("/signin", function (req, res, next) {
  signIn(req, res, next);
});

router.patch("/adjust", function (req, res, next) {
  isUser(req, res, next);
  adjustUser(req, res, next);
});

module.exports = router;
