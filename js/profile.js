function initializePage() {
    if (!authorize()) {
        return;
    }

    function displaySkill(skill) {
        var skillHtml = ` 
                        <div class="skill-item d-flex ${skill}" >
                            <div class="skill-name" >${skill}</div>

                            <button class="btn btn-danger auth" id="delete_btn" data-skill="${skill}"  >delete</button>

                        </div>
                        `;

        document.getElementById("parent_skills").insertAdjacentHTML("afterbegin", skillHtml);
    }

    var urlParams = new URLSearchParams(window.location.search);
    var userId = urlParams.get("id");
    var authUser = getFromDatabase("authUser");
    var connectBtn = document.getElementById("connect_btn");
    var users = getFromDatabase("users");
    var messageBtnHtml = `<button class="btn-li-outline not_auth" id="message_btn">Message</button>`;
    var parentButtons = document.getElementsByClassName("parent_btns")[0];

    for (let index = 0; index < users.length; index++) {
        user = users[index];

        if (user.id === Number(userId)) {
            document.getElementsByClassName("profile-name")[0].innerText = user.name;
            document.getElementsByClassName("abbrName")[0].innerText = user.name.charAt(0);

            var skills = user.skills;
            for (var i = 0; i < skills.length; i++) {
                var skill = skills[i];
                displaySkill(skill);
            }

            var pendingBtnsHtml = `<button class="btn-li-outline not_auth" id="accept_btn">accept</button>
                <button class="btn-li-outline not_auth" id="ignore_btn">ignore</button>`;
            var acceptBtn = document.getElementById("accept_btn");
            var ignoreBtn = document.getElementById("ignore_btn");
            var connections = user.connections;

            if (connections.length !== 0) {
                for (let index = 0; index < connections.length; index++) {
                    const connection = connections[index];

                    if (Number(connection.senderId) === authUser.id) {
                        if (connection.status === "pending") {
                            connectBtn.innerText = "pending";
                            connectBtn.disabled = true;
                        } else if (connection.status === "accepted") {
                            connectBtn.remove();
                            parentButtons.insertAdjacentHTML("afterbegin", messageBtnHtml);
                        }
                    }

                    if (Number(connection.receiverId) === authUser.id) {
                        if (connection.status === "pending") {
                            parentButtons.insertAdjacentHTML("afterbegin", pendingBtnsHtml);
                            connectBtn.remove();
                        }
                        if (connection.status === "accepted") {
                            parentButtons.insertAdjacentHTML("afterbegin", messageBtnHtml);

                            connectBtn.remove();
                        }
                    }
                }
            }
        }
    }

    if (authUser.id !== Number(userId)) {
        var authBtns = document.getElementsByClassName("auth");

        while (authBtns.length > 0) {
            authBtns[0].remove();
        }
    } else {
        var notAuthBtns = document.getElementsByClassName("not_auth");

        while (notAuthBtns.length > 0) {
            notAuthBtns[0].remove();
        }
    }

    //################  add  #######################

    document.getElementById("add_btn").onclick = function () {
        if (!authorize()) {
            return;
        }

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

    //################  delete  #######################
    var delete_btns = document.getElementsByClassName("delete_btn");

    function deleteEventHandler(e) {
        if (e.target.id === "delete_btn") {
            if (!authorize()) {
                return;
            }

            var clickedSkill = e.target.getAttribute("data-skill");
            var authUser = getFromDatabase("authUser");

            for (var index = 0; index < users.length; index++) {
                var user = users[index];
                var skills = user.skills;

                for (var i = 0; i < skills.length; i++) {
                    var skill = skills[i];
                    if (skill === clickedSkill) {
                        skills.splice(i);
                        authUser.skills.splice(i);
                        break;
                    }
                }
            }

            saveOnDatabase("users", users);
            saveOnDatabase("authUser", authUser);

            document.getElementsByClassName(`${skill}`)[0].remove();
        }
    }
    document.getElementById("parent_skills").addEventListener("click", deleteEventHandler);

    //################  connect  #######################

    connectBtn.onclick = function () {
        for (let index = 0; index < users.length; index++) {
            const user = users[index];
            var newConnection = {
                senderId: authUser.id,
                receiverId: userId,
                status: "pending",
            };

            if (authUser.id === user.id) {
                user.connections.push(newConnection);
                authUser.connections.push(newConnection);
            }

            if (Number(userId) === user.id) {
                user.connections.push(newConnection);
            }
        }

        saveOnDatabase("users", users);
        saveOnDatabase("authUser", authUser);

        connectBtn.innerText = "pending";
    };

    //################  update Connection Status  #######################
    function updateConnectionStatus(status) {
        for (let index = 0; index < users.length; index++) {
            const user = users[index];

            if (authUser.id === user.id) {
                var connections = user.connections;
                for (let i = 0; i < connections.length; i++) {
                    const connection = connections[i];
                    connection.status = status;
                }
            }

            if (Number(userId) === user.id) {
                var connectionsForAnotherUser = user.connections;
                for (let index = 0; index < connectionsForAnotherUser.length; index++) {
                    const connectionForAnotherUser = connectionsForAnotherUser[index];
                    connectionForAnotherUser.status = status;
                }
            }
        }

        saveOnDatabase("users", users);
        saveOnDatabase("authUser", authUser);
    }

    //################  accept  #######################
    var acceptBtn = document.getElementById("accept_btn");
    if (acceptBtn) {
        acceptBtn.onclick = function (e) {
            updateConnectionStatus("accepted");

            e.target.remove();
            document.getElementById("ignore_btn").remove();

            parentButtons.insertAdjacentHTML("afterbegin", messageBtnHtml);
        };
    }

    //################  ignore  #######################
    var ignoreBtn = document.getElementById("ignore_btn");
    if (ignoreBtn) {
        ignoreBtn.onclick = function (e) {
            updateConnectionStatus("ignored");

            saveOnDatabase("users", users);
            saveOnDatabase("authUser", authUser);

            document.getElementById("ignore_btn").remove();
            document.getElementById("accept_btn").remove();

            var connectBtnHtml = ` <button class="btn-li-primary not_auth" id="connect_btn">
                            <i class="bi bi-person-plus-fill me-1">

                            </i>
                            Connect
                        </button>`;
            parentButtons.insertAdjacentHTML("afterbegin", connectBtnHtml);
        };
    }
}

document.addEventListener("DOMContentLoaded", initializePage);
