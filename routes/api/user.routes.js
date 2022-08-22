const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  sendLoginStatus,
  adjustUser,
  availableUsers,
  deleteUser,
  reportUsers,
} = require("../../controllers/api/user.controller");

router.post("/signup", function (req, res, next) {
  signUp(req, res, next);
});

router.post("/signin", function (req, res, next) {
  signIn(req, res, next);
});

router.patch("/adjust", function (req, res, next) {
  adjustUser(req, res, next);
});

router.get("/authcheck", function (req, res, next) {
  sendLoginStatus(req, res, next);
});

router.delete("/delete", function (req, res, next) {
  deleteUser(req, res, next);
});

//for swipe
router.get("/available", function (req, res, next) {
  //isUser(req, res, next);
  availableUsers(req, res, next);
});

//for report
router.patch("/report", function (req, res, next) {
  reportUsers(req, res, next);
});

module.exports = router;
