(function ($) {
  const conversationList = $("#conversationList");
  const enterMessage = $("#enterMessage");
  const submitMessage = $("#submitMessage");
  const messageList = $("#messageList");

  let peopleDir;
  let convoList = [];
  let id;
  let curConvo;
  let curMessageList;

  const syncInterval = 1000 * 2;
  let grabFail = false;

  const requestConfig = {
    method: "GET",
    url: "/api/conversation/messages/all",
  };

  const loadConvo = () => {
    try {
      $.ajax(requestConfig).then(function (response) {
        convoList = response.conversations;
        peopleDir = response.peopleDir;
        id = response.id;
        conversationList.empty();

        convoList.map((c) => {
          let otherUser;
          if (c.participants.length === 2) {
            if (c.participants.indexOf(id) === 0) {
              otherUser = c.participants[1];
            } else {
              otherUser = c.participants[0];
            }
          } else {
            // otherUser =
          }
          conversationList.append(
            `<li><button class="convo" value=${c._id}>${peopleDir[otherUser]}</button></li>`
          );
        });
      });
    } catch (error) {
      if (!grabFail) {
        alert("COULD NOT GRAB MESSAGES.");
      }
      grabFail = true;
      console.log(error);
    }
  };

  loadConvo();
  setInterval(loadConvo, syncInterval);

  const patchRequestConfig = {
    method: "PATCH",
    url: "/api/conversation/messages/",
  };

  submitMessage.on("click", function (event) {
    event.preventDefault();
    if (!curConvo) {
      alert("SELECT CONVERSATION");
    } else if (enterMessage.val().trim() === "") {
      alert("MESSAGE CANNOT BE EMPTY");
    } else {
      patchRequestConfig.url = "/api/conversation/messages/" + curConvo;
      patchRequestConfig.data = { messages: enterMessage.val() };
      try {
        $.ajax(patchRequestConfig).then(function (response) {
          curMessageList = response.messages;
          populateMessages();
        });
      } catch (error) {
        alert("SEND MESSAGE ERROR: COULD NOT SEND MESSAGE");
        console.log(error);
      }
    }
  });

  conversationList.on("click", "button", function (event) {
    event.preventDefault();

    curConvo = event.target.value;
    const findConvo = (el) => {
      if (el._id === curConvo) {
        return true;
      }
    };
    let index = convoList.findIndex(findConvo);
    curMessageList = convoList[index].messages;

    populateMessages();
  });

  const populateMessages = () => {
    messageList.empty();
    for (let i = 0; i < curMessageList.length; i++) {
      const curMessage = curMessageList[i];
      messageList.append(
        `<li class=${curMessage.senderId === id ? "right" : "left"}>${
          curMessage.messageText
        }</li>`
      );
      messageList.append(
        `<li class=${curMessage.senderId === id ? "right" : "left"}>${
          peopleDir[curMessage.senderId]
        }</li>`
      );
    }
  };
})(window.jQuery);

// Helper functions
