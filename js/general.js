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
        reposts: 4,
        likes: 10,
    },
];

function saveOnDatabase(Key, value) {
    localStorage.setItem(Key, JSON.stringify(value));
}

function getFromDatabase(Key) {
    return JSON.parse(localStorage.getItem(Key));
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
