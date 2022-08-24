if (typeof globalThis.appComponents === "undefined") {
    globalThis.appComponents = {};
}

if (typeof globalThis.appComponents.SignUp === "undefined") {
    globalThis.appComponents.SignUp = {
        validateSignup: function validateSignup() {
            let isValid = true;
            isValid = this.validateUsername() && isValid;
            isValid = this.validateEmail() && isValid;
            isValid = this.validatePassword() && isValid;
            isValid = this.validateCatName() && isValid;
            isValid = this.validateGender() && isValid;
            isValid = this.validateAge() && isValid;
            isValid = this.validateBreed() && isValid;
            isValid = this.validateAlteredStatus() && isValid;
            isValid = this.validateImage(1, true) && isValid;
            isValid = this.validateImage(2, false) && isValid;
            isValid = this.validateImage(3, false) && isValid;

            return isValid;
        },
        validateUsername: function validateUsername() {
            const usernameElement = document.getElementById("signup-username");
            const usernameErrorSpan = document.getElementById("signup-username-error");
            const usernameInput = usernameElement && usernameElement.value ? usernameElement.value.trim() : "";
            const validationResult = appComponents.Validate.username(usernameInput);

            if (validationResult && validationResult.valid === false) {
                if (validationResult.errorMessage) {
                    usernameErrorSpan.textContent = validationResult.errorMessage;
                }
                return false;
            }

            usernameErrorSpan.textContent = "";
            return true;
        },
        validateEmail: function validateEmail() {
            const emailElement = document.getElementById("signup-email");
            const emailErrorSpan = document.getElementById("signup-email-error");
            const emailInput = emailElement && emailElement.value ? emailElement.value.trim() : "";
            const validationResult = appComponents.Validate.email(emailInput);

            if (validationResult && validationResult.valid === false) {
                if (validationResult.errorMessage) {
                    emailErrorSpan.textContent = validationResult.errorMessage;
                }
                return false;
            }

            emailErrorSpan.textContent = "";
            return true;
        },
        validatePassword: function validatePassword() {
            const passwordElement = document.getElementById("signup-password");
            const passwordErrorSpan = document.getElementById("signup-password-error");
            const passwordInput = passwordElement && passwordElement.value ? passwordElement.value.trim() : "";
            const validationResult = appComponents.Validate.signupPassword(passwordInput);

            if (validationResult && validationResult.valid === false) {
                if (validationResult.errorMessage) {
                    passwordErrorSpan.textContent = validationResult.errorMessage;
                }
                return false;
            }

            passwordErrorSpan.textContent = "";
            return true;
        },
        validateCatName: function validateCatName() {
            const catNameElement = document.getElementById("signup-cat-name");
            const catNameErrorSpan = document.getElementById("signup-cat-name-error");
            const catNameInput = catNameElement && catNameElement.value ? catNameElement.value.trim() : "";
            const validationResult = appComponents.Validate.name(catNameInput);

            if (validationResult && validationResult.valid === false) {
                if (validationResult.errorMessage) {
                    catNameErrorSpan.textContent = validationResult.errorMessage;
                }
                return false;
            }

            catNameErrorSpan.textContent = "";
            return true;
        },
        validateGender: function validateGender() {
            const catGenderElement = document.getElementById("signup-cat-gender");
            const catGenderErrorSpan = document.getElementById("signup-cat-gender-error");
            const catGenderInput = catGenderElement.options[catGenderElement.selectedIndex].value;
            const validationResult = appComponents.Validate.isEmptyString(catGenderInput);

            if (validationResult === true) {
                catGenderErrorSpan.textContent = "No gender selected.";
                return false;
            }

            if (catGenderInput !== "Male" && catGenderInput !== "Female") {
                catGenderErrorSpan.textContent = "Invalid gender provided.";
                return false;
            }

            catGenderErrorSpan.textContent = "";
            return true;
        },
        validateAge: function validateAge() {
            const catAgeYearElement = document.getElementById("signup-cat-age-years");
            const catAgeMonthElement = document.getElementById("signup-cat-age-months");
            const catAgeErrorSpan = document.getElementById("signup-cat-age-error");
            const catAgeYearInput = catAgeYearElement.value;
            const catAgeMonthInput = catAgeMonthElement.value;

            if (appComponents.Validate.isEmptyString(catAgeYearInput) || appComponents.Validate.isEmptyString(catAgeMonthInput)) {
                catAgeErrorSpan.textContent = "One or more age inputs not provided.";
                return false;
            }


            if (parseInt(catAgeYearInput) + parseInt(catAgeMonthInput) > 360) {
                catAgeErrorSpan.textContent = "Invalid cat age given.";
                return false;
            }

            return true;
        },
        validateBreed: function validateBreed() {
            const catBreedElement = document.getElementById("signup-cat-breed");
            const catBreedErrorSpan = document.getElementById("signup-cat-breed-error");
            const catBreedInput = catBreedElement && catBreedElement.value ? catBreedElement.value.trim() : "";
            const validationResult = appComponents.Validate.name(catBreedInput);

            if (validationResult && validationResult.valid === false) {
                if (validationResult.errorMessage) {
                    catBreedErrorSpan.textContent = validationResult.errorMessage.replaceAll("name", "breed").replaceAll("Name", "Breed");
                }
                return false;
            }

            catBreedErrorSpan.textContent = "";
            return true;
        },
        validateAlteredStatus: function validateAlteredStatus() {
            const catAlteredElement = document.getElementById("signup-cat-altered");
            const catAlteredErrorSpan = document.getElementById("signup-cat-altered-error");
            const catAlteredInput = catAlteredElement.options[catAlteredElement.selectedIndex].value;
            const validationResult = appComponents.Validate.isEmptyString(catAlteredInput);

            if (validationResult === true) {
                catAlteredErrorSpan.textContent = "No altered status selected.";
                return false;
            }

            if (catAlteredInput !== "true" && catAlteredInput !== "false") {
                catAlteredErrorSpan.textContent = "Invalid altered status provided.";
                return false;
            }

            catAlteredErrorSpan.textContent = "";
            return true;
        },
        validateImage: function validateImage(index, required) {
            const catImageElement = document.getElementById("signup-cat-image-" + index.toString());
            const catImageErrorSpan = document.getElementById("signup-cat-image-error-" + index.toString());
            const catImageInput = catImageElement.value;

            if (appComponents.Validate.isEmptyString(catImageInput)) {
                if (required) {
                    catImageErrorSpan.textContent = "No cat image url given.";
                    return false;
                } else {
                    return true;
                }
            }

            if (!catImageInput.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/)) {
                catImageErrorSpan.textContent = "Invalid url provided."
            }
            return true;
        },
        //Helpers
        loadCatBreedList: function loadCatBreedList() {
            console.log("running cat breed list");
            const requestConfig = {
                method: "GET",
                url: "https://api.thecatapi.com/v1/breeds"
            };
            $.ajax(requestConfig).then((responseMessage) => {
                const sourceArray = [];
                responseMessage.forEach(element => {
                    if (element.name) {
                        sourceArray.push(element.name);
                    }
                });
                sourceArray.push("Unknown");
                sourceArray.push("Mixed Breed");
                sourceArray.sort();
                $("#signup-cat-breed").autocomplete({ source: sourceArray });
            });
        },

    };
}
//Listeners
document.getElementById("signup-form").addEventListener("submit", (event) => {
    event.preventDefault();

    let lat;
    let long;

    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (data) => {
                    console.log(data);
                    long = data.coords.longitude;
                    lat = data.coords.latitude;

                    const catGallery = []
                    catGallery.push(filterXSS(document.getElementById("signup-cat-image-1").value));
                    const imageUrl2 = filterXSS(document.getElementById("signup-cat-image-2").value);
                    const imageUrl3 = filterXSS(document.getElementById("signup-cat-image-3").value);
                    if (!appComponents.Validate.isEmptyString(imageUrl2)) {
                        catGallery.push(imageUrl2);
                    }

                    if (!appComponents.Validate.isEmptyString(imageUrl3)) {
                        catGallery.push(imageUrl3)
                    }

                    if (appComponents.SignUp.validateSignup()) {
                        const requestConfig = {
                            method: "POST",
                            url: "/api/user/signup",
                            data: {
                                userName: filterXSS(document.getElementById("signup-username").value),
                                email: filterXSS(document.getElementById("signup-email").value),
                                password: filterXSS(document.getElementById("signup-password").value),
                                userCat: {
                                    catName: filterXSS(document.getElementById("signup-cat-name").value),
                                    catGender: filterXSS(document.getElementById("signup-cat-gender").value),
                                    catAge: parseInt(filterXSS(document.getElementById("signup-cat-age-years").value)) +
                                        parseInt(filterXSS(document.getElementById("signup-cat-age-months").value)),
                                    catBreed: filterXSS(document.getElementById("signup-cat-breed").value),
                                    catIsAltered: filterXSS(document.getElementById("signup-cat-altered").value) === "true",
                                    catGallery: catGallery,
                                },
                                userLocation: [long, lat],
                                userBio: filterXSS(document.getElementById("signup-profile-bio").value),
                            }
                        };
                        console.log(typeof requestConfig.data.userCat.catIsAltered);
                        $.ajax(requestConfig).then((responseMessage) => {
                            console.log(responseMessage);
                            if (typeof assembleApp === "function" && typeof loadSignup === "function") {
                                if (responseMessage &&
                                    responseMessage.login &&
                                    responseMessage.login == "success") {
                                    assembleApp();
                                } else {
                                    loadSignup();
                                    alert("Login failed please try again.");
                                }
                            }
                        });
                    }
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
        return;
    }
});

if (typeof loadSignin === "function") {
    document.getElementById("load-signin-button").addEventListener("click", loadSignin);
} else {
    document.getElementById("load-signin-button").addEventListener("click", function () {
        window.location.href = "/load/signin";
    });
}

//Other
appComponents.SignUp.loadCatBreedList();