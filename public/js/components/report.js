$(document).ready(function () {
  const templateSource = $("#details-template").html();
  const template = Handlebars.compile(templateSource);
  $("#submitButton").click(function () {
    try {
      $("#submissionInfo").html(
        template({
          userValue: $("#userInput").val(),
          emailValue: $("#emailInput").val(),
          violatorValue: $("#violatorInput").val(),
          detailValue: $("#detailInput").val(),
        })
      );
    } catch (error) {
      alert("Error occured when reporting user!");
    }
  });
});
