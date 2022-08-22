const express = require("express");
const {
  conversationsList,
  sendMessage,
  getSingleConversation,
} = require("../../controllers/api/conversations.controller");
const router = express.Router();

router.get("/messages/all", async (req, res, next) => {
  conversationsList(req, res, next);
});

router.get("/messages/:id", async (req, res, next) => {
  getSingleConversation(req, res, next);
});

router.patch("/messages/:id", async (req, res, next) => {
  sendMessage(req, res, next);
});

module.exports = router;
