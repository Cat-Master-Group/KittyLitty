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

  console.log("B");
  try {
    console.log("A");
    const requestConfig = { method: "GET", url: "/api/user/setting" };
    $.ajax(requestConfig).then(function (response) {
      console.log(response);
      if (response.userCat) {
        const catObj = response.userCat;
        if (catObj.catName) {
          catName.val(catObj.catName);
        }
        if (catObj.catGender) {
          catGender.val(catObj.catGender);
        }
        if (catObj.catAge) {
          catAge.val(catObj.catAge);
        }
        if (catObj.catIsAltered) {
          catIsAltered.val(catObj.catIsAltered);
        }
        if (catObj.catBreed) {
          catBreed.val(catObj.catBreed);
        }
        if (catObj.catIsAltered) {
          catIsAltered.val(catObj.catIsAltered);
        }
        if (catObj.catGallery && catObj.catGallery.length > 0) {
          catGallery.val(catObj.catGallery);
        }
      }
      if (response.userBio) {
        userBio.val(response.userBio);
      }
      if (
        response.userLocation &&
        response.userLocation.coordinates &&
        response.userLocation.coordinates.length == 2
      ) {
        const long = response.userLocation.coordinates[0];
        const lat = response.userLocation.coordinates[1];
        locationResult.text(
          `Your longitude is ${long} and your latitude is ${lat}`
        );
      }
      if (response.filterMiles) {
        filterMiles.val(response.filterMiles);
      }
    });
  } catch (error) {
    alert("Please fill in your information!");
  }

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
