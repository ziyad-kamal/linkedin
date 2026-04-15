function initializePage() {
    if (!authorize()) {
        return;
    }

    var authUser = getFromDatabase("authUser");
    document.getElementsByClassName("profile-name")[0].innerText = authUser.name;

    function displaySkill(skill) {
        var skill = ` 
                        <div class="skill-item d-flex">
                            <div class="skill-name">${skill}</div>

                            <button class="btn btn-danger">delete</button>

                        </div>

                        `;

        document.getElementById("parent_skills").insertAdjacentHTML("afterbegin", skill);
    }

    var skills = authUser.skills;
    for (let index = 0; index < skills.length; index++) {
        const skill = skills[index];
        displaySkill(skill);
    }
    //################  add  #######################

    document.getElementById("add_btn").onclick = function () {
        if (!authorize()) {
            return;
        }

        var users = getFromDatabase("users") || [];
        var authUser = getFromDatabase("authUser");
        var skill = document.getElementById("skillTextarea").value;

        if (skill.length < 2) {
            document.getElementById("content_error").textContent = "you should enter at least 2 characters";
            return;
        }

        for (var index = 0; index < users.length; index++) {
            var user = users[index];
            if (authUser.id === user.id) {
                user.skills.push(skill);
                authUser.skills.push(skill);
            }
        }

        saveOnDatabase("users", users);
        saveOnDatabase("authUser", authUser);

        displaySkill(skill);
    };
}

document.addEventListener("DOMContentLoaded", initializePage);
