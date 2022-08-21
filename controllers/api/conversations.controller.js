const {
  getConversation,
  getAllUserConversations,
  insertMessage,
} = require("../../data/conversations.data");
const { getUser } = require("../../data/user.data");

const conversationsList = async (req, res, next) => {
  const peopleDir = {};
  try {
    const id = req.session.user._id;
    // const id = "630017a87c6906051e104b43";
    // const id = "630017a87c6906051e104b43";
    // const id = "630017a87c6906051e104b43";
    // const id = "63015c350450150ae94382bb"; // kitty_litty_dev1
    const conversations = await getAllUserConversations(id);
    if (conversations) {
      for (let i = 0; i < conversations.length; i++) {
        const { participants } = conversations[i];
        for (let j = 0; j < participants.length; j++) {
          const onePerson = participants[j].toString();
          if (onePerson || onePerson.trim() !== "undefined") {
            if (!peopleDir[onePerson]) {
              try {
                console.log(onePerson);
                if (typeof onePerson === "object") {
                }
                const userInfo = await getUser(onePerson);
                peopleDir[onePerson] = userInfo.userName;
              } catch (error) {
                console.log(error);
                peopleDir[onePerson] = "Unknown";
              }
            }
          }
        }
      }
    }
    console.log(peopleDir);

    return res.status(200).json({ conversations, peopleDir, id });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "ALL CONVERSATIONS ERROR: COULD NOT GET ALL CONVERSATIONS",
    });
  }
};

const getSingleConversation = async (req, res, next) => {
  // const id = "63001fd4a6b8031be467936f";
  const id = req.params.id;

  try {
    const conversationId = await getConversation(id);
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
