const bcrypt = require("bcryptjs");

async function hashPassword() {
    const hashedPassword = await bcrypt.hash("123password", 10);
    console.log("Hashed Password:", hashedPassword);
}

hashPassword();
