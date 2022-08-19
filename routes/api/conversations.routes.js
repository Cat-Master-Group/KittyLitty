const express = require("express");
const {
  conversationsList,
  sendMessage,
} = require("../../controllers/api/conversations.controller");
const router = express.Router();

router.get("/messages", async (req, res, next) => {
  conversationsList(req, res, next);
});

// router.get("/messages/:id", async (req, res, next) => {
//   const conversationId = req.params.id;
//   const userId = req.session.user._id;

//   //   try {
//   //     const specificConversation = await conversations.getConversationId(
//   //       req.params.id
//   //     );
//   //     console.log(specificConversation);
//   //     res.status(200).json(specificConversation);
//   //     conversationsController.loadMessage(req, res, next);
//   //   } catch (error) {
//   //     return res
//   //       .status(400)
//   //       .json({ error: "GET MESSAGE ID ERROR: Could not get message by id" });
//   //   }
// });

router.post("/messages", async (req, res, next) => {
  sendMessage(req, res, next);
});

module.exports = router;
