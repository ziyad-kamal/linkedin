var users = [
    {
        id: 1,
        name: "ziyad",
        email: "ziyad1995@gmail.com",
        password: "13131313",
        phone: "01124732412",
        skills: [],
        connections: [],
    },
    {
        id: 2,
        name: "mohamed",
        email: "ziyad199523@gmail.com",
        password: "13131313",
        phone: "01124732412",
        skills: [],
        connections: [],
    },
];

var posts = [
    {
        id: 1,
        content: "i want backend developer",
        user: {
            id: 1,
            name: "ziyad",
            email: "ziyad1995@gmail.com",
            password: "13131313",
            phone: "01124732412",
        },
        likes: [1],
        reposts: [1],
    },

    {
        id: 2,
        content: "i want frontend developer",
        user: {
            id: 2,
            name: "mohamed",
            email: "ziyad199523@gmail.com",
            password: "13131313",
            phone: "01124732412",
            skills: [],
            connections: [],
        },
        comments: [
            {
                id: 1,
                content: "i have 3 years of experience",
                user: {
                    id: 1,
                    name: "ahmed",
                    email: "ahmed1995@gmail.com",
                    password: "13131313",
                    phone: "01124732415",
                },
            },
        ],
        likes: [1],
        reposts: [1],
    },
];

function saveOnDatabase(Key, value) {
    localStorage.setItem(Key, JSON.stringify(value));
}

function getFromDatabase(Key) {
    return JSON.parse(localStorage.getItem(Key)) ?? false;
}

function generateToken(length = 60) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

function authorize() {
    if (!getFromDatabase("token")) {
        window.location.href = "http://127.0.0.1:5500/views/login.html";

        return false;
    }
    return true;
}

function redirectIfAuth() {
    if (getFromDatabase("token")) {
        window.location.href = "http://127.0.0.1:5500/views/home.html";

        return false;
    }
    return true;
}

function isOwner(recordId) {
    var authUser = getFromDatabase("authUser");
    if (authUser.id !== Number(recordId)) {
        errorEle.innerText = "something went wrong";
        return false;
    }
    return true;
}

if (!getFromDatabase("users")) {
    saveOnDatabase("users", users);
}

if (!getFromDatabase("posts")) {
    saveOnDatabase("posts", posts);
}
