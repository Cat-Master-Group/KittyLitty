{
  const reportForm = $("#reportForm");
  const reason = $("#reason");
  const id = $("#get-id");
  const details = $("#details");
  const reportToggle = $("#reporting");
  const reportField = $("#report");

  let isHidden = true;
  // 630321b13c4bdf2f0d203760

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
    console.log(reason.val());
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
    const requestConfig = {
      method: "PATCH",
      url: "/api/user/report",
      data: {
        details: filterXSS(details.val()),
        offendedId: filterXSS(id.val()),
        reason: filterXSS(reason.val()),
      },
    };
    try {
      $.ajax(requestConfig).then((response) => {
        alert("Report successful!");
      });
    } catch (error) {
      console.log(error);
      alert("Report failed");
    }
  });
}
