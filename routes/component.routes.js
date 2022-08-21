const express = require("express");
const componentController = require("../controllers/component.controller");
const router = express.Router();

router.get("/signin", function (req, res, next) {
  componentController.loadSignin(req, res, next);
});

router.get("/signup", function (req, res, next) {
  componentController.loadSignup(req, res, next);
});

router.get("/settings", function (req, res, next) {
  componentController.loadSettings(req, res, next);
});

router.get("/catInfo/:id", function (req, res, next) {
  componentController.loadCatInfo(req, res, next);
});

//swipe
router.get("/available", function (req, res, next) {
  componentController.available(req, res, next);
});

module.exports = router;
