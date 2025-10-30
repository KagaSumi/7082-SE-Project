const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag-controller");

router.post("/", tagController.createTag); //Not meant to be called in frontend
router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getTagById);
router.put("/:id", tagController.updateTag); //Not meant to be called in frontend
router.delete("/:id", tagController.deleteTag); //Not meant to be called in frontend

module.exports = router;

