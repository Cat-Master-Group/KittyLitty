//Startup Tasks
document.addEventListener("DOMContentLoaded", async function (event) {
  //Check if user is logged in
  const requestConfig = {
    method: "GET",
    url: "/api/user/authcheck",
  };

  axios(requestConfig).then(async (responseMessage) => {
    if (
      responseMessage &&
      responseMessage.data &&
      responseMessage.data.login &&
      responseMessage.data.login == "success"
    ) {
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
    url: "/load/signin",
    params: {
      axios: true,
    }
  };

  axios(requestConfig).then(replaceContentDiv);
}

async function loadSignup() {
  const requestConfig = {
    method: "GET",
    url: "/load/signup",
    params: {
      axios: true,
    },
  };

  axios(requestConfig).then(replaceContentDiv);
}

async function loadSettings() {
  const requestConfig = {
    method: "GET",
    url: "/load/settings",
    params: {
      axios: true,
    },
  }

  axios(requestConfig).then(replaceContentDiv);
}

//Helper Methods
function replaceContentDiv(responseMessage) {
  console.log(responseMessage.data);
  if (responseMessage) {
    const contentDiv = document.getElementById("content");
    setInnerHTML(contentDiv, responseMessage.data);
  }
}

function setInnerHTML(elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach(oldScript => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes)
      .forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}