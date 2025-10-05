const genericHelper = require("../helper-functions/generic-helper");
const dummyDB = require("../enums/dummy-db");
let startId = 11;

class AnswerService {
    async createAnswer(data) {
        try {
            console.log(`Creating answer...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        let answer = {
            "answerId": ++startId,
            "questionId": data.questionId,
            "content": data.content,
            "userId": data.userId,
            "upVotes": 0,
            "downVotes": 0,
            "isAnonymous": data.isAnonymous,
            "createdAt": genericHelper.getCurrentDateTime(),
            "updatedAt": genericHelper.getCurrentDateTime()
        };

        dummyDB.answers.push(answer);

        return answer;
    }

    async getOneAnswer(data) {
        try {
            console.log(`Getting one answer...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }
        
        let result = null;

        for (const answer of dummyDB.answers) {
            if (answer.answerId == data.answerId) {
                result = {...answer};
                break;
            }
        }

        if (result === null) {
            throw new Error("Answer ID doesn't exist!");
        }

        return result;
    }

    async updateAnswer(data) {
        try {
            console.log(`Updating answer...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        let result = null;
        
        for (const answer of dummyDB.answers) {
            if (answer.answerId == data.answerId) {
                result = answer;
                break;
            }
        }

        if (result === null) {
            throw new Error("Answer ID doesn't exist!");
        }

        result.answerId = data.answerId;
        result.content = data.content;
        result.isAnonymous = data.isAnonymous;
        result.updatedAt = genericHelper.getCurrentDateTime();

        return result;
    }

    async deleteAnswer(data) {
        try {
            console.log(`Deleting answer...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        const index = dummyDB.answers.findIndex(answer => answer.answerId == data.answerId);
        
        if (index != -1) {
            dummyDB.answers.splice(index, 1);

            return {
                "success": true,
                "message": "Successfully deleted."
            };
        }

        return {
            "success": false,
            "meesage": "Answer not found!"
        }
    }
}

module.exports = new AnswerService();