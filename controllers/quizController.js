const { default: mongoose } = require("mongoose");
const Quiz = require("../model/Quiz");
const Question = require("../model/Question");

const getAllQuizs = async (req, res) => {
  try {
    const quizs = await Quiz.find();
    if (!quizs) {
      return res.status(204).json({ message: "No quizs found" });
    }
    res.status(200).json(quizs);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }
    const quiz = await Quiz.findOne({ _id: id }).populate("file").lean();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const createNewQuiz = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.userId;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required!" });
    }

    const existingQuiz = await Quiz.findOne({ title });
    if (existingQuiz) {
      return res.status(409).json("Quiz title already exists");
    }

    const safeTags = Array.isArray(tags)
      ? tags.map((tag) => String(tag).trim().toLowerCase())
      : [];

    const result = await Quiz.create({
      user: userId,
      title,
      description,
      tags: safeTags,
    });

    result.save();

    return res
      .status(201)
      .json({ message: "Quiz created successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(id);

    if (quiz.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (title !== undefined) quiz.title = title;
    if (description !== undefined) quiz.description = description;

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags must be an array" });
      }

      quiz.tags = tags.map((tag) => String(tag).trim().toLowerCase());
    }

    quiz.save();

    return res
      .status(201)
      .json({ message: "Quiz updated successfully!", quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteQuizByid = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findOneAndDelete({ _id: id, user: req.userId });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found or you are not allowed to delete it",
      });
    }

    await Question.deleteMany({ quiz: id });

    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllQuizs,
  createNewQuiz,
  deleteQuizByid,
  updateQuiz,
  getQuizById,
};
