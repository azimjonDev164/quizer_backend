const { mongoose } = require("mongoose");
const Quiz = require("../model/Quiz");
const Question = require("../model/Question");

const createQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswer } = req.body;
    const { quizId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    if (!questionText || !options.length > 0 || !correctAnswer) {
      return res.status(400).json({
        message: "Question's text, options and correct answer are required",
      });
    }

    const existingQuestion = await Question.find({ questionText });
    if (existingQuestion) {
      return res.status(409).json({ message: "Question already exists" });
    }

    const result = await Question.create({
      quiz: quizId,
      questionText,
      options,
      correctAnswer,
    });

    result.save();
    return res.status(200).json({ message: "Question created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createQuestion };
