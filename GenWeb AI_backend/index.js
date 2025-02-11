const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const userModel = require('./db');
app.use(cors());
mongoose.connect('mongodb+srv://210rajdeep:13132030931@cluster0.izjm5.mongodb.net/GenWeb_AI');
app.use(express.json())

app.post('/login',async (req,res)=>{
    const {name,email,picture} = req.body.userInfo;
  
  const userexists =  await userModel.findOne({
    email:email
   })
   if(!userexists){
    await userModel.create({
     name:name,
    email:email,
    picture:picture
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





app.listen(3000,()=>console.log('port 3000 running...'))