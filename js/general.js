var users = [
    {
        id: 1,
        name: "ziyad",
        email: "ziyad1995@gmail.com",
        password: "13131313",
        phone: "01124732412",
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

function isOwner(recordId) {
    var authUser = getFromDatabase("authUser");
    if (authUser.id !== Number(recordId)) {
        errorEle.innerText = "something went wrong";
        return false;
    }
    return true;
}
