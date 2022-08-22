if (typeof globalThis.appComponents === "undefined") {
    globalThis.appComponents = {};
}

if (typeof globalThis.appComponents.Validate === "undefined") {
    globalThis.appComponents.Validate = {
        //Form Validations
        username: function username(usernameInput) {
            if (this.isEmptyString(usernameInput)) {
                return { valid: false, errorMessage: "No username provided." };
            }
            if (usernameInput.length < 6 || usernameInput.length > 16) {
                return { valid: false, errorMessage: "Username must be between 6 and 16 characters long." };
            }
            if (!usernameInput.match(/[a-z0-9]+$/gm)) {
                return { valid: false, errorMessage: "Username can only contain alphanumeric characters and underscores." };
            }
            return { valid: true };
        },
        email: function email(emailInput) {
            if (this.isEmptyString(emailInput)) {
                return { valid: false, errorMessage: "No email provided." };
            }
            if (emailInput.length < 3 || emailInput.length > 255) {
                return { valid: false, errorMessage: "Invalid email length." };
            }
            if (!emailInput.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
                return { valid: false, errorMessage: "Invalid email format." };
            }
            return { valid: true };
        },
        signinPassword: function signinPassword(passwordInput) {
            if (this.isEmptyString(passwordInput)) {
                return { valid: false, errorMessage: "No password provided." };
            }
            return { valid: true };
        },
        signupPassword: function signupPassword(passwordInput) {
            if (this.isEmptyString(passwordInput)) {
                return { valid: false, errorMessage: "No password provided." };
            }
            if (passwordInput.length < 8) {
                return { valid: false, errorMessage: "Password must be at least 8 characters long" };
            }
        },
        name: function name(nameInput) {
            if (this.isEmptyString(nameInput)) {
                return { valid: false, errorMessage: "No name provided." };
            }
            if (!nameInput.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)) {
                return { valid: false, errorMessage: "Name can only contain alphabetical and accent characters" };
            }
            return { valid: true };
        },
        //Helpers
        //Checks if string is empty and return true if it is
        isEmptyString: function isEmptyString(stringInput) {
            if (typeof stringInput !== "string" || stringInput.trim().length == 0 || stringInput.trim() === "") {
                return true;
            }
            return false;
        },

    };
}