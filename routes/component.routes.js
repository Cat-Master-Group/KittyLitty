const express = require("express");
const componentController = require("../controllers/component.controller");
const router = express.Router();

router.get("/signin", function (req, res, next) {
  componentController.loadSignin(req, res, next);
});

router.get("/signup", function (req, res, next) {
  componentController.loadSignup(req, res, next);
});

router.get("/header-menu", function (req, res, next) {
  componentController.loadHeaderMenu(req, res, next);
})

router.get("/followed-list", function (req, res, next) {
  componentController.loadFollowedList(req, res, next);
});

router.get("/settings", function (req, res, next) {
  componentController.loadSettings(req, res, next);
});

router.get("/user-info/:id", function (req, res, next) {
  componentController.loadUserInfo(req, res, next);
});

//swipe
router.get("/available", function (req, res, next) {
  componentController.loadAvailable(req, res, next);
});

router.get("/messages", function (req, res, next) {
  componentController.loadMessages(req, res, next);
});

module.exports = router;
