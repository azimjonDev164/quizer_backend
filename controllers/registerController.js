const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const handleNewUser = async (req, res) => {
  const { user, email, pwd } = req.body;

  console.log({ user, email, pwd });

  if (!user || !email || !pwd) {
    return res
      .status(400)
      .json({ message: "Username, email and password are required." });
  }

  try {
    // Check duplicate email
    const duplicateEmail = await User.findOne({ email }).exec();
    if (duplicateEmail)
      return res.status(409).json({ message: "Email already exists" });

    // Check duplicate username
    const duplicateUser = await User.findOne({ username: user }).exec();
    if (duplicateUser)
      return res.status(409).json({ message: "Username already exists" });

    // Hash password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    // Create user
    const newUser = await User.create({
      username: user,
      email,
      password: hashedPwd,
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpires: expires,
    });

    newUser.save();

    // Send email
    const response = await sendEmail(
      email,
      "Verify your email",
      `Your verification code is: ${otp}. It expires in 10 minutes.`
    );
    console.log(response);
    res.status(201).json({ message: "User created. Please verify email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleVerify = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required." });
    }
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "Already verified" });

    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.verificationCodeExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleReVerify = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    // Always respond the same to prevent user enumeration
    if (!user || user.isVerified) {
      return res.status(200).json({
        message: "If the email exists, a verification code was sent.",
      });
    }

    // Optional: rate limit check here

    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    user.verificationCode = otp;
    user.verificationCodeExpires = expires;
    await user.save();

    await sendEmail(
      email,
      "Verify your email",
      `Your verification code is: ${otp}. It expires in 10 minutes.`
    );

    return res
      .status(200)
      .json({ message: "If the email exists, a verification code was sent." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { handleNewUser, handleVerify, handleReVerify };
