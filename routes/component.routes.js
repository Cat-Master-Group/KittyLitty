const express = require("express");
const componentController = require("../controllers/component.controller");
const router = express.Router();

router.get("/signin", function (req, res, next) {
    componentController.loadSignin(req, res, next);
});

router.get("/signup", function (req, res, next) {
    componentController.loadSignup(req, res, next);
});

module.exports = router;