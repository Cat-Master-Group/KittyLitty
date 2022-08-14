document.getElementById("signin-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const requestConfig = {
        method: "POST",
        url: "/api/user/signin",
        data: {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }
    };
    axios(requestConfig);
});