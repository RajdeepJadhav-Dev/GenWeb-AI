const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const { chatSession } = require("./AiModel.js");
const {GenAiCode} = require("./AiModel.js");
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const {userModel,WorkSpaceModel} = require('./db');
// ✅ CORS Setup
const corsOptions = {
    origin: "*", // Allow all origins (replace with frontend URL for security)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
 // ✅ Security Headers
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
});

app.use(express.json())
mongoose.connect('mongodb+srv://210rajdeep:13132030931@cluster0.izjm5.mongodb.net/GenWeb_AI', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
//login
app.post('/login',async (req,res)=>{
    const {name,email,picture,sub} = req.body.userInfo;
  
  const userexists =  await userModel.findOne({
    email:email
   })
   if(!userexists){
    await userModel.create({
     name:name,
    email:email,
    picture:picture,
    sub:sub
    })
    res.json({
        msg:'user created'
    })
}
else{
res.json({
    msg:'user already exists'
})
}
})

//signout

app.post('/signout',async (req,res)=>{
    const email = req.body.email;
    await userModel.deleteOne({
        email:email
    })
    res.json({
        msg:'signed out succesfully'
    })
})

//first prompt from the landing page
app.post('/prompt', async (req, res) => {
    const { messeges, userSub } = req.body;

    try {
        // Check if a workspace already exists for the given userSub
        let workspace = await WorkSpaceModel.findOne({ userSub: userSub });

        if (workspace) {
            // If workspace exists, push the new message into the existing messeges array
            workspace.messeges.push({ content: messeges.content, role: messeges.role });
            await workspace.save();
            res.json({
                msg: 'Message successfully added to existing workspace',
                workspaceId: workspace._id
            });
        } else {
            // If workspace does not exist, create a new workspace
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
app.get('/get/:WorkSpaceId',async (req,res)=>{
    const WorkspaceId = req.params.WorkSpaceId
    const response = await WorkSpaceModel.findOne({
        _id: WorkspaceId
    })
    const LastMessege = response.messeges[response.messeges.length-1];
    
    res.json({
        messeges:[LastMessege]
    })

})




// gemini chat response
app.post('/AiResponse',async (req,res)=>{
    const {PROMPT} = req.body;
    prompt = PROMPT
    const result = await chatSession.sendMessage(PROMPT);
    const AIresp = result.response.text();
    res.json({
        result:AIresp
    })
})

// gemini code response
app.post('/AiCodeResponse',async (req,res)=>{
    
    const CodePROMPT = req.body.CodePROMPT;
    const result = await GenAiCode.sendMessage(CodePROMPT);
    const AICODEresp = result.response.text();
    
    res.json({
        result:AICODEresp
    })   
  
})



app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}...`));