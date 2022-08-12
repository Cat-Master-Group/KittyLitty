const express = require("express");
const router = express.Router();
const { loadApp } = require("../controllers/app.controller");

router.get("/", function (req, res, next) {
    loadApp(req, res, next);
});

module.exports = router;