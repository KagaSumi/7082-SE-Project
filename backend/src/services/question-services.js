const { pool } = require("./database");

class QuestionService {
    async createQuestion(data) {
        try {
            console.log(`Creating question...`);

            // Real DB query - matches your ERD
            const [result] = await pool.execute(
                `INSERT INTO Question (title, body, user_id, course_id, is_anonymous) 
                 VALUES (?, ?, ?, ?, ?)`,
                [data.title, data.content, data.userId, data.courseId, data.isAnonymous || false]
            );

            // Get the created question with user info
            const [questions] = await pool.execute(
                `SELECT q.question_id, q.title, q.body, q.view_count, q.score, q.created_at, q.updated_at, q.is_anonymous,
                        u.user_id, u.first_name, u.last_name,
                        c.course_id, c.name
                 FROM Question q
                 JOIN User u ON q.user_id = u.user_id
                 JOIN Course c ON q.course_id = c.course_id
                 WHERE q.question_id = ?`,
                [result.insertId]
            );

            if (questions.length === 0) {
                throw new Error("Failed to create question");
            }

            const question = questions[0];
            const voteCounts = await this.getVoteCounts(question.question_id);

            return {
                questionId: question.question_id,
                title: question.title,
                content: question.body,
                userId: question.user_id,
                courseId: question.course_id,
                viewCount: question.view_count,
                score: question.score,
                isAnonymous: question.is_anonymous,
                createdAt: question.created_at,
                updatedAt: question.updated_at,
                upVotes: voteCounts.upVotes,
                downVotes: voteCounts.downVotes
            };

        } catch (err) {
            console.error('Error creating question:', err);
            throw new Error(err.message);
        }
    }

    async getSingleQuestion(data) {
        try {
            console.log(`Getting a question with all answers...`);

            // Get the question
            const [questions] = await pool.execute(
                `SELECT q.question_id, q.title, q.body, q.view_count, q.score, q.created_at, q.updated_at, q.is_anonymous,
                        u.user_id, u.first_name, u.last_name, u.email,
                        c.course_id, c.name
                 FROM Question q
                 JOIN User u ON q.user_id = u.user_id
                 JOIN Course c ON q.course_id = c.course_id
                 WHERE q.question_id = ?`,
                [data.questionId]
            );

            if (questions.length === 0) {
                throw new Error("Question ID doesn't exist!");
            }

            const question = questions[0];

            // Increment view count
            await pool.execute(
                'UPDATE Question SET view_count = view_count + 1 WHERE question_id = ?',
                [data.questionId]
            );

            // Get all answers for this question
            const [answers] = await pool.execute(
                `SELECT a.answer_id, a.body, a.is_accepted, a.score, a.created_at, a.updated_at, a.is_anonymous,
                        u.user_id, u.first_name, u.last_name
                 FROM Answer a
                 JOIN User u ON a.user_id = u.user_id
                 WHERE a.question_id = ?
                 ORDER BY a.is_accepted DESC, a.score DESC, a.created_at ASC`,
                [data.questionId]
            );

            // Get vote counts for question and answers
            const questionVoteCounts = await this.getVoteCounts(question.question_id);
            
            const answersWithVotes = await Promise.all(
                answers.map(async (answer) => {
                    const answerVoteCounts = await this.getVoteCounts(answer.answer_id);
                    return {
                        answerId: answer.answer_id,
                        content: answer.body,
                        isAccepted: answer.is_accepted,
                        score: answer.score,
                        createdAt: answer.created_at,
                        updatedAt: answer.updated_at,
                        userId: answer.user_id,
                        isAnonymous: answer.is_anonymous,
                        upVotes: answerVoteCounts.upVotes,
                        downVotes: answerVoteCounts.downVotes
                    };
                })
            );

            return {
                questionId: question.question_id,
                title: question.title,
                content: question.body,
                userId: question.user_id,
                courseId: question.course_id,
                viewCount: question.view_count + 1, // Include the +1 we just added
                score: question.score,
                isAnonymous: question.is_anonymous,
                createdAt: question.created_at,
                updatedAt: question.updated_at,
                upVotes: questionVoteCounts.upVotes,
                downVotes: questionVoteCounts.downVotes,
                answers: answersWithVotes
            };

        } catch (err) {
            console.error('Error getting question:', err);
            throw new Error(err.message);
        }
    }

    async getAllQuestions(searchFilter = '') {
        try {
            console.log(`Get all questions with optional search filter...`);

            let query = `
                SELECT q.question_id, q.title, q.body, q.view_count, q.score, q.created_at, q.updated_at, q.is_anonymous,
                       u.user_id, u.first_name, u.last_name,
                       c.course_id, c.name,
                       COUNT(a.answer_id) as answer_count
                FROM Question q
                JOIN User u ON q.user_id = u.user_id
                JOIN Course c ON q.course_id = c.course_id
                LEFT JOIN Answer a ON q.question_id = a.question_id
            `;

            const params = [];

            if (searchFilter) {
                query += ` WHERE q.title LIKE ? OR q.body LIKE ?`;
                params.push(`%${searchFilter}%`, `%${searchFilter}%`);
            }

            query += ` GROUP BY q.question_id ORDER BY q.created_at DESC`;

            const [questions] = await pool.execute(query, params);

            // Get vote counts for each question
            const questionsWithVotes = await Promise.all(
                questions.map(async (question) => {
                    const voteCounts = await this.getVoteCounts(question.question_id);
                    return {
                        questionId: question.question_id,
                        title: question.title,
                        content: question.body,
                        userId: question.user_id,
                        courseId: question.course_id,
                        viewCount: question.view_count,
                        score: question.score,
                        isAnonymous: question.is_anonymous,
                        createdAt: question.created_at,
                        updatedAt: question.updated_at,
                        answerCount: question.answer_count,
                        upVotes: voteCounts.upVotes,
                        downVotes: voteCounts.downVotes
                    };
                })
            );

            return questionsWithVotes;

        } catch (err) {
            console.error('Error getting all questions:', err);
            throw new Error(err.message);
        }
    }

    async updateQuestion(data) {
        try {
            console.log(`Updating the question...`);

            // Check if question exists and user owns it
            const [existing] = await pool.execute(
                'SELECT user_id FROM Question WHERE question_id = ?',
                [data.questionId]
            );

            if (existing.length === 0) {
                throw new Error("Question ID doesn't exist!");
            }

            // Update the question
            await pool.execute(
                `UPDATE Question 
                 SET title = ?, body = ?, is_anonymous = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE question_id = ?`,
                [data.title, data.content, data.isAnonymous || false, data.questionId]
            );

            // Return updated question
            return await this.getSingleQuestion({ questionId: data.questionId });

        } catch (err) {
            console.error('Error updating question:', err);
            throw new Error(err.message);
        }
    }

    async deletQuestion(data) {
        try {
            console.log(`Deleting the question...`);

            const [result] = await pool.execute(
                'DELETE FROM Question WHERE question_id = ?',
                [data.questionId]
            );

            if (result.affectedRows === 0) {
                return {
                    success: false,
                    message: "Question not found or you don't have permission to delete it!"
                };
            }

            return {
                success: true,
                message: "Successfully deleted."
            };

        } catch (err) {
            console.error('Error deleting question:', err);
            throw new Error(err.message);
        }
    }

    async rateQuestion(data) {
        try {
            console.log(`Rating a question...`);

            const connection = await pool.getConnection();
            await connection.beginTransaction();

            try {
                // Check if user already voted on this question
                const [existingVotes] = await connection.execute(
                    `SELECT vote_id, vote_type FROM Votes 
                     WHERE user_id = ? AND question_id = ? AND answer_id IS NULL`,
                    [data.userId, data.questionId]
                );

                // Use string values that match your ENUM
                const voteType = data.type === 1 ? 'upvote' : 'downvote';
                let scoreChange = 0;

                if (existingVotes.length > 0) {
                    const existingVote = existingVotes[0];
                    
                    // If clicking same vote type again, remove the vote (toggle)
                    if (existingVote.vote_type === voteType) {
                        await connection.execute(
                            'DELETE FROM Votes WHERE vote_id = ?',
                            [existingVote.vote_id]
                        );
                        // Remove the previous vote's impact
                        scoreChange = voteType === 'upvote' ? -1 : 1;
                    } else {
                        // If changing vote type, update existing vote
                        await connection.execute(
                            'UPDATE Votes SET vote_type = ? WHERE vote_id = ?',
                            [voteType, existingVote.vote_id]
                        );
                        // Changing vote type: net effect of 2 points
                        scoreChange = (voteType === 'upvote') ? 2 : -2;
                    }
                } else {
                    // Create new vote
                    await connection.execute(
                        `INSERT INTO Votes (vote_type, user_id, question_id) 
                         VALUES (?, ?, ?)`,
                        [voteType, data.userId, data.questionId]
                    );
                    // Add new vote's impact
                    scoreChange = voteType === 'upvote' ? 1 : -1;
                }

                // Update the question score manually
                if (scoreChange !== 0) {
                    await connection.execute(
                        'UPDATE Question SET score = score + ? WHERE question_id = ?',
                        [scoreChange, data.questionId]
                    );

                    // Also update the user's score who posted the question
                    await connection.execute(
                        `UPDATE User u 
                         JOIN Question q ON u.user_id = q.user_id 
                         SET u.score = u.score + ? 
                         WHERE q.question_id = ?`,
                        [scoreChange, data.questionId]
                    );
                }

                // Get the updated question with current score
                const [question] = await connection.execute(
                    'SELECT score FROM Question WHERE question_id = ?',
                    [data.questionId]
                );

                await connection.commit();

                // Get updated vote counts
                const voteCounts = await this.getVoteCounts(data.questionId);

                return {
                    question_id: data.questionId,
                    up_votes: voteCounts.upVotes,
                    down_votes: voteCounts.downVotes,
                    score: question[0].score
                };

            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Error rating question:', error);
            throw error;
        }
    }

    // Helper method to get vote counts for both questions and answers
    async getVoteCounts(entityId) {
        const [votes] = await pool.execute(
            `SELECT 
                COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) as up_votes,
                COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END) as down_votes
             FROM Votes 
             WHERE (question_id = ? OR answer_id = ?)`,
            [entityId, entityId]
        );

        return {
            upVotes: votes[0].up_votes,
            downVotes: votes[0].down_votes
        };
    }
}

module.exports = new QuestionService();
