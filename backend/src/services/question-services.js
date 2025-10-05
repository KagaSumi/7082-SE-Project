const genericHelper = require("../helper-functions/generic-helper");
const dummyDB = require("../enums/dummy-db");
questionStartId = 11;

class QuestionService {
    async createQuestion(data) {
        try {
            console.log(`Creating question...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        question = {
            "questionId": ++questionStartId,
            "title": data.title,
            "content": data.content,
            "userId": data.userId,
            "courseId": data.courseId,
            "viewCount": 0,
            "upVotes": 0,
            "downVotes": 0,
            "isAnonymous": data.isAnonymous,
            "createdAt": genericHelper.getCurrentDateTime(),
            "updatedAt": genericHelper.getCurrentDateTime()
        }

        dummyDB.questions.push(question);

        return question;
    }

    async getSingleQuestion(data) {
        try {
            console.log(`Getting a question with all answers...}`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        let result = {"answers": []};

        for (const question of dummyDB.questions) {
            if (question.questionId == data.questionId) {
                result = {...question, "answers": []};
                break;
            }
        }

        if (result.questionId === undefined) {
            throw new Error("Question ID doesn't exist!");
        }

        // Retrieve all answers
        for (const answer of dummyDB.answers) {
            if (answer.questionId == data.questionId) {
                result["answers"].push(answer);
            }
        }

        // Retrieve vote count
        let voteCount = this.getVotes({
            questionId: result.questionId,
            upVotes: 0,
            downVotes: 0
        });

        result["upVotes"] = voteCount.upVotes;
        result["downVotes"] = voteCount.downVotes;

        return result;
    }

    async getAllQuestions() {
        try {
            console.log(`Get all questions with optional search filter...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        let questions = {...dummyDB.questions};

        // Retrieve vote count for each question
        for (const question of questions) {
            let voteCount = this.getVotes({
                questionId: question.questionId,
                upVotes: 0,
                downVotes: 0
            });

            question["upVotes"] = voteCount.upVotes;
            question["downVotes"] = voteCount.downVotes;
        }

        return questions;
    }

    async updateQuestion(data) {
        try {
            console.log(`Updating the question...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        let result = null;
        
        for (const question of dummyDB.questions) {
            if (question.questionId == data.questionId) {
                result = question;
                break;
            }
        }

        result.title = data.title;
        result.content = data.content;
        result.isAnonymous = data.isAnonymous;
        result.updatedAt = genericHelper.getCurrentDateTime();

        return result;
    }

    async deletQuestion(data) {
        try {
            console.log(`Deleting the question...`);

            // DB query goes here //
            await genericHelper.sleep(2000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        const index = dummyDB.questions.findIndex(question => question.questionId == data.questionId);
        
        if (index != -1) {
          dummyDB.questions.splice(index, 1);
        }

        return {
            "success": true,
            "message": "Successfully deleted."
        };
    }

    async rateQuestion(data) {
        try {
            console.log(`Rating a question...`);

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
                && rating.entityType == "Question"
                && rating.entityId == data.questionId
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
                    "entityType": "Question",
                    "entityId": data.questionId
                }
            );
        }

        let res = {
            questionId: data.questionId,
            upVotes: 0,
            downVotes: 0
        }

        res = this.getVotes(res);

        return res;
    }

    async getVotes(obj) {
        try {
            console.log(`Getting all votes of a question...`);

            // DB query goes here //
            await genericHelper.sleep(1000);
            ////////////////////////
        } catch (err) {
            throw new Error(err.message);
        }

        for (const rating of dummyDB.ratings) {
            if (rating.entityType === "Question" && rating.entityId == obj.questionId) {
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

module.exports = new QuestionService();