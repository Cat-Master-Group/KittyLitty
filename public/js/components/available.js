(function ($) {
  const accept = $("#accept");
  const decline = $("#decline");
  const current = $("#currentUser");
  const name = $("#name");

  let currentPerson;
  let fetchList;
  let currentIndex = 0;
  const requestConfig = {
    method: "GET",
    url: "/api/user/available",
  };

  try {
    $.ajax(requestConfig).then(function (responseMessage) {
      fetchList = responseMessage;
      console.log(fetchList);
      if (fetchList.length === 0) {
        noMoreMatches();
      } else {
        currentPerson = fetchList[currentIndex];
        getCurrentPerson(currentPerson);
      }
    });
  } catch (error) {
    console.log(error);
    alert("Fetching to server cause an error!");
  }

  const getCurrentPerson = (obj) => {
    console.log(obj);
    try {
      const id = obj._id;
      const requestConfig = {
        method: "GET",
        url: "/load/user-info/" + id,
      };
      $.ajax(requestConfig).then(function (responseMessage) {
        setInnerHTML(document.getElementById("name"), responseMessage);
      });
    } catch (error) {
      console.log(error);
      alert("Fetching to server cause an error!");
    }
  };

  accept.on("click", function (event) {
    event.preventDefault();
    try {
      const requestConfig = {
        method: "PATCH",
        url: "/api/user/swipe",
        data: {
          matchId: currentPerson._id,
        },
      };
      $.ajax(requestConfig).then(function (responseMessage) {
        // console.log(responseMessage);
        currentIndex++;
        if (currentIndex === fetchList.length) {
          noMoreMatches();
        } else {
          currentPerson = fetchList[currentIndex];
          getCurrentPerson(currentPerson);
        }
      });
    } catch (error) {
      alert("Error occured during swipe! Please Refresh!");
      console.log(error);
    }
  });

  decline.on("click", function (event) {
    event.preventDefault();
    try {
      currentIndex++;
      if (currentIndex === fetchList.length) {
        noMoreMatches();
      } else {
        currentPerson = fetchList[currentIndex];
        getCurrentPerson(currentPerson);
      }
    } catch (error) {
      alert("Error occured during swipe! Please Refresh!");
      console.log(error);
    }
  });

  const noMoreMatches = () => {
    accept.hide();
    decline.hide();
    name.hide();
    alert("No more matches are available!");
  };
})(window.jQuery);
