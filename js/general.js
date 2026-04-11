var users = [
    {
        id: 1,
        name: "ziyad",
        email: "ziyad1995@gmail.com",
        password: "13131313",
        phone: "01124732412",
    },
];

function saveOnDatabase(Key, value) {
    localStorage.setItem(Key, JSON.stringify(value));
}

function getFromDatabase(Key) {
    return JSON.parse(localStorage.getItem(Key));
}

saveOnDatabase("users", users);

function generateToken(length = 60) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}
