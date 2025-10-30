const courseService = require("../services/course-services");
const ErrorCodes = require("../enums/error-code-enum");

class CourseController {
    async createCourse(req, res) {
        try {
            const course = await courseService.createCourse(req.body);
            res.json(course);
        } catch (err) {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        }
    }

    async getAllCourses(req, res) {
        try {
            const courses = await courseService.getAllCourses();
            res.json(courses);
        } catch (err) {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        }
    }

    async getCourseById(req, res) {
        try {
            const course = await courseService.getCourseById(req.params.courseId);
            res.json(course);
        } catch (err) {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        }
    }

    async deleteCourse(req, res) {
        try {
            const response = await courseService.deleteCourse(req.params.courseId);
            res.json(response);
        } catch (err) {
            res.status(ErrorCodes.INVALID_REQUEST).send(err.message);
        }
    }
}

module.exports = new CourseController();

