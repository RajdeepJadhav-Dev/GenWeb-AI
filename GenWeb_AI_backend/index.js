require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { generateWithFallback } = require("./AiModel.js");
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const { userModel, WorkSpaceModel } = require('./db.js');

// ✅ CORS Setup
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
});

app.use(express.json());

mongoose.connect('mongodb+srv://210rajdeep:13132030931@cluster0.izjm5.mongodb.net/GenWeb_AI', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ... your existing login, signout, prompt, get routes ...

//login
app.post('/login', async (req, res) => {
    const { name, email, picture, sub } = req.body.userInfo;
    const userexists = await userModel.findOne({ email: email });
    
    if (!userexists) {
        await userModel.create({ name, email, picture, sub });
        res.json({ msg: 'user created' });
    } else {
        res.json({ msg: 'user already exists' });
    }
});

//signout
app.post('/signout', async (req, res) => {
    const email = req.body.email;
    await userModel.deleteOne({ email: email });
    res.json({ msg: 'signed out succesfully' });
});

//first prompt from the landing page
app.post('/prompt', async (req, res) => {
    const { messeges, userSub } = req.body;
    try {
        let workspace = await WorkSpaceModel.findOne({ userSub: userSub });
        if (workspace) {
            workspace.messeges.push({ content: messeges.content, role: messeges.role });
            await workspace.save();
            res.json({
                msg: 'Message successfully added to existing workspace',
                workspaceId: workspace._id
            });
        } else {
            const newWorkspace = await WorkSpaceModel.create({
                messeges: [{ content: messeges.content, role: messeges.role }],
                userSub: userSub
            });
            res.json({
                msg: 'New workspace created and message stored',
                workspaceId: newWorkspace._id
            });
        }
    } catch (error) {
        console.error('Error handling prompt:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

//for fetching messeges
app.get('/get/:WorkSpaceId', async (req, res) => {
    const WorkspaceId = req.params.WorkSpaceId;
    const response = await WorkSpaceModel.findOne({ _id: WorkspaceId });
    const LastMessege = response.messeges[response.messeges.length - 1];
    res.json({ messeges: [LastMessege] });
});

// ✅ UPDATED: Chat response using the same pattern as your working project
app.post('/AiResponse', async (req, res) => {
    try {
        const { PROMPT } = req.body;
        console.log(`📨 Chat Request - Prompt length: ${PROMPT?.length} chars`);
        
        const AIresp = await generateWithFallback(PROMPT);
        
        console.log(`✅ Chat Response - Length: ${AIresp.length} chars`);
        res.json({ result: AIresp });
        
    } catch (error) {
        console.error('❌ Error in /AiResponse:', error.message);
        res.status(500).json({
            error: 'Failed to generate response',
            message: error.message
        });
    }
});

// ✅ UPDATED: Code response using the same pattern
app.post('/AiCodeResponse', async (req, res) => {
    try {
        const CodePROMPT = req.body.CodePROMPT;
        console.log(`📨 Code Request - Prompt length: ${CodePROMPT?.length} chars`);
        
        let AICODEresp = await generateWithFallback(CodePROMPT);
        
        // ✅ Clean markdown code fences
        AICODEresp = AICODEresp
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();
        
        console.log(`✅ Code Response - Length: ${AICODEresp.length} chars`);
        
        // ✅ Validate JSON before sending
        try {
            const parsed = JSON.parse(AICODEresp);
            console.log(`✅ Valid JSON - Project: ${parsed.projectTitle}`);
            res.json({ result: AICODEresp });
        } catch (parseError) {
            console.error('❌ Invalid JSON:', parseError.message);
            console.error('First 500 chars:', AICODEresp.substring(0, 500));
            
            res.status(500).json({
                error: 'Invalid JSON generated',
                message: parseError.message
            });
        }
        
    } catch (error) {
        console.error('❌ Error in /AiCodeResponse:', error.message);
        res.status(500).json({
            error: 'Failed to generate code',
            message: error.message
        });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}...`));