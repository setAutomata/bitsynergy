import User from "../model/User.js";

const updateChat = async (req, res) => {
  const { email, _id, messages } = req.body;
  const req_user = messages[messages.length - 1];
  const contentAssis = req.assistant || "";

  if (!email || !_id || !req_user) {
    console.log("Missing required fields: Email, ID, or User Message");
    return res.status(400).send("Missing data");
  }

  let user = await User.findOne({ email: email });

  if (user) {
    try {
      const chat = user.chats.id(_id);
      const safeContent = req_user.content || "";
      const chatTitle = safeContent.slice(0, 30) || "New Conversation";

      if (!chat) {
        user.chats.push({
          _id: _id,
          title: chatTitle,
          messages: [
            {
              role: "user",
              content: safeContent,
              images: req_user.images || [],
            },
            { role: "assistant", content: contentAssis },
          ],
        });
      } else {
        chat.messages.push({
          role: "user",
          content: safeContent,
          images: req_user.images || [],
        });
        chat.messages.push({ role: "assistant", content: contentAssis });
        user.timestamp = Date.now();
      }

      await user.save();
      console.log("Chat updated successfully");
      if (res) res.status(200).send("Success");
    } catch (error) {
      console.error("Database Error:", error);
      if (res) res.status(500).send(error.message);
    }
  } else {
    console.error("Email is not in the database");
    if (res) res.status(404).send("User not found");
  }
};

export default updateChat;
