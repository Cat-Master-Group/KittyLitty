(function ($) {
  const conversationList = $("#conversationList");
  const enterMessage = $("#enterMessage");
  const submitMessage = $("#submitMessage");
  const messageList = $("#messageList");

  let peopleDir;
  let convoList = [];
  let id;
  let curConvo;
  let currMessageList;

  const syncInterval = 1000 * 1;
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
    try {
      checkString();
    } catch (error) {
      alert("ERROR 400: Bad message input");
      throw error;
    }
    if (!curConvo) {
      alert("SELECT CONVERSATION");
    } else {
      patchRequestConfig.url = "/api/conversation/messages/" + curConvo;
      patchRequestConfig.data = { messages: filterXSS(enterMessage.val()) };
      try {
        $.ajax(patchRequestConfig).then(function (response) {
          currMessageList = response.messages;
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
    currMessageList = convoList[index].messages;

    populateMessages();
  });

  const populateMessages = () => {
    messageList.empty();
    for (let i = 0; i < currMessageList.length; i++) {
      const currMessage = currMessageList[i];
      $(`<li class=messageText>${currMessage.messageText}</li>`)
        .appendTo(messageList)
        .addClass(`${currMessage.senderId === id ? "right" : "left"}`);

      $(`<li class=senderId>${peopleDir[currMessage.senderId]}</li>`)
        .appendTo(messageList)
        .addClass(`${currMessage.senderId === id ? "right" : "left"}`);
    }
  };

  const checkString = () => {
    if (typeof enterMessage.val() !== "string") {
      throw `MESSAGE NOT STRING ERROR: message must be a string`;
    }
    if (enterMessage.val().trim().length === 0) {
      throw "MESSAGE CANNOT BE EMPTY";
    }
  };
})(window.jQuery);
