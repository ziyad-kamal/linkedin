document.getElementById("signout").onclick = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");

    window.location.href = "http://127.0.0.1:5500/views/login.html";
};

if (authorize()) {
    var authUser = getFromDatabase("authUser");
    var username = authUser.name;
    var userNameElements = document.getElementsByClassName("username");
    for (let index = 0; index < userNameElements.length; index++) {
        const userNameElement = userNameElements[index];
        userNameElement.textContent = username;
    }

    var abbrNameEle = document.getElementsByClassName("abbr_name");
    for (var index = 0; index < abbrNameEle.length; index++) {
        var element = abbrNameEle[index];
        element.textContent = username.charAt(0).toUpperCase();
    }
}

var authUser = getFromDatabase("authUser");
var navProfile = `<a href="/views/profile.html?id=${authUser.id}" class="btn btn-light w-100 rounded-pill fw-semibold fs-6"
                                border-color:var(--li-blue); color:var(--li-blue);">
                                View Profile
                            </a>`;
document.getElementsByClassName("profile")[0].insertAdjacentHTML("beforeend", navProfile);
