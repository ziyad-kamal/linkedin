document.getElementById("signout").onclick = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");

    window.location.href = "http://127.0.0.1:5500/views/login.html";
};

var authUser = getFromDatabase("authUser");
var username = authUser.name;
document.getElementById("username").innerText = username;

var abbrNameEle = document.getElementsByClassName("abbr_name");
for (var index = 0; index < abbrNameEle.length; index++) {
    var element = abbrNameEle[index];
    element.textContent = username.charAt(0).toUpperCase();
}
