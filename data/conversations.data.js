const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const { conversations } = mongoCollections;
const { getUser } = require("./user.data");

const createConversation = async (id, message) => {
  const conversationCollection = await conversations();
  const currentUser = "62feeabec04bca97f8fc445c";
  let newConversation = {
    conversationId: id,
    // participants: [currentUser, "62feeabec04bca97f8fc445d"],
    messages: [
      {
        senderId: currentUser,
        messageText: message,
      },
    ],
  };

  const insertConversation = await conversationCollection.insertOne(
    newConversation
  );

  if (insertConversation.insertedCount === 0)
    throw "COULD NOT ADD CONVERSATION";
  const newConversationId = insertConversation.insertedId;
  const conversation = await getConversationId(newConversationId.toString());
  return conversation;
};

const getConversationId = async (id) => {
  /*
  TODO: TBD **I hope this works**
  */
  if (!id) throw "INVALID CONVERSATION ID";
  const conversationCollection = await conversations();
  const conversation = await conversationCollection.findOne({
    _id: id,
  });
  if (conversation === null) throw "CONVERSATION NOT FOUND";
  conversation.conversationId = conversation.conversationId.toString();
  return conversation;
};

// const getParticipantId = async (participantId) => {
//   const conversationCollection = await conversations();
//   const singularParticipant = await conversationCollection.findOne({
//     partcipants: ObjectId(participantId),
//   });

//   if (!singularParticipant) {
//     throw `PARTICIPANT NOT FOUND.\n`;
//   }

//   return singularParticipant;
// };

const getUserConversations = async () => {
  const id = "62feeabec04bca97f8fc445c";
  const id2 = "62feeabec04bca97f8fc445d";
  const conversationCollection = await conversations();
  const allConversations = await conversationCollection.find({}).toArray();
  // projection: {
  //     participants: { $in: [id, id2] },
  //   },

  return allConversations;
};

const insertMessage = async (id, conversationID, message) => {
  if (!id) {
    throw `ID INVALID.\n`;
  }

  if (!conversationID) {
    throw `INVALID conversationID.\n`;
  }

  if (!message) {
    throw `MESSAGE INVALID.\n`;
  }

  console.log("USER ID:", id, "CONVO ID:", conversationID, "MESSAGE:", message);

  const conversationCollection = await conversations();
  const payload = {
    senderId: id,
    messageText: message,
  };
  console.log("PAYLOAD HERE", payload);
  const findId = await getConversationId(conversationID);
  console.log(" FINDING ONE", findId);

  const updateConversation = await conversationCollection.findOneAndUpdate(
    {
      _id: ObjectId(conversationID),
    },
    {
      $push: {
        messages: payload,
      },
    }
  );

  console.log("UPDATE CONVERSATION HERE", updateConversation);

  if (!updateConversation.matchedCount && !updateConversation.modifiedCount) {
    throw `COULD NOT UPDATE MESSAGES.\n`;
  }
  return updateConversation;
};

module.exports = {
  createConversation,
  getConversationId,
  //getParticipantId,
  getUserConversations,
  insertMessage,
};
