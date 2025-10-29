const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course-controller");

router.post("/", courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/:courseId", courseController.getCourseById);
router.delete("/:courseId", courseController.deleteCourse);

module.exports = router;

