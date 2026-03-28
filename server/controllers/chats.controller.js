import User from "../model/User.js";

const chats = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "No email address recieved" });

  const user = await User.findOne({ email: email });

  if (user) {
    try {
      return res.status(200).json(user.chats);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "Email is not in the database" });
  }
};

export default chats;
