const { mongoose } = require("mongoose");
const Quiz = require("../model/Quiz");
const Question = require("../model/Question");

const getAllQuestion = async (req, res) => {
  try {
    const questons = await Question.find();
    if (!questons) {
      return res.status(204).json({ message: "No questons found" });
    }
    res.status(200).json(questons);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

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

    if (existingQuestion.length > 0) {
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

const getQuestionOfQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const questions = await Question.find({ quiz: id });
    if (!questions.length > 0) {
      return res.status(201).json({ message: "there no questions" });
    }

    return res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createQuestion, getQuestionOfQuizById, getAllQuestion };
