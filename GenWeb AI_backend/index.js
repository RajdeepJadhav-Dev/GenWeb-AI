const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const {userModel,WorkSpaceModel} = require('./db');
app.use(cors());
mongoose.connect('mongodb+srv://210rajdeep:13132030931@cluster0.izjm5.mongodb.net/GenWeb_AI');
app.use(express.json())

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


//testing for the first prompt from the landing page
app.post('/prompt', async (req,res)=>{
    const {messeges,userSub} = req.body;
   const response = await WorkSpaceModel.create({
        messeges:[{content:messeges[0].content,role:messeges[0].role}],
        userSub:userSub
    })
    res.json({
        msg:'messege succesfully stored',
        workspaceId:response._id
    })

})


app.listen(3000,()=>console.log('port 3000 running...'))