import User from "../model/User.js";

const updateTitle = async (req, res) => {
  const { title, email, _id } = req.body;

  if (!title || !_id || !email)
    return res.status(400).json({ message: "Title, id or email not provided" });

  const user = await User.findOne({ email: email });
  const chat = user.chats.id(_id);
  if (!chat)
    return res
      .status(402)
      .send({ maessage: "No chat found with the given id" });

  if (user) {
    try {
      chat.title = title;
      await user.save();
      res.status(200).json({ message: "Title updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "Email is not in the database" });
  }
};

export default updateTitle;
