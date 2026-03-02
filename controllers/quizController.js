const Quiz = require("../model/Quiz");

const getAllQuizs = async (req, res) => {
  try {
    const quizs = await Quiz.find();
    if (!quizs.length == 0)
      return res.status(204).json({ message: "No quizs found" });
    res.json(quizs);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const createNewQuiz = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user?._id;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required!" });
    }

    const existingQuiz = await Quiz.findOne({ title });
    if (existingQuiz) {
      return res.status(409).json({ message: "Quiz title already exists" });
    }

    const safeTags = Array.isArray(tags)
      ? tags.map((tag) => String(tag).trim())
      : [];

    const result = await Quiz.create({
      user: userId,
      title,
      description,
      tags: safeTags,
    });

    result.save();

    return res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
