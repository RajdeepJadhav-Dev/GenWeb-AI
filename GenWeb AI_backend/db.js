const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectid = mongoose.Schema.ObjectId;




const UserSchema = new schema({
    name:String,
    email:String,
    picture:String,
    //sub is the unique identifier assigned by the google to the user
    sub: { type: String, unique: true, required: true }
})

const WorkSpaceSchema = new schema({
    messeges:mongoose.Schema.Types.Mixed,
    filedata:mongoose.Schema.Types.Mixed,
    userSub: { type: String, ref: "Users" }
})

const userModel = mongoose.model('Users',UserSchema);
const WorkSpaceModel = mongoose.model('Workspace',WorkSpaceSchema);
module.exports = { userModel, WorkSpaceModel };
