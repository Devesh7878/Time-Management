import User from "../models/User.js";

export const getMembers = async (req, res, next) => {
  try {
    const members = await User.find({ role: "Member" }).select("name email role").sort({ name: 1 });
    return res.status(200).json(members);
  } catch (error) {
    return next(error);
  }
};
