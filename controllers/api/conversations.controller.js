const {
  getConversationId,
  getUserConversations,
  insertMessage,
} = require("../../data/conversations.data");
const { getUser } = require("../../data/user.data");

const conversationsList = async (req, res, next) => {
  try {
    const id = req.session.user._id;
    const messages = await getUserConversations(id);
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "COULD NOT GET ALL CONVERSATIONS" });
  }
};

const getSingleConversation = async (req, res, next) => {
  const id = req.params.id;
  try {
    const conversationId = await getConversationId(id);
    return res.status(200).json({ conversationId });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "CONVERSATION ID ERROR: CONVERSATION ID DOES NOT EXIST" });
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const id = req.session.user._id;
    const message = req.body.messages;
    const conversationId = req.params.id;

    const singleMessage = await insertMessage(id, conversationId, message);

    return res.status(200).json(singleMessage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "COULD NOT SEND MESSAGE" });
  }
};

module.exports = {
  conversationsList,
  getSingleConversation,
  sendMessage,
};
