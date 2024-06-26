const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: {type:String, required:true},
    email: {type:String, required:true,unique:true},
    password: {type:String, required:true},
    role: {type:Array, required:true},
    age: {type:Number, required:true},
},{
    versionKey:false
})

const UserModel = mongoose.model('user',userSchema);

module.exports = UserModel;  //exporting the model so that it can be used in other files