const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    filetype: {
      type: String,
      enum: ["pdf", "pptx", "docx"],
      required: true,
    },
    filetext: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
