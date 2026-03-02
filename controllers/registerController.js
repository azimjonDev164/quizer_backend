const User = require("../model/User");
const bcrypt = require("bcrypt");
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
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required." });
  }

  try {
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

module.exports = { handleNewUser, handleVerify };
