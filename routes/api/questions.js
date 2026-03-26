const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/questionsController");

router.get("/:id", questionController.getQuestionOfQuizById);
router.get("/", questionController.getAllQuestion);
router.post("/:quizId", questionController.createQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestionByid);

module.exports = router;
