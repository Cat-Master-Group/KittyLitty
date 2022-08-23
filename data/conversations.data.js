const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const { checkId } = require("../validations");
const { conversations } = mongoCollections;

const createConversation = async (arrUsers) => {
  const conversationCollection = await conversations();
  const participants = arrUsers.map((x) => ObjectId(x));
  const messages = [];
  let newConversation = {
    participants,
    messages,
  };

  const insertConversation = await conversationCollection.insertOne(
    newConversation
  );

  if (insertConversation.insertedCount === 0)
    throw "COULD NOT ADD CONVERSATION";
  const newConversationId = insertConversation.insertedId;
  const conversation = await getConversation(newConversationId.toString());
  return conversation;
};

const getConversation = async (id) => {
  try {
    checkId(id);
  } catch (error) {
    throw error;
  }
  if (!id) throw "INVALID CONVERSATION ID";
  const conversationCollection = await conversations();

  const conversation = await conversationCollection.findOne({
    _id: ObjectId(id),
  });
  if (conversation === null) throw "CONVERSATION NOT FOUND";
  return conversation;
};

const getParticipantId = async (participantId) => {
  try {
    checkId(participantId);
  } catch (error) {
    throw error;
  }
  const conversationCollection = await conversations();
  const singularParticipant = await conversationCollection.findOne({
    partcipants: {
      $in: [participantId],
    },
  });

  if (!singularParticipant) {
    throw `PARTICIPANT NOT FOUND.\n`;
  }

  return singularParticipant;
};

const getAllUserConversations = async (id) => {
  try {
    checkId(id);
  } catch (error) {
    throw error;
  }
  const conversationCollection = await conversations();
  const allConversations = await conversationCollection
    .find({
      participants: {
        $in: [ObjectId(id)],
      },
    })
    .toArray();
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

  const conversationCollection = await conversations();

  const payload = {
    senderId: ObjectId(id),
    messageText: message,
  };

  let updateConversation = await conversationCollection.updateOne(
    {
      _id: ObjectId(conversationID),
    },
    {
      $push: {
        messages: payload,
      },
    }
  );

  if (!updateConversation.matchedCount && !updateConversation.modifiedCount) {
    throw `COULD NOT UPDATE MESSAGES.\n`;
  }

  return await getConversation(conversationID);
};

module.exports = {
  createConversation,
  getConversation,
  getParticipantId,
  getAllUserConversations,
  insertMessage,
};
