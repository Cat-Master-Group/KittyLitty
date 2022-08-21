(function ($) {
  let messageList = $("#messageList");
  let enterMessage = $("#enterMessage");
  let submitMessage = $("#submitMessage");

  let peopleDir;
  let convoList;
  let id;
  let convoObj = [];

  const requestConfig = {
    method: "GET",
    url: "/api/conversation/messages/all",
  };

  // current active user
  try {
    $.ajax(requestConfig).then(function (responseConversations) {
      convoList = responseConversations.conversations;
      peopleDir = responseConversations.peopleDir;
      id = responseConversations.id;
      console.log(responseConversations);

      convoList.map((c) => {
        console.log(c.participants);
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
        console.log(otherUser);
        messageList.append(`<li>${c._id}</li>`);
      });
      //messageList.append($("<li>").text(enterMessage.val()));
    });
  } catch (error) {
    console.log(error);
  }

  console.log(submitMessage);

  submitMessage.on("click", function (event) {
    event.preventDefault();
  });
})(window.jQuery);

// Helper functions
