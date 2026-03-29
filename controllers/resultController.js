const mongoose = require("mongoose");
const Result = require("../model/Result");

const getAllResult = async (req, res) => {
  try {
    const results = await Result.find();
    if (!results) {
      return res.status(204).json({ message: "No results found" });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createResult = async (req, res) => {
  try {
    const { quizId, score, total, answers } = req.body;
    const userId = req.userId; // Assumes your auth middleware provides this

    // 1. Validation
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    // Check if answers is missing or NOT an array
    if (score === undefined || total === undefined || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Score, total, and an array of answers are required",
      });
    }

    // 2. Logic for Attempt Number
    // Find the highest attempt number for this specific user + quiz combo
    const lastAttempt = await Result.findOne({ user: userId, quiz: quizId })
      .sort({ attemptNumber: -1 }) // Sort by highest number first
      .select("attemptNumber");

    const nextAttempt = lastAttempt ? lastAttempt.attemptNumber + 1 : 1;

    // 3. Create the Document
    // Result.create() returns the saved document directly
    const newResult = await Result.create({
      user: userId,
      quiz: quizId,
      score,
      total,
      attemptNumber: nextAttempt,
      answers,
    });

    // 4. Response
    res.status(201).json({
      message: "Result saved successfully",
      data: newResult,
    });
  } catch (error) {
    console.error("Result Creation Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteResult = async (req, res) => {
  try {
    const { id } = req.params; // Usually passed in the URL: /api/results/:id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Result ID" });
    }

    // Security Check: Make sure the user deleting it actually OWNS it
    const result = await Result.findOneAndDelete({ _id: id, user: req.userId });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Result not found or unauthorized" });
    }

    res.status(200).json({ message: "Specific attempt deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllResult, createResult, deleteResult };
