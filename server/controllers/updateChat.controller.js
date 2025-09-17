import User from "../model/User.js";

const updateChat = async (req, res) => {
  const { email, _id } = req.body;
  const req_user = req.user;
  const contentAssis = req.assistant;

  if (!email || !_id) console.log("Email or id is not provided");

  let user = await User.findOne({ email: email });

  if (user) {
    try {
      const chat = user.chats.id(_id);
      if (!chat) {
        user.chats.push({
          _id: _id,
          title: req_user.content.slice(0, 30),
          messages: [
            {
              role: "user",
              content: req_user.content,
              images: req_user.images,
            },
            { role: "assistant", content: contentAssis },
          ],
        });
        await user.save();
        console.log("Chat updated successfully");
      } else {
        chat.messages.push({
          role: "user",
          content: req_user.content,
          images: req_user.images,
        });
        chat.messages.push({ role: "assistant", content: contentAssis });
        user.timestamp = Date.now();
        await user.save();
        console.log("Chat updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error("Email is not in the database");
  }
};

export default updateChat;
