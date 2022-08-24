{
  //Edit Button
  if (document.getElementById("user-info-settings-button")) {
    document.getElementById("user-info-settings-button").addEventListener("click", (event) => {
      loadSettings();
    });
  }
  //Comments Section
  document.getElementById("comment-new-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const newCommentTargetId = document.getElementById("comment-new-target-id").value;
    const newCommentText = document.getElementById("comment-new-text").value;

    if (appComponents.Validate.isEmptyString(newCommentTargetId)) {
      alert('Something went wrong, try refreshing the page');
    }

    if (appComponents.Validate.isEmptyString(newCommentText)) {
      alert('Must provide comment text to post a comment!');
    }

    const requestConfig = {
      method: "PATCH",
      url: "/api/user/addcomment",
      data: {
        commentTargetId: newCommentTargetId.trim(),
        commentText: newCommentText.trim(),
      },
      error: (req, status, error) => {
        console.log(req); // the w
        console.log(status); // IDK
        console.log(error); // Provide the status info (like "NOT FOUND" if its a 404)
        console.log(req.responseJSON); // this is the data from our res.json(data)
      },
    }

    $.ajax(requestConfig).then((responseMessage) => {
      if (!responseMessage.message || responseMessage.message !== "success") {
        alert("Server error. Try refreshing and trying again.");
      } else {
        reloadUserInfo()
      }
    });
  });

  Array.from(document.getElementsByClassName("user-info-like-button")).forEach((element) => {
    element.addEventListener("click", (event) => {
      const clickedButton = event.currentTarget;
      console.log(clickedButton);
      const data = {};
      data.commentTargetId = document.getElementById("comment-new-target-id").value.trim();
      console.log(clickedButton.id.split("-"));
      data.commentIndex = clickedButton.id.split("-")[2].trim();
      console.log(clickedButton.className);
      if (clickedButton.className.includes("active")) {
        data.likeValue = 0;
      } else {
        data.likeValue = 1;
      }

      const requestConfig = {
        method: "PATCH",
        url: "/api/user/likecomment",
        data: data,
        error: (req, status, error) => {
          console.log(req); // the w
          console.log(status); // IDK
          console.log(error); // Provide the status info (like "NOT FOUND" if its a 404)
          console.log(req.responseJSON); // this is the data from our res.json(data)
        },
      }

      $.ajax(requestConfig).then((responseMessage) => {
        if (!responseMessage.message || responseMessage.message !== "success") {
          alert("Server error. Try refreshing and trying again.");
        } else {
          reloadUserInfo()
        }
      });
    });
  });

  Array.from(document.getElementsByClassName("user-info-dislike-button")).forEach((element) => {
    element.addEventListener("click", (event) => {
      const clickedButton = event.currentTarget;
      const data = {};
      data.commentTargetId = document.getElementById("comment-new-target-id").value;
      data.commentIndex = clickedButton.id.split("-")[2];
      if (clickedButton.className.includes("active")) {
        data.likeValue = 0;
      } else {
        data.likeValue = -1;
      }
      const requestConfig = {
        method: "PATCH",
        url: "/api/user/likecomment",
        data: data,
        error: (req, status, error) => {
          console.log(req); // the w
          console.log(status); // IDK
          console.log(error); // Provide the status info (like "NOT FOUND" if its a 404)
          console.log(req.responseJSON); // this is the data from our res.json(data)
        },
      }

      $.ajax(requestConfig).then((responseMessage) => {
        if (!responseMessage.message || responseMessage.message !== "success") {
          alert("Server error. Try refreshing and trying again.");
        } else {
          reloadUserInfo()
        }
      });
    });
  });

  function reloadUserInfo() {
    requestConfig = {
      method: "GET",
      url: "/load/user-info/" + document.getElementById("comment-new-target-id").value,
    };

    $.ajax(requestConfig).then((responseMessage) => {
      setInnerHTML(document.getElementById("user-info-container").parentNode, responseMessage);
    });
  }

  //Reports Section
  const reportForm = $("#reportForm");
  const reason = $("#reason");
  const id = $("#get-id");
  const details = $("#details");
  const reportToggle = $("#reporting");
  const reportField = $("#report");

  let isHidden = true;

  reportToggle.on("click", function (event) {
    event.preventDefault();
    if (isHidden) {
      reportField.show();
      isHidden = false;
    } else {
      reportField.hide();
      isHidden = true;
    }
  });

  reportForm.on("submit", function (event) {
    event.preventDefault(reason.val());
    if (
      !details.val() ||
      details.val().length < 0 ||
      typeof details.val() !== "string"
    ) {
      alert("Please fill out details!");
      return;
    }
    if (!reason.val() || typeof reason.val() !== "string") {
      alert("Please choose a reason!");
      return;
    }
    if (
      reason.val() !== "fake" &&
      reason.val() !== "spam" &&
      reason.val() !== "harrass"
    ) {
      alert("Please one of the selected reasons!");
      return;
    }

    try {
      const requestConfig = {
        method: "PATCH",
        url: "/api/user/report",
        data: {
          details: filterXSS(details.val()),
          offendedId: filterXSS(id.val()),
          reason: filterXSS(reason.val()),
        },
        error: (req, status, error) => {
          alert(`Error occured when submitting report!`);
        },
      };
      $.ajax(requestConfig).then((response) => {
        alert("Report successful!"); // this code won't happen
      });
    } catch (error) {
      console.log(error);
      alert("Report failed");
    }
  });
}
