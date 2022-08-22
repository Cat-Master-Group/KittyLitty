document.getElementById("menu-home").addEventListener("click", function () {
    assembleApp();
});
document.getElementById("menu-followed").addEventListener("click", function () {
    loadFollowed();
});
document.getElementById("menu-conversations").addEventListener("click", function () {
    loadMessages();
});
document.getElementById("menu-my-profile").addEventListener("click", function () {
    $.ajax({
        method: "GET",
        url: "/api/user/current-user-id",
    }).then((currentUserId) => {
        loadCatInfo(currentUserId);
    });
});
document.getElementById("menu-signout").addEventListener("click", function () {
    $.ajax({
        method: "GET",
        url: "/api/user/signout"
    }).then(function () {
        loadSignin();
        emptyHeader();
    });
});