const { pool } = require("./database");
const bcrypt = require("bcrypt");

class UserService {
    async signup(data) {
        try {
            console.log(`Registering user...`);

            // Generate salt and hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.password, salt);

            // Insert user into DB
            const [result] = await pool.execute(
                `INSERT INTO User (first_name, last_name, email, password, salt, student_id) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [data.firstName, data.lastName, data.email, hashedPassword, salt, data.studentId || null]
            );

            // Fetch the created user
            const [users] = await pool.execute(
                `SELECT user_id, first_name, last_name, email FROM User WHERE user_id = ?`,
                [result.insertId]
            );

            if (users.length === 0) {
                throw new Error("Failed to create user");
            }

            return users[0];

        } catch (err) {
            console.error('Signup error:', err);
            throw new Error(err.message);
        }
    }

    async signin(data) {
        try {
            console.log(`Logging user in...`);

            // Fetch user by email
            const [users] = await pool.execute(
                `SELECT user_id, first_name, last_name, email, password, salt FROM User WHERE email = ?`,
                [data.email]
            );

            if (users.length === 0) {
                throw new Error("User not found");
            }

            const user = users[0];

            // Compare password
            const isMatch = await bcrypt.compare(data.password, user.password);
            if (!isMatch) {
                throw new Error("Invalid password");
            }

            return {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
            };

        } catch (err) {
            console.error('Signin error:', err);
            throw new Error(err.message);
        }
    }
    async getUserById(userId) {
        try {
            console.log(`Fetching user with ID: ${userId}...`);

            const [users] = await pool.execute(
                `SELECT user_id, first_name, last_name, email, student_id, score 
                 FROM User WHERE user_id = ?`,
                [userId]
            );

            if (users.length === 0) {
                throw new Error("User not found");
            }

            return users[0];

        } catch (err) {
            console.error('Get user error:', err);
            throw new Error(err.message);
        }
    }
    async getAnswersByUser(userId) {
        try {
            console.log(`Fetching answers for user: ${userId}...`);

            const [answers] = await pool.execute(
                `SELECT a.answer_id, a.body, a.is_anonymous, a.score, a.created_at, a.updated_at,
                        a.user_id, u.first_name, u.last_name,
                        a.question_id, q.title as question_title,
                        (SELECT COUNT(*) FROM Votes v WHERE v.answer_id = a.answer_id AND v.vote_type = 'upvote') as up_votes,
                        (SELECT COUNT(*) FROM Votes v WHERE v.answer_id = a.answer_id AND v.vote_type = 'downvote') as down_votes
                 FROM Answer a
                 JOIN Question q ON a.question_id = q.question_id
                 JOIN User u ON a.user_id = u.user_id
                 WHERE a.user_id = ?
                 ORDER BY a.created_at DESC`,
                [userId]
            );

            // Map to frontend-friendly shape
            return answers.map(a => ({
                answerId: a.answer_id,
                content: a.body,
                isAnonymous: Boolean(a.is_anonymous),
                score: a.score,
                createdAt: a.created_at,
                updatedAt: a.updated_at,
                firstname: a.first_name,
                lastname: a.last_name,
                userId: a.user_id,
                questionId: a.question_id,
                questionTitle: a.question_title,
                upVotes: a.up_votes,
                downVotes: a.down_votes
            }));

        } catch (err) {
            console.error('Error fetching answers by user:', err);
            throw new Error(err.message);
        }
    }
    async update(userId, body) {
        try {
            console.log(`Updating User with ID: ${userId} ...`);
            // Build update fields
            const fields = [];
            const params = [];

            if (body.firstName !== undefined) {
                fields.push('first_name = ?');
                params.push(body.firstName);
            }

            if (body.lastName !== undefined) {
                fields.push('last_name = ?');
                params.push(body.lastName);
            }

            if (body.studentId !== undefined) {
                fields.push('student_id = ?');
                params.push(body.studentId);
            }

            // If password provided, hash it and store password and salt
            if (body.password) {
                // Require currentPassword to change password
                if (!body.currentPassword) {
                    throw new Error('Current password is required to change password');
                }

                // Verify current password
                const [rows] = await pool.execute(
                    `SELECT password FROM User WHERE user_id = ?`,
                    [userId]
                );
                if (rows.length === 0) {
                    throw new Error('User not found');
                }
                const currentHash = rows[0].password;
                const isMatch = await bcrypt.compare(body.currentPassword, currentHash);
                if (!isMatch) {
                    throw new Error('Current password is incorrect');
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(body.password, salt);
                fields.push('password = ?', 'salt = ?');
                params.push(hashedPassword, salt);
            }

            if (fields.length > 0) {
                params.push(userId);
                const sql = `UPDATE User SET ${fields.join(', ')} WHERE user_id = ?`;
                await pool.execute(sql, params);
            }

            // Return the updated user
            return await this.getUserById(userId);
        } catch (err) {
            console.error('Update User Error:', err)
            throw new Error(err.message);
        }
    }
}

module.exports = new UserService();

