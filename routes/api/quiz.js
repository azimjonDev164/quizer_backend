const express = require("express");
const router = express.Router();
const quizController = require("../../controllers/quizController");

router.post("/", quizController.createNewQuiz);
router.get("/", quizController.getAllQuizs);
router.put("/:id", quizController.updateQuiz);
router.get("/:id", quizController.getQuizById);
router.delete("/:id", quizController.deleteQuizByid);

module.exports = router;
