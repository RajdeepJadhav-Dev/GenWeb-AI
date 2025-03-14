const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { chatSession, GenAiCode } = require("./AiModel.js");
const { userModel, WorkSpaceModel } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// ✅ MongoDB Connection (Use Environment Variables for Credentials)
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://210rajdeep:13132030931@cluster0.izjm5.mongodb.net/GenWebAi", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ User Login API
app.post("/login", async (req, res) => {
  try {
    const { name, email, picture, sub } = req.body.userInfo;

    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      await userModel.create({ name, email, picture, sub });
      return res.json({ msg: "User created" });
    }
    res.json({ msg: "User already exists" });
  } catch (error) {
    console.error("❌ Error in /login:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// ✅ User Signout API
app.post("/signout", async (req, res) => {
  try {
    const { email } = req.body;
    await userModel.deleteOne({ email });
    res.json({ msg: "Signed out successfully" });
  } catch (error) {
    console.error("❌ Error in /signout:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// ✅ Handle First Prompt from Landing Page
app.post("/prompt", async (req, res) => {
  try {
    const { messeges, userSub } = req.body;

    let workspace = await WorkSpaceModel.findOne({ userSub });

    if (workspace) {
      workspace.messeges.push({ content: messeges.content, role: messeges.role });
      await workspace.save();
      return res.json({ msg: "Message added to existing workspace", workspaceId: workspace._id });
    }

    const newWorkspace = await WorkSpaceModel.create({
      messeges: [{ content: messeges.content, role: messeges.role }],
      userSub
    });

    res.json({ msg: "New workspace created", workspaceId: newWorkspace._id });
  } catch (error) {
    console.error("❌ Error handling prompt:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// ✅ Fetch Messages for a Given Workspace
app.get("/get/:WorkSpaceId", async (req, res) => {
  try {
    const { WorkSpaceId } = req.params;
    const response = await WorkSpaceModel.findById(WorkSpaceId);

    if (!response || response.messeges.length === 0) {
      return res.status(404).json({ msg: "No messages found" });
    }

    const lastMessage = response.messeges[response.messeges.length - 1];
    res.json({ messeges: [lastMessage] });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// ✅ AI Chat Response (Gemini)
app.post("/AiResponse", async (req, res) => {
  try {
    const { PROMPT } = req.body;
    const result = await chatSession.sendMessage(PROMPT);
    const AIresp = await result.response.text(); // ✅ Fix: Properly handling async response

    res.json({ result: AIresp });
  } catch (error) {
    console.error("❌ Error in AIResponse:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// ✅ AI Code Response (Gemini)
app.post("/AiCodeResponse", async (req, res) => {
  try {
    const { CodePROMPT } = req.body;
    const result = await GenAiCode.sendMessage(CodePROMPT);
    const AICODEresp = await result.response.text(); // ✅ Fix: Properly handling async response

    res.json({ result: AICODEresp });
  } catch (error) {
    console.error("❌ Error in AiCodeResponse:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// ✅ Start the Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}...`);
});
