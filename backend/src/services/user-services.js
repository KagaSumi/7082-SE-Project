const genericHelper = require("../helper-functions/generic-helper");

class UserService {
    async createUser(data) {
        try {
            console.log(`Creating user ${data}`);
            await genericHelper.sleep(2000);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getUser(uid) {
        try {
            console.log(`Getting user ${uid}`);
            await genericHelper.sleep(2000);
        } catch (err) {
            throw new Error(err.message);
        }

        return {"userId": uid};
    }
}

module.exports = new UserService();