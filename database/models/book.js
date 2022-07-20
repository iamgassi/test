const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
 book_name:{
   type:String,
   required:true,
   unique:true
 },
 book_price:
 {
  type:Number,
  required:true
 },
 
    author_name:{
    type: String,
    required: true
  }
,
created_at:
{ type: Date,
     required: true,
    default: Date.now },
    created_by:{
        type:String,
        required:true
    }
},
  {
   timestamps:true
 })

 const productModel = mongoose.model('Product', bookSchema);

 module.exports=productModel