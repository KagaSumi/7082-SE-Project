const genericHelper = require("../helper-functions/generic-helper");
const dummyDB = require("../enums/dummy-db");
let answerStartId = 11;

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
            "answerId": ++answerStartId,
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

    async rateAnswer(data) {
        try {
            console.log(`Rating an answer...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        // Double clicking a vote will undo the vote
        let voteType = data.type == 1 ? 1 : 0;
        const numRatings = dummyDB.ratings.length;
        let isDuplicated = false;

        for (let i = 0; i < numRatings; i++) {
            let rating = dummyDB.ratings[i];
            if (rating.voteType == voteType
                && rating.entityType == "Answer"
                && rating.entityId == data.answerId
                && rating.userId == data.userId
            ) {
                dummyDB.ratings.splice(i, 1);
                isDuplicated = true;
                break;
            }
        }

        if (!isDuplicated) {
            dummyDB.ratings.push(
                {
                    "voteId": ++dummyDB.ratingStartId,
                    "userId": data.userId,
                    "createdAt": genericHelper.getCurrentDateTime(),
                    "voteType": data.type == 1 ? 1 : 0,
                    "entityType": "Answer",
                    "entityId": data.answerId
                }
            );
        }

        let res = {
            answerId: data.answerId,
            upVotes: 0,
            downVotes: 0
        }

        res = this.getVotes(res);

        return res;
    }

    async getVotes(obj) {
        try {
            console.log(`Getting all votes of an answer...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        for (const rating of dummyDB.ratings) {
            if (rating.entityType === "Answer" && rating.entityId == obj.answerId) {
                if (rating.voteType === 0) {
                    obj.downVotes++;
                } else {
                    obj.upVotes++;
                }
            }
        }

        return obj;
    }

}

module.exports = new AnswerService();