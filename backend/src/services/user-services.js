function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class UserService {
    async createUser(data) {
        try {
            console.log(`Creating user ${data}`);
            await sleep(2000);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getUser(uid) {
        try {
            console.log(`Getting user ${uid}`);
            await sleep(2000);
        } catch (err) {
            throw new Error(err.message);
        }

        return {"userId": uid};
    }
}

module.exports = new UserService();