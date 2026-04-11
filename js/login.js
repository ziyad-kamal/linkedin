if (getFromDatabase("token")) {
    window.location.href = "http://127.0.0.1:5500/views/home.html";
}
var signinBtn = document.getElementById("signin");

signinBtn.onclick = function () {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var users = getFromDatabase("users");
    for (var index = 0; index < users.length; index++) {
        var user = users[index];
        var errorEle = document.getElementById("error");

        if (user.email === email && user.password === password) {
            var token = generateToken();

            var authUser = {
                id: user.id,
                name: user.name,
                email: email,
                password: password,
            };
            saveOnDatabase("token", token);
            saveOnDatabase("authUser", authUser);

            window.location.href = "http://127.0.0.1:5500/views/home.html";

            return;
        }
    }

    errorEle.style.display = "";
    errorEle.innerText = "invalid password or email";
};
