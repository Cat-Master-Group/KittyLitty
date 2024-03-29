if (typeof globalThis.appComponents === "undefined") {
  globalThis.appComponents = {};
}

if (typeof globalThis.appComponents.SignIn === "undefined") {
  globalThis.appComponents.SignIn = {
    validate: function validate() {
      let isValid = true;
      isValid = this.validateEmail() && isValid;

      isValid = this.validatePassword() && isValid;

      return isValid;
    },
    validateEmail: function validateEmail() {
      const emailElement = document.getElementById("signin-email");
      const emailErrorSpan = document.getElementById("signin-email-error");
      const emailInput =
        emailElement && emailElement.value ? emailElement.value.trim() : "";

      if (emailInput.length == 0 || emailInput === "") {
        emailErrorSpan.textContent = "No email provided.";
        return false;
      }
      if (emailInput.length < 3 || emailInput.length > 255) {
        emailErrorSpan.textContent = "Invalid email length.";
        return false;
      }
      if (
        !emailInput.match(
          //   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        emailErrorSpan.textContent = "Invalid email format.";
        return false;
      }

      emailErrorSpan.textContent = "";
      return true;
    },
    validatePassword: function validatePassword() {
      const passwordElement = document.getElementById("signin-password");
      const passwordErrorSpan = document.getElementById(
        "signin-password-error"
      );
      const passwordInput =
        passwordElement && passwordElement.value
          ? passwordElement.value.trim()
          : "";

      if (passwordInput.length == 0 || passwordInput === "") {
        passwordErrorSpan.textContent = "No password provided.";
        return false;
      }
      if (passwordInput.length < 8) {
        passwordErrorSpan.textContent =
          "Password must be at least 8 characters long";
        return false;
      }

      passwordErrorSpan.textContent = "";
      return true;
    },
  };
}
//Listeners
document.getElementById("signin-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (appComponents.SignIn.validate()) {
    const requestConfig = {
      method: "POST",
      url: "/api/user/signin",
      data: {
        email: filterXSS(document.getElementById("signin-email").value),
        password: filterXSS(document.getElementById("signin-password").value),
      },
      error: (req, status, error) => {
        $(".loading-overlay").hide();
        alert("Error: Login was unsuccessful");
      },
    };
    $(".loading-overlay").show();
    $.ajax(requestConfig).then((responseMessage) => {
      $(".loading-overlay").hide();
      if (
        typeof assembleApp === "function" &&
        typeof loadSignin === "function"
      ) {
        if (responseMessage.login && responseMessage.login == "success") {
          assembleApp();
        } else {
          loadSignin();
          alert("Login failed please try again.");
        }
      }
    });
  }
});

if (typeof loadSignup === "function") {
  document
    .getElementById("load-signup-button")
    .addEventListener("click", loadSignup);
} else {
  document
    .getElementById("load-signup-button")
    .addEventListener("click", function () {
      window.location.href = "/load/signup";
    });
}
