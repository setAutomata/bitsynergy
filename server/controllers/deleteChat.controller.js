import User from "../model/User.js";

const deleteChat = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!id || !email)
    return res.status(400).json({ message: "Email or id not provided" });

  const user = await User.findOne({ email: email });
  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    if (id === "*") {
      await user.updateOne({ $set: { chats: [] } });
      return res.status(200).json({ message: "Chats deleted successfully" });
    }
    const result = await user.updateOne({ $pull: { chats: { _id: id } } });
    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Chat deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Chat not found or already deleted" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default deleteChat;
