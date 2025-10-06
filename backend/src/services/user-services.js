const genericHelper = require("../helper-functions/generic-helper");

class UserService {
    async signup(data) {
        try {
            console.log(`Registering user...`);
            // DB query goes here
            await genericHelper.sleep(1000);
        } catch (err) {
            throw new Error(err.message);
        }

        return {
            userId: "1",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email
        }
    }

    async signin(data) {
        try {
            console.log(`Loging user in...`);
            // DB query goes here
            await genericHelper.sleep(1000);
        } catch (err) {
            throw new Error(err.message);
        }

        return {
            userId: "1",
            firstName: "John",
            lastName: "Doe",
            email: "jdoe1111@gmail.com"
        };
    }
}

module.exports = new UserService();