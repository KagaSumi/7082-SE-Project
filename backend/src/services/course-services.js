const { pool } = require("./database");
const ErrorCodes = require("../enums/error-code-enum");

class CourseService {
    async createCourse(data) {
        const { name, code} = data;

        // check if course already exists
        const [existing] = await pool.execute(
            "SELECT * FROM Courses WHERE code = ?",
            [code]
        );

        if (existing.length > 0) {
            throw new Error("Course with this name already exists");
        }

        const [result] = await pool.execute(
            "INSERT INTO Courses (name, code) VALUES (?, ?)",
            [name, code]
        );

        const courseId = result.insertId;

        const [course] = await pool.execute(
            "SELECT * FROM Courses WHERE course_id = ?",
            [courseId]
        );

        return course[0];
    }

    async getAllCourses() {
        const [rows] = await pool.execute("SELECT * FROM Courses");
        return rows;
    }

    async getCourseById(courseId) {
        const [rows] = await pool.execute(
            "SELECT * FROM Courses WHERE course_id = ?",
            [courseId]
        );

        if (rows.length === 0) {
            throw new Error("Course not found");
        }

        return rows[0];
    }

    async deleteCourse(courseId) {
        const [existing] = await pool.execute(
            "SELECT * FROM Courses WHERE course_id = ?",
            [courseId]
        );

        if (existing.length === 0) {
            throw new Error("Course not found");
        }

        await pool.execute("DELETE FROM Courses WHERE course_id = ?", [courseId]);
        return { message: "Course deleted successfully" };
    }
}

module.exports = new CourseService();

