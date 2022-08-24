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

  let grabFail = false;

  const allConversationsURL = "/api/conversation/messages/all";
  const sendMessageURL = "/api/conversation/messages/";

  const requestConfig = {
    method: "GET",
    url: allConversationsURL,

    error: (req, status, error) => {
      alert("Error: Sign Up was unsuccessful");
    },
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
            `<li class="list-group-item"><button class="btn btn-outline-primary col-12 convo" value=${c._id}>${peopleDir[otherUser]}</button></li>`
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

  const patchRequestConfig = {
    method: "PATCH",
    url: sendMessageURL,

    error: (req, status, error) => {
      alert("Error: Sign Up was unsuccessful");
    },
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
      patchRequestConfig.url = sendMessageURL + curConvo;
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
    console.log(event.target);
    console.log(convoList);
    curConvo = event.target.value;

    let index = convoList.findIndex((element) => {
      return element._id === curConvo;
    });

    console.log(index);

    loadConvo();
    currMessageList = convoList[index].messages;
    enterMessage.show();
    submitMessage.show();
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
