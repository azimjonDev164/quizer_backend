const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Admin: Number,
    },
    password: {
      type: String,
      required: true,
    },

    // 🔥 Email Verification Fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    verificationCodeExpires: Date,

    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
