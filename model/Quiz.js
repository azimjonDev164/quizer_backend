const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    file: { type: Schema.Types.ObjectId, ref: "File" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
