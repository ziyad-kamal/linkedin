document.getElementsByClassName("start-post")[0].onclick = function () {
    new bootstrap.Modal(document.getElementById("postModal")).show();
    setTimeout(() => {
        document.getElementById("postTextarea").focus();
    }, 500);
};

var posts = getFromDatabase("posts");
var authUser = getFromDatabase("authUser");

for (var index = 0; index < posts.length; index++) {
    var post = posts[index];
    var postCard = `  <div class="card post-card shadow-sm border-0 mt-3">

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

                            <button class="btn-connect ms-auto">
                                <index class="bi bi-person-plus-fill"></index> Connect
                            </button>
                        </div>

                        <p class="post-body mb-1">
                            ${post.content}
                        </p>

                    </div><!-- /card-body -->


                    <!-- Reactions + counts -->
                    <div class="px-3 py-2 d-flex align-items-center justify-content-between border-bottom post-divider"
                        style="margin:0;">

                        <div class="d-flex gap-2">
                            <span class="reaction-count"><span class="comments_count">0</span> comments</span>
                            <span class="text-muted" style="font-size:.82rem;">•</span>
                            <span class="reaction-count"><span class="reposts_count">0</span> reposts</span>
                            <span class="text-muted" style="font-size:.82rem;">•</span>
                            <span class="reaction-count"><span class="likes_count">0</span> likes</span>
                        </div>
                    </div>

                    <!-- Action buttons row -->
                    <div class="d-flex px-1 py-1">
                        <button class="post-action">
                            <index class="bi bi-hand-thumbs-up"></index>
                            <span>Like</span>
                        </button>
                        <button class="post-action">
                            <index class="bi bi-chat-square"></index>
                            <span>Comment</span>
                        </button>
                        <button class="post-action">
                            <index class="bi bi-repeat"></index>
                            <span>Repost</span>
                        </button>

                    </div>

                </div>`;

    document.getElementById("posts_parent").insertAdjacentHTML("afterbegin", postCard);
}

document.getElementById("post_btn").onclick = function () {
    if (!getFromDatabase("token")) {
        return;
    }
    var posts = getFromDatabase("posts");

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
    };

    posts.push(newPost);
    console.log("posts: ", posts);

    saveOnDatabase("posts", posts);
    var postCard = `  <div class="card post-card shadow-sm border-0 mt-3">

                    <div class="card-body p-3">

                        <div class="d-flex align-items-start gap-2 mb-2">

                            <div class="avatar-wrap flex-shrink-0">
                                <div class="av-placeholder">${authUser.name.charAt(0).toUpperCase()}</div>
                                <div class="avatar-badge"><index class="bi bi-buildings-fill"></index></div>
                            </div>

                            <div class="flex-grow-1 overflow-hidden">
                                <div class="d-flex align-items-center gap-1 flex-wrap">
                                    <span class="poster-name">${authUser.name}</span>
                                    <span class="poster-meta">• 2 days</span>
                                </div>

                                <div class="poster-meta">18h · Edited · <index class="bi bi-globe2"
                                        style="font-size:.75rem;"></index>
                                </div>
                            </div>

                            <button class="btn-connect ms-auto">
                                <index class="bi bi-person-plus-fill"></index> Connect
                            </button>
                        </div>

                        <p class="post-body mb-1">
                            ${content}
                        </p>

                    </div><!-- /card-body -->


                    <!-- Reactions + counts -->
                    <div class="px-3 py-2 d-flex align-items-center justify-content-between border-bottom post-divider"
                        style="margin:0;">

                        <div class="d-flex gap-2">
                            <span class="reaction-count"><span class="comments_count">0</span> comments</span>
                            <span class="text-muted" style="font-size:.82rem;">•</span>
                            <span class="reaction-count"><span class="reposts_count">0</span> reposts</span>
                            <span class="text-muted" style="font-size:.82rem;">•</span>
                            <span class="reaction-count"><span class="likes_count">0</span> likes</span>
                        </div>
                    </div>

                    <!-- Action buttons row -->
                    <div class="d-flex px-1 py-1">
                        <button class="post-action">
                            <index class="bi bi-hand-thumbs-up"></index>
                            <span>Like</span>
                        </button>
                        <button class="post-action">
                            <index class="bi bi-chat-square"></index>
                            <span>Comment</span>
                        </button>
                        <button class="post-action">
                            <index class="bi bi-repeat"></index>
                            <span>Repost</span>
                        </button>

                    </div>

                </div>`;

    document.getElementById("posts_parent").insertAdjacentHTML("afterbegin", postCard);
};
