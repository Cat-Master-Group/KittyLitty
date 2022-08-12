//Startup Tasks
document.addEventListener("DOMContentLoaded", async function (event) {
    //Check if user is logged in
    const requestConfig = {
        method: "GET",
        url: "/api/user/authcheck"
    }

    await axios(requestConfig).then(async (responseMessage) => {
        if (responseMessage && responseMessage.login && responseMessage.login == "success") {
            //user is logged in, load app page
        } else {
            loadSignin();
        }
    });
});

//Load Component Functions
async function loadSignin() {
    const requestConfig = {
        method: "GET",
        url: "/load/signin"
    }

    await axios(requestConfig).then((responseMessage) => {
        if (responseMessage) {
            var contentDiv = document.getElementById("content");
            contentDiv.innerHTML = responseMessage.data;
        }
    });
}

async function loadSignup() {
    const requestConfig = {
        method: "GET",
        url: "/load/signup"
    }

    await axios(requestConfig).then((responseMessage) => {
        if (responseMessage) {
            var contentDiv = document.getElementById("content");
            contentDiv.innerHTML = responseMessage.data;
        }
    });
}