function initializePage() {
    if (!redirectIfAuth()) {
        return;
    }

    var signupBtn = document.getElementById("signup");
    signupBtn.onclick = function () {
        var users = getFromDatabase("users");
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var phone = document.getElementById("phone").value;
        var password = document.getElementById("password").value;
        var id = users.length + 1;

        var nameError = document.getElementById("name_error");
        var emailError = document.getElementById("email_error");
        var phoneError = document.getElementById("phone_error");
        var passwordError = document.getElementById("password_error");

        var nameCondition = name.length < 3 || name.length > 30;
        var emailValidCondition = !email.includes("@");
        var emailUniqueCondition;
        var phoneCondition = phone.length < 11;
        var passwordCondition = password.length < 8;

        if (nameCondition) {
            nameError.innerText = "you should enter characters between 3 - 30";
        }

        if (emailValidCondition) {
            nameError.innerText = "you should valid email";
        }
        for (let index = 0; index < users.length; index++) {
            const user = users[index];
            if (email === user.email) {
                emailUniqueCondition == false;
                emailError.innerText = "this email is used";
            }
        }

        if (phoneCondition) {
            phoneError.innerText = "you should enter valid phone number";
        }

        if (passwordCondition) {
            passwordError.innerText = "you should enter at least 8 characters";
        }

        if (nameCondition || emailValidCondition || emailUniqueCondition || phoneCondition || passwordCondition) {
            return;
        }

        var newUser = {
            id: id,
            name: name,
            email: email,
            phone: phone,
            password: password,
            skills: [],
            connections: [],
        };

        users.push(newUser);
        var token = generateToken();

        saveOnDatabase("authUser", newUser);
        saveOnDatabase("users", users);
        saveOnDatabase("token", token);

        window.location.href = "http://127.0.0.1:5500/views/home.html";
    };
}

document.addEventListener("DOMContentLoaded", initializePage);
