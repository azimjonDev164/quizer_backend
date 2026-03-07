const { default: mongoose } = require("mongoose");
const User = require("../model/User");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const updateUserRoles = async (req, res) => {
  try {
    const { roles, id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    if (!roles) {
      return res.status(400).json({ message: "roles are required" });
    }

    const user = await User.findById({ _id: id });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.roles = roles;
    user.save();

    return res.status(200).json({ message: "User roles changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  const userId = req.userId;
  if (userId) return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: userId }).exec();
  if (!user) {
    return res.status(204).json({ message: `User ID ${userId} not found` });
  }
  res.status(200).json(user);
};

module.exports = {
  updateUserRoles,
  getAllUsers,
  deleteUser,
  getUser,
};
