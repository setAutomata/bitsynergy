import User from "../model/User.js";

const deleteAccount = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email not provided" });

  const user = await User.findOne({ email: email });
  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    await user.deleteOne({ email: email });
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default deleteAccount;
