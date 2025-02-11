const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectid = mongoose.Schema.ObjectId;

const UserSchema = new schema({
    name:String,
    email:String,
    picture:String,
    
})

const userModel = mongoose.model('Users',UserSchema);
module.exports = userModel;