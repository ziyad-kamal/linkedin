function initializePage() {
    if (!authorize()) {
        return;
    }

    var postModal = new bootstrap.Modal(document.getElementById("postModal"));
    var authUser = getFromDatabase("authUser");
    function displayPost(post) {
        var postCard = ` <div class="card post-card shadow-sm border-0 mt-3 " id="post${post.id}">

                    <div class="card-body p-3">

                        <div class="d-flex align-items-start gap-2 mb-2">

                            <div class="avatar-wrap flex-shrink-0">
                                <div class="av-placeholder">${post.user.name.charAt(0).toUpperCase()}</div>
                                <div class="avatar-badge"><index class="bi bi-buildings-fill"></index></div>
                            </div>

                            <div class="flex-grow-1 overflow-hidden">
                                <div class="d-flex align-items-center gap-1 flex-wrap">
                                    <span class="poster-name">${post.user.name}</span>
                                    <span class="poster-meta">• 2 days</span>
                                </div>

                                <div class="poster-meta">18h · Edited · <index class="bi bi-globe2"
                                        style="font-size:.75rem;"></index>
                                </div>
                            </div>

                            <div class="d-flex align-items-center gap-2 ms-auto">
                                <button class="btn-connect">
                                    <i class="bi bi-person-plus-fill"></i> Connect
                                </button>

                                <div class="dropdown">
                                    <button class="post-dots-btn" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span class="dots-icon"></span>
                                        <span class="dots-icon"></span>
                                        <span class="dots-icon"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end shadow border"
                                        style="min-width:160px; border-radius:6px; overflow:hidden;">
                                        <li>
                                            <button class="dropdown-item d-flex align-items-center gap-2 py-2 px-3"
                                            data-postOwnerId="${post.user.id}" data-postId="${post.id}" data-bs-toggle="modal" 
                                            data-bs-target="#editModal" id="editPostBtn">
                                                <i class="bi bi-pencil-fill text-muted"></i>
                                                    Edit post
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                class="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger deletePostBtn"
                                                data-postOwnerId="${post.user.id}" data-postId="${post.id}" id="deletePostBtn" 
                                                data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                <i class="bi bi-trash-fill"></i> Delete post
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <p class="post-body mb-1">
                            ${post.content}
                        </p>

                    </div><!-- /card-body -->


                    <!-- Reactions + counts -->
                    <div class="px-3 py-2 d-flex align-items-center justify-content-between border-bottom post-divider"
                        style="margin:0;">

                        <div class="d-flex gap-2">
                            <span class="reaction-count"><span class="likes_count">${post.likes.length}</span> likes </span>
                                                        
                            <span class="text-muted" style="font-size:.82rem;">•</span>

                            <span class="reaction-count"><span class="comments_count">0</span> comments</span>
                            <span class="text-muted" style="font-size:.82rem;">•</span>

                            <span class="reaction-count"><span class="reposts_count">${post.reposts.length}</span> reposts</span>

                        </div>
                    </div>

                    <!-- Action buttons row -->
                    <div class="d-flex px-1 py-1">
                        <button class="post-action" id="like" style="${post.likes.includes(authUser.id) ? "color:blue" : ""}"   data-postId="${post.id}">
                            <index class="bi bi-hand-thumbs-up-fill" ></index>
                            <span >Like</span>
                        </button>
                        <button class="post-action">
                            <index class="bi bi-chat-square"></index>
                            <span>Comment</span>
                        </button>
                        <button class="post-action" id="repost" data-postId="${post.id}">
                            <index class="bi bi-repeat"   ></index>
                            <span>Repost</span>
                        </button>

                    </div>

                </div>`;

        document.getElementById("posts_parent").insertAdjacentHTML("afterbegin", postCard);
    }

    var posts = getFromDatabase("posts") || [];
    for (var index = 0; index < posts.length; index++) {
        displayPost(posts[index]);
    }

    //################  add  #######################

    document.getElementById("post_btn").onclick = function () {
        if (!authorize()) {
            return;
        }
        var posts = getFromDatabase("posts") || [];

        var content = document.getElementById("postTextarea").value;
        var id = posts.length + 1;
        var authUser = getFromDatabase("authUser");

        if (content.length < 4) {
            document.getElementById("content_error").textContent = "you should enter at least 3 characters";
            return;
        }

        var newPost = {
            id: id,
            content: content,
            user: authUser,
            likes: [],
            reposts: [],
            comments: [],
        };

        posts.push(newPost);

        saveOnDatabase("posts", posts);
        postModal.hide();

        displayPost(newPost);
    };

    //################  edit  #######################
    var updateBtnModal = document.getElementById("updateBtnModal");
    function editEventHandler(e) {
        if (e.target.id === "editPostBtn") {
            var postOwnerId = e.target.getAttribute("data-postOwnerId");
            var postId = e.target.getAttribute("data-postId");

            updateBtnModal.setAttribute("data-postOwnerId", postOwnerId);
            updateBtnModal.setAttribute("data-postId", postId);

            var originalContent = document.querySelector(`#post${postId} .post-body`).innerText;
            console.log("originalContent: ", originalContent);
            document.querySelector(`#editTextarea`).value = originalContent;
        }
    }
    document.getElementById("posts_parent").addEventListener("click", editEventHandler);

    updateBtnModal.addEventListener("click", function () {
        if (!authorize()) {
            return;
        }

        var postOwnerId = updateBtnModal.getAttribute("data-postOwnerId");
        var postId = updateBtnModal.getAttribute("data-postId");

        if (!isOwner(postOwnerId)) {
            return;
        }

        var content = document.querySelector(`#editTextarea`).value;
        var errorInputEle = document.getElementById("edit_content_error");
        if (content.length < 4) {
            errorInputEle.style.display = "";
            errorInputEle.innerText = "you should enter at least 4 characters";
        }

        var errorEle = document.getElementById("msg_error");
        var posts = getFromDatabase("posts") || [];
        for (var index = 0; index < posts.length; index++) {
            var post = posts[index];

            if (post.id === Number(postId)) {
                post.content = content;
                break;
            }

            if (posts.length - 1 === index) {
                errorEle.style.display = "";
                errorEle.innerText = "post not found";
                return;
            }
        }

        saveOnDatabase("posts", posts);

        document.querySelector(`#post${postId} .post-body`).innerText = content;

        var successEle = document.getElementById("edit_msg_success");
        successEle.style.display = "";
        successEle.innerText = "you updated post successfully";
        setTimeout(function () {
            successEle.style.display = "none";
        }, 3000);
    });

    //################  delete  #######################
    var deleteBtnModal = document.getElementById("deleteBtnModal");
    function deleteEventHandler(e) {
        if (e.target.id === "deletePostBtn") {
            var postOwnerId = e.target.getAttribute("data-postOwnerId");
            var postId = e.target.getAttribute("data-postId");

            deleteBtnModal.setAttribute("data-postOwnerId", postOwnerId);
            deleteBtnModal.setAttribute("data-postId", postId);
        }
    }
    document.getElementById("posts_parent").addEventListener("click", deleteEventHandler);

    deleteBtnModal.addEventListener("click", function () {
        if (!authorize()) {
            return;
        }

        var postOwnerId = deleteBtnModal.getAttribute("data-postOwnerId");
        var postId = deleteBtnModal.getAttribute("data-postId");
        var errorEle = document.getElementById("msg_error");

        if (!isOwner(postOwnerId)) {
            return;
        }

        var posts = getFromDatabase("posts") || [];
        for (var index = 0; index < posts.length; index++) {
            var post = posts[index];

            if (post.id === Number(postId)) {
                posts.splice(index);
                break;
            }

            if (posts.length - 1 === index) {
                errorEle.style.display = "";
                errorEle.innerText = "post not found";
                return;
            }
        }

        saveOnDatabase("posts", posts);

        var successEle = document.getElementById("msg_success");
        successEle.style.display = "";
        successEle.innerText = "you deleted post successfully";
        setTimeout(function () {
            successEle.style.display = "none";
        }, 3000);

        document.getElementById(`post${postId}`).remove();
    });

    //################  like  #######################
    function likeEventHandler(e) {
        if (!authorize()) {
            return;
        }

        if (e.target.id === "like") {
            var postId = e.target.getAttribute("data-postId");
            var posts = getFromDatabase("posts");
            var authUser = getFromDatabase("authUser");
            var likeIcon = document.getElementById("like");
            var likes;

            for (var index = 0; index < posts.length; index++) {
                var post = posts[index];

                if (post.id === Number(postId)) {
                    likes = post.likes;
                    if (likes.includes(authUser.id)) {
                        for (var i = 0; i < likes.length; i++) {
                            var like = likes[i];
                            if (like === authUser.id) {
                                likes.splice(i);
                                likeIcon.style.color = "";
                                break;
                            }
                        }
                    } else {
                        likes.push(authUser.id);
                        likeIcon.style.color = "blue";
                        break;
                    }
                }
            }

            document.querySelector(`#post${postId} .likes_count`).innerText = likes.length;
            saveOnDatabase("posts", posts);
        }
    }
    document.getElementById("posts_parent").addEventListener("click", likeEventHandler);

    //################  repost  #######################
    function repostEventHandler(e) {
        if (!authorize()) {
            return;
        }

        if (e.target.id === "repost") {
            var postId = e.target.getAttribute("data-postId");
            var posts = getFromDatabase("posts");
            var authUser = getFromDatabase("authUser");
            var repostIcon = document.getElementById("repost");
            var reposts;

            for (var index = 0; index < posts.length; index++) {
                var post = posts[index];

                if (post.id === Number(postId)) {
                    reposts = post.reposts;
                    if (reposts.includes(authUser.id)) {
                        for (var i = 0; i < reposts.length; i++) {
                            var repost = reposts[i];
                            if (repost === authUser.id) {
                                reposts.splice(i);
                                repostIcon.style.color = "";
                            }
                        }
                    } else {
                        reposts.push(authUser.id);
                        repostIcon.style.color = "blue";
                    }
                }
            }

            document.querySelector(`#post${postId} .reposts_count`).innerText = reposts.length;
            saveOnDatabase("posts", posts);
        }
    }
    document.getElementById("posts_parent").addEventListener("click", repostEventHandler);
}

document.addEventListener("DOMContentLoaded", initializePage);
