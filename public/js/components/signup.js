document.getElementById("signup-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const requestConfig = {
        method: "POST",
        url: "/api/user/signup",
        data: {
            userName: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }
    };
    axios(requestConfig);
});
