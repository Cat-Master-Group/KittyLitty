const {
  createConversation,
  getConversationId,
  getUserConversations,
  insertMessage,
} = require("../../data/conversations.data");
const { getUser } = require("../../data/user.data");

const conversationsList = async (req, res, next) => {
  try {
    const messages = await getUserConversations();
    console.log(messages);
    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "COULD NOT GET ALL CONVERSATIONS" });
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const id = "62feeabec04bca97f8fc445c";
    console.log(req.body);
    const message = req.body.messages.messageText;
    const conversationId = req.body.conversationId;

    // console.log("CURRENT USER ID HERE:", id);

    // console.log("CONVERSATIONS ID HERE:", conversationId);

    const singleMessage = await insertMessage(id, conversationId, message);
    console.log("MESSAGE SENDING HERE", singleMessage);
    // const insertNewMessage = await insertMessage(id, conversationId, message);
    // console.log("INSERTING NEW MESSAGE HERE", insertNewMessage);
    return res.status(200).json(singleMessage);
  } catch (error) {
    return res.status(500).json({ error: "COULD NOT SEND MESSAGE" });
  }
};

module.exports = {
  conversationsList,
  sendMessage,
};

// const load

// module.exports = {
//   loadMesages(req, res, next) {
//     const renderData = {};
//     renderData.layout = "component";
//     renderData.axios = req.query.axios;
//     renderData.componentname = "messages";
//     renderData.script = true;
//     res.render("components/messages", renderData);
//   },

//   loadMessage(req, res, next) {
//     const renderData = {};
//     renderData.layout = "component";
//     renderData.axios = req.query.axios;
//     renderData.componentname = "messages";
//     renderData.script = true;
//     res.render("components/messages", renderData);
//   },

//   loadNewMessage(req, res, next) {
//     const renderData = {};
//     renderData.layout = "component";
//     renderData.axios = req.query.axios;
//     renderData.componentname = "messages";
//     renderData.script = true;
//     res.render("components/messages", renderData);
//   },
// };

// const {
//   createConversation,
//   getConversationId,
//   getParticipantId,
//   getAllConversations,
//   insertConversations,
// } = require("../../data/conversations.data");

// const loadMessages = async (req, res, next) => {
//   res.render("messages", { framename: "messages", script: true });
// };

// module.exports = { loadMessages };

// const initializeMessage = async (req, res, next) => {
//   try {
//     const { id } = getConversationId(req.conversationId);
//     console.log(id);

//     const singularConversation = await createConversation(id);
//     console.log(singularConversation);

//     const { particpiantId } = getParticipantId(req.participants);
//     console.log(particpiantId);

//     getAllConversations();
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ e });
//   }
// };

// const sendMessage = async (req, res, next) => {
//   try {
//     const { messages } = getConversationId(req.conversationId);
//     console.log(messages);

//     const singularConversation = await insertConversations(messages);
//     console.log(singularConversation);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error });
//   }
// };

// module.exports = {
//   initializeMessage,
//   sendMessage,
// };
