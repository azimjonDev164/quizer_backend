const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/questionsController");

router.post("/:quizId", questionController.createQuestion);
router.get("/:id", questionController.getQuestionOfQuizById);
router.get("/", questionController.getAllQuestion);

module.exports = router;
