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
}

module.exports = new UserService();

