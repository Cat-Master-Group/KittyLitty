(function ($) {
  const adjustForm = $("#adjustCat");
  const catName = $("#catName");
  const catGender = $("#catGender");
  const catAge = $("#catAge");
  const catBreed = $("#catBreed");
  const catIsAltered = $("#catIsAltered");
  const catGallery = $("#catGallery");
  const userBio = $("#userBio");
  const deleteButton = $("#delete");
  const locationBtn = $("#locationBtn");
  const locationResult = $("#locationResult");
  const filterMiles = $("#filterMiles");

  let long;
  let lat;
  let distance;

  locationBtn.on("click", function (event) {
    event.preventDefault();

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (data) => {
            long = data.coords.longitude;
            lat = data.coords.latitude;
            locationResult.text(
              `Your longitude is ${long} and your latitude is ${lat}`
            );
          },
          (err) => {
            alert("Issue with Geolocation occured!");
            throw err;
          }
        );
      } else {
        alert("Please turn on Geolocation");
      }
    } catch (error) {
      console.log(error);
      alert("Error occured getting your location!");
    }
  });

  deleteButton.on("click", function (event) {
    event.preventDefault();
    const requestConfig = {
      method: "DELETE",
      url: "/api/user/delete",
    };
    try {
      $.ajax(requestConfig).then(function (responseMessage) {
        console.log(responseMessage);
      });
    } catch (error) {
      console.log(error);
      alert("Account couldn't be deleted right now!");
    }
  });

  adjustForm.submit(function (event) {
    const payLoad = {};
    if (catName.val().trim()) {
      payLoad.catName = catName.val().trim();
    }
    if (catGender.val().trim()) {
      payLoad.catGender = catGender.val().trim();
    }
    if (Number(catAge.val()) !== NaN && Number(catAge.val()) > 0) {
      payLoad.catAge = Number(catAge.val());
    }
    if (catBreed.val().trim()) {
      payLoad.catBreed = catBreed.val().trim();
    }
    if (catIsAltered.val().trim()) {
      payLoad.catIsAltered = catIsAltered.val().trim();
    }
    if (catGallery.val().trim()) {
      payLoad.catGallery = catGallery.val().trim();
    }
    if (userBio.val().trim()) {
      payLoad.userBio = userBio.val().trim();
    }

    if (typeof long === "number" && typeof lat === "number") {
      payLoad.userLocation = [long, lat];
    }
    if (Number(filterMiles.val()) !== NaN && Number(filterMiles.val()) > 0) {
      payLoad.filterMiles = filterMiles.val();
    }

    const requestConfig = {
      method: "PATCH",
      url: "/api/user/adjust",
      data: { json: JSON.stringify({ payLoad }) },
      dataType: "json",
    };
    try {
      $.ajax(requestConfig).then(function (responseMessage) {
        console.log(responseMessage);
        alert("Update settings complete!");
      });
    } catch (error) {
      alert("Updating settings failed!");
    }
    return false;
  });
})(window.jQuery);
