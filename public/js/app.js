//Startup Tasks
function startup() {
  //Check if user is logged in
  const requestConfig = {
    method: "GET",
    url: "/api/user/authcheck",
  };

  $.ajax(requestConfig).then((responseMessage) => {
    if (
      responseMessage &&
      responseMessage.login &&
      responseMessage.login === "success"
    ) {
      assembleApp();
    } else {
      loadSignin();
    }
  });
}

startup();

//Helpers
//Main App Asseembly Function
function assembleApp() {
  loadHeaderMenu();
  loadAvailable();
}

//Load Component Functions
function loadHeaderMenu() {
  const requestConfig = {
    method: "GET",
    url: "/load/header-menu",
  };

  $.ajax(requestConfig).then(replaceHeader);
}
function loadSignin() {
  const requestConfig = {
    method: "GET",
    url: "/load/signin",
    data: {
      ajax: true,
    }
  };

  $.ajax(requestConfig).then(replaceContentDiv);
}

function loadSignup() {
  const requestConfig = {
    method: "GET",
    url: "/load/signup",
    data: {
      ajax: true,
    },
  };

  $.ajax(requestConfig).then(replaceContentDiv);
}

function loadAvailable() {
  const requestConfig = {
    method: "GET",
    url: "/load/available",
    data: {
      ajax: true,
    },
  };

  $.ajax(requestConfig).then(replaceContentDiv);
}

function loadFollowed() {
  const requestConfig = {
    method: "GET",
    url: "/load/followed-list",
    data: {
      ajax: true,
    },
  };

  $.ajax(requestConfig).then(replaceContentDiv);
}

function loadCatInfo(id) {
  const requestConfig = {
    method: "GET",
    url: "/load/cat-info/" + id,
    data: {
      ajax: true,
    },
  };

  $.ajax(requestConfig).then(replaceContentDiv);
}

function loadSettings() {
  const requestConfig = {
    method: "GET",
    url: "/load/settings",
    data: {
      ajax: true,
    },
  };

  $.ajax(requestConfig).then(replaceContentDiv);
}

async function loadMessages() {
  const requestConfig = {
    method: "GET",
    url: "load/messages",
    data: {
      ajax: true,
    },
  };

  $.ajax(requestConfig).then(replaceContentDiv);
}

//Helper Methods
function replaceElement(element, responseMessage) {
  if (responseMessage && element) {
    setInnerHTML(element, responseMessage);
  }
}
function replaceContentDiv(responseMessage) {
  replaceElement(document.getElementById("body-content"), responseMessage);
}

function replaceHeader(responseMessage) {
  replaceElement(document.getElementById("header-content"), responseMessage);
}

function emptyHeader() {
  emptyElement(document.getElementById("header-content"));
}

function emptyElement(element) {
  if (element) {
    setInnerHTML(element, "");
  }
}


function setInnerHTML(elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach((oldScript) => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach((attr) =>
      newScript.setAttribute(attr.name, attr.value)
    );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}
