const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  sendLoginStatus,
  adjustUser,
  availableUsers,
  deleteUser,
  swipeUser,
  getUserInfo,
  getCurrentUserId,
  signOut,
  getUserSettingInfo,
  reportUser,
} = require("../../controllers/api/user.controller");

router.post("/signup", function (req, res, next) {
  signUp(req, res, next);
});

router.post("/signin", function (req, res, next) {
  signIn(req, res, next);
});

router.get("/signout", function (req, res, next) {
  signOut(req, res, next);
});

router.get("/setting", function (req, res, next) {
  getUserSettingInfo(req, res, next);
});

router.patch("/adjust", function (req, res, next) {
  adjustUser(req, res, next);
});

router.get("/authcheck", function (req, res, next) {
  sendLoginStatus(req, res, next);
});

router.get("/current-user-id", function (req, res, next) {
  getCurrentUserId(req, res, next);
});
router.get("/info/:id", function (req, res, next) {
  getUserInfo(req, res, next);
});

router.delete("/delete", function (req, res, next) {
  deleteUser(req, res, next);
});

router.get("/available", function (req, res, next) {
  availableUsers(req, res, next);
});

router.patch("/swipe", function (req, res, next) {
  swipeUser(req, res, next);
});

router.patch("/addcomment", function (req, res, next) {
  addComment(req, res, next);
});

router.patch("/report", function (req, res, next) {
  reportUser(req, res, next);
});

module.exports = router;
