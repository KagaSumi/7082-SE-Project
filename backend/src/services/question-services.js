const genericHelper = require("../helper-functions/generic-helper");
const dummyDB = require("../enums/dummy-db");
startId = 11;

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
            "questionId": ++startId,
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

        for (const answer of dummyDB.answers) {
            if (answer.questionId == data.questionId) {
                result["answers"].push(answer);
            }
        }

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

        return dummyDB.questions;
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
}

module.exports = new QuestionService();