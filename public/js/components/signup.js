if (typeof globalThis.appComponents === "undefined") {
    globalThis.appComponents = {};
}

if (typeof globalThis.appComponents.SignUp === "undefined") {
    globalThis.appComponents.SignUp = {
        validate: function validate() {
            let isValid = true;
            isValid = this.validateUsername() && isValid;
            isValid = this.validateEmail() && isValid;
            isValid = this.validatePassword() && isValid;

            return isValid;
        },
        validateUsername: function validateUsername() {
            const usernameElement = document.getElementById("signup-username");
            const usernameErrorSpan = document.getElementById("signup-username-error");
            const usernameInput = usernameElement && usernameElement.value ? usernameElement.value.trim() : "";

            if (usernameInput.length == 0 || usernameInput === "") {
                usernameErrorSpan.textContent = "No username provided.";
                return false;
            }
            if (usernameInput.length < 6 || usernameInput.length > 16) {
                usernameErrorSpan.textContent = "Username must be between 6 and 16 characters long.";
                return false;
            }
            if (!usernameInput.match(/[a-z0-9]+$/gm)) {
                usernameErrorSpan.textContent = "Username can only contain alphanumeric characters and underscores.";
                return false;
            }

            usernameErrorSpan.textContent = "";
            return true;
        },
        validateEmail: function validateEmail() {
            const emailElement = document.getElementById("signup-email");
            const emailErrorSpan = document.getElementById("signup-email-error");
            const emailInput = emailElement && emailElement.value ? emailElement.value.trim() : "";

            if (emailInput.length == 0 || emailInput === "") {
                emailErrorSpan.textContent = "No email provided.";
                return false;
            }
            if (emailInput.length < 3 || emailInput.length > 255) {
                emailErrorSpan.textContent = "Invalid email length.";
                return false;
            }
            if (!emailInput.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
                emailErrorSpan.textContent = "Invalid email format.";
                return false;
            }

            emailErrorSpan.textContent = "";
            return true;
        },
        validatePassword: function validatePassword() {
            const passwordElement = document.getElementById("signup-password");
            const passwordErrorSpan = document.getElementById("signup-password-error");
            const passwordInput = passwordElement && passwordElement.value ? passwordElement.value.trim() : "";

            if (passwordInput.length == 0 || passwordInput === "") {
                passwordErrorSpan.textContent = "No password provided.";
                return false;
            }

            if (passwordInput.length < 8) {
                passwordErrorSpan.textContent = "Password must be at least 8 characters long";
                return false;
            }

            passwordErrorSpan.textContent = "";
            return true;
        }
    };
}
//Listeners
document.getElementById("signup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (appComponents.SignUp.validate()) {
        const requestConfig = {
            method: "POST",
            url: "/api/user/signup",
            data: {
                userName: filterXSS(document.getElementById("signup-username").value),
                email: filterXSS(document.getElementById("signup-email").value),
                password: filterXSS(document.getElementById("signup-password").value),
            }
        };
        axios(requestConfig).then((responseMessage) => {
            if (typeof assembleApp === "function" && typeof loadSignup === "function") {
                if (responseMessage &&
                    responseMessage.data &&
                    responseMessage.data.login &&
                    responseMessage.data.login == "success") {
                    assembleApp();
                } else {
                    loadSignup();
                    alert("Login failed please try again.");
                }
            }
        });
    }
});

if (typeof loadSignin === "function") {
    document.getElementById("load-signin-button").addEventListener("click", loadSignin);
} else {
    document.getElementById("load-signin-button").addEventListener("click", function () {
        window.location.href = "/load/signin";
    });
}