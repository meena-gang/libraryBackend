const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {type:String, required:true},
    authorName: {type:String, required:true},
    price: {type:Number,required:true},
    created_at: {type:Date, default:Date.now},
    userid : {type:String,required:true}
  
},{
    versionKey:false
})

const BookModel = mongoose.model('book',bookSchema);

module.exports = BookModel;  //exporting the model so that it can be used in other files