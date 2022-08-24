console.log(document.getElementsByClassName("followed-list-entry"));
Array.from(document.getElementsByClassName("followed-list-entry")).forEach(element => {
    element.addEventListener("click", (event) => {
        event.preventDefault();
        console.log(element.id.split("-")[1]);
        loadUserInfo(element.id.split("-")[1]);
    })
});